"""Triage Agent — classifies a match exception and recommends an action.

Only runs when the Match Agent finds an exception. Uses adaptive thinking so
the model reasons through policy (thresholds, contract terms, duplicates) before
committing to a recommendation. The human AP reviewer makes the final call —
this agent advises, it does not act.

Input  : invoice dict, match_result dict, policy context
Output : {exception_type, severity, detail, recommendation,
          recommended_action, confidence}
"""
from __future__ import annotations

import json

from .llm_client import structured_call

_SCHEMA = {
    "type": "object",
    "properties": {
        "exception_type": {
            "type": "string",
            "enum": [
                "price_variance",
                "quantity_mismatch",
                "missing_po",
                "duplicate",
                "tax_mismatch",
                "over_threshold",
                "none",
            ],
        },
        "severity": {"type": "string", "enum": ["low", "medium", "high"]},
        "detail": {"type": "string", "description": "One or two sentences on the discrepancy."},
        "recommendation": {
            "type": "string",
            "description": "Recommended action with rationale, for the AP reviewer.",
        },
        "recommended_action": {
            "type": "string",
            "enum": ["approve", "partial_approve", "reject", "escalate"],
        },
        "confidence": {"type": "number", "description": "0..1 confidence."},
    },
    "required": [
        "exception_type",
        "severity",
        "detail",
        "recommendation",
        "recommended_action",
        "confidence",
    ],
    "additionalProperties": False,
}

_SYSTEM = (
    "You are an accounts-payable exception-triage agent. Given an invoice, the "
    "result of a 3-way match, and the company's AP policy, classify the "
    "exception, judge its severity, and recommend an action for a human AP "
    "reviewer. Be specific and cite the policy or evidence behind your "
    "recommendation. You advise; a human approves. Never recommend paying a "
    "duplicate or an undelivered quantity."
)

DEFAULT_POLICY = (
    "AP policy: invoices at or under $10,000 with a clean 3-way match auto-"
    "approve. Anything over $10,000 or with any exception requires human "
    "review. Discretionary spend under $1,500 without a PO may be approved by "
    "the reviewer and back-filled with a PO. Price variances that match a "
    "signed contract/MSA addendum may be approved with a PO amendment. "
    "Quantity mismatches should be partially approved for the delivered "
    "portion only. Suspected duplicates must be rejected."
)


def triage_exception(
    invoice: dict,
    match_result: dict,
    policy: str = DEFAULT_POLICY,
) -> dict:
    """Classify a match exception and recommend an action (with reasoning)."""
    user = (
        f"AP POLICY:\n{policy}\n\n"
        f"INVOICE:\n{json.dumps(invoice, indent=2)}\n\n"
        f"3-WAY MATCH RESULT:\n{json.dumps(match_result, indent=2)}\n\n"
        "Classify the exception and recommend an action for the AP reviewer."
    )
    return structured_call(
        system=_SYSTEM,
        user=user,
        schema=_SCHEMA,
        schema_name="exception_triage",
        thinking=True,
        max_tokens=4096,
    )
