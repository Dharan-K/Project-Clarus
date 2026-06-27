"""Run the full Clarus agent pipeline on a sample invoice — no UiPath required.

    python run_demo.py

Demonstrates the same extract -> match -> triage flow that UiPath Maestro
orchestrates in production. Useful for the demo video and for verifying your
OPENROUTER_API_KEY is wired up before touching the platform.
"""
from __future__ import annotations

import json
from pathlib import Path

from clarus_agents import extract_invoice, three_way_match, triage_exception

HERE = Path(__file__).parent
SAMPLES = HERE / "sample_data"


def main() -> None:
    document = (SAMPLES / "invoice_nimbus.txt").read_text(encoding="utf-8")
    po = json.loads((SAMPLES / "po_77310.json").read_text(encoding="utf-8"))
    receipt = json.loads((SAMPLES / "receipt_77310.json").read_text(encoding="utf-8"))

    print("1) Extraction Agent ......................................")
    invoice = extract_invoice(document)
    print(json.dumps(invoice, indent=2))

    print("\n2) Match Agent (deterministic 3-way match) ..............")
    match = three_way_match(invoice, po, receipt)
    print(json.dumps(match, indent=2))

    if match["status"] == "matched" and match["invoice_total"] <= 10_000:
        print("\n3) Gateway: clean & under threshold -> AUTO-APPROVED")
        return

    print("\n3) Triage Agent (adaptive reasoning) ....................")
    triage = triage_exception(invoice, match)
    print(json.dumps(triage, indent=2))

    print(
        f"\n=> Routed to HUMAN REVIEW. Agent recommends: "
        f"{triage['recommended_action'].upper()} "
        f"({int(triage['confidence'] * 100)}% confidence)."
    )


if __name__ == "__main__":
    main()
