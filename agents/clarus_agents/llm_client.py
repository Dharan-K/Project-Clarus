"""Shared LLM client + helpers for the Clarus agents.

Talks to OpenRouter (https://openrouter.ai) through the OpenAI-compatible SDK,
so any model OpenRouter hosts — including free ones like Google's Gemma — works
out of the box. Swap the model with CLARUS_MODEL.

Free / open models generally don't support provider-native structured outputs,
so we guarantee JSON the portable way: embed the schema in the prompt, ask for
JSON only, request response_format=json_object when the model supports it, and
parse defensively.
"""
from __future__ import annotations

import json
import os
import re
from functools import lru_cache
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Default to a free OpenRouter model. Override with CLARUS_MODEL.
MODEL = os.getenv("CLARUS_MODEL", "google/gemma-4-26b-a4b-it:free")


@lru_cache(maxsize=1)
def get_client() -> OpenAI:
    """Return a process-wide OpenAI client pointed at OpenRouter.

    Reads OPENROUTER_API_KEY from the environment (or a .env file).
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not set. Add it to agents/.env "
            "(see .env.example). Get a key at https://openrouter.ai/keys"
        )
    return OpenAI(
        base_url=OPENROUTER_BASE_URL,
        api_key=api_key,
        # Free models can be slow/busy — fail fast instead of hanging forever,
        # and let the SDK auto-retry transient rate limits with backoff.
        timeout=60.0,
        max_retries=3,
        # Optional OpenRouter attribution headers — handy on their dashboard.
        default_headers={
            "HTTP-Referer": os.getenv("CLARUS_SITE_URL", "https://clarus.local"),
            "X-Title": "Clarus AP Agents",
        },
    )


def _parse_json(text: str) -> dict:
    """Parse a JSON object out of a model response, tolerating stray prose.

    Handles ```json fenced blocks and leading/trailing chatter by falling back
    to the outermost {...} span.
    """
    text = text.strip()

    fenced = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if fenced:
        text = fenced.group(1).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(text[start : end + 1])
        raise RuntimeError(f"Model did not return JSON:\n{text[:500]}")


def _unwrap(parsed: dict, schema: dict) -> dict:
    """Unwrap an accidentally-nested object, e.g. {"my_schema": {...}}.

    Smaller models sometimes wrap the answer in a single key. If the top level
    is missing the schema's required fields but has exactly one nested object,
    return that nested object instead.
    """
    if not isinstance(parsed, dict):
        return parsed
    required = set(schema.get("required", []))
    if required and required.issubset(parsed.keys()):
        return parsed
    if len(parsed) == 1:
        only = next(iter(parsed.values()))
        if isinstance(only, dict):
            return only
    return parsed


def structured_call(
    *,
    system: str,
    user: str,
    schema: dict,
    schema_name: str,
    thinking: bool = False,
    max_tokens: int = 4096,
) -> dict:
    """Call the model and return a dict matching `schema`.

    `thinking` asks OpenRouter to enable reasoning for models that support it
    (e.g. the Triage Agent); it degrades gracefully when the model does not.
    """
    schema_block = json.dumps(schema, indent=2)
    system_with_schema = (
        f"{system}\n\n"
        f"Respond with a single JSON object that conforms EXACTLY to this JSON "
        f"Schema. Return the object's fields at the top level — do NOT wrap it "
        f"in an outer key. Output JSON only — no markdown, no prose, no code "
        f"fences:\n{schema_block}"
    )

    messages = [
        {"role": "system", "content": system_with_schema},
        {"role": "user", "content": user},
    ]

    base_kwargs: dict[str, Any] = {
        "model": MODEL,
        "max_tokens": max_tokens,
        "messages": messages,
    }
    if thinking:
        base_kwargs["extra_body"] = {"reasoning": {"enabled": True}}

    # Prefer JSON mode; retry without it for models/providers that reject it.
    try:
        resp = get_client().chat.completions.create(
            response_format={"type": "json_object"}, **base_kwargs
        )
    except Exception:
        resp = get_client().chat.completions.create(**base_kwargs)

    content = resp.choices[0].message.content or ""
    return _unwrap(_parse_json(content), schema)
