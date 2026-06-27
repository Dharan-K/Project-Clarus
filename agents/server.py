"""FastAPI service exposing the Clarus agents as HTTP endpoints.

This is the seam between UiPath and the coded agents. A UiPath Maestro process
(or an API Workflow / HTTP Request activity) calls these endpoints at each step:

    POST /extract   -> Extraction Agent
    POST /match     -> Match Agent (deterministic)
    POST /triage    -> Triage Agent
    POST /process   -> runs the whole pipeline end-to-end (handy for demos)

Run locally:  uvicorn server:app --reload --port 8000
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI
from pydantic import BaseModel

from clarus_agents import extract_invoice, three_way_match, triage_exception

app = FastAPI(title="Clarus Agents", version="0.1.0")

SAMPLES = Path(__file__).parent / "sample_data"


def _run_pipeline(
    document: str,
    purchase_order: Optional[dict[str, Any]],
    goods_receipt: Optional[dict[str, Any]],
    auto_approve_threshold: float = 10_000.0,
) -> dict:
    """Full pipeline: extract -> match -> (route or triage). Shared by /process and /demo."""
    invoice = extract_invoice(document)
    match_result = three_way_match(invoice, purchase_order, goods_receipt)

    clean = match_result["status"] == "matched"
    under_threshold = match_result["invoice_total"] <= auto_approve_threshold

    if clean and under_threshold:
        return {"invoice": invoice, "match": match_result, "triage": None, "route": "auto_approve"}

    triage = triage_exception(invoice, match_result)
    return {"invoice": invoice, "match": match_result, "triage": triage, "route": "human_review"}


class ExtractRequest(BaseModel):
    document: str


class MatchRequest(BaseModel):
    invoice: dict[str, Any]
    purchase_order: Optional[dict[str, Any]] = None
    goods_receipt: Optional[dict[str, Any]] = None


class TriageRequest(BaseModel):
    invoice: dict[str, Any]
    match_result: dict[str, Any]
    policy: Optional[str] = None


class ProcessRequest(BaseModel):
    document: str
    purchase_order: Optional[dict[str, Any]] = None
    goods_receipt: Optional[dict[str, Any]] = None
    auto_approve_threshold: float = 10_000.0


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/extract")
def extract(req: ExtractRequest) -> dict:
    return extract_invoice(req.document)


@app.post("/match")
def match(req: MatchRequest) -> dict:
    return three_way_match(req.invoice, req.purchase_order, req.goods_receipt)


@app.post("/triage")
def triage(req: TriageRequest) -> dict:
    if req.policy:
        return triage_exception(req.invoice, req.match_result, req.policy)
    return triage_exception(req.invoice, req.match_result)


@app.post("/process")
def process(req: ProcessRequest) -> dict:
    """Full pipeline: extract -> match -> (route or triage).

    Returns a decision envelope describing where the case should go next. The
    UiPath process uses `route` to drive its BPMN gateway (auto_approve vs the
    human review task).
    """
    return _run_pipeline(
        req.document, req.purchase_order, req.goods_receipt, req.auto_approve_threshold
    )


@app.get("/demo")
@app.post("/demo")
def demo() -> dict:
    """One-click demo: run the full pipeline on the bundled Nimbus sample.

    Needs no request body — handy for wiring up UiPath Maestro, where the
    Service task can just call this URL. The Nimbus sample has a deliberate $800
    price variance, so it routes to human_review with a triage recommendation.
    """
    document = (SAMPLES / "invoice_nimbus.txt").read_text(encoding="utf-8")
    po = json.loads((SAMPLES / "po_77310.json").read_text(encoding="utf-8"))
    receipt = json.loads((SAMPLES / "receipt_77310.json").read_text(encoding="utf-8"))
    return _run_pipeline(document, po, receipt)
