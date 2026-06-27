"""Match Agent — deterministic 3-way match across invoice, PO and goods receipt.

This step is intentionally rule-based, not LLM-based: a 3-way match is exact
arithmetic and auditors need it to be reproducible. The (optional) LLM reasoning
lives in the downstream Triage Agent, which only runs when this finds an issue.

Input  : extracted invoice dict, purchase_order dict, goods_receipt dict
Output : {status, invoice_total, po_total, received_ok, issues[]}
"""
from __future__ import annotations

# Tolerance for floating-point / rounding noise when comparing money.
_MONEY_EPS = 0.01


def _invoice_total(invoice: dict) -> float:
    return round(
        sum(li["quantity"] * li["unit_price"] for li in invoice["line_items"]), 2
    )


def three_way_match(
    invoice: dict,
    purchase_order: dict | None,
    goods_receipt: dict | None,
) -> dict:
    """Run the 3-way match and return a structured result.

    purchase_order: {"po_number": str, "total": float, "quantity": float}
    goods_receipt:  {"received_quantity": float, "ordered_quantity": float}
    Either may be None (e.g. no PO on file).
    """
    issues: list[str] = []
    invoice_total = _invoice_total(invoice)
    po_total = float(purchase_order["total"]) if purchase_order else 0.0

    # 1. Invoice <-> PO
    if purchase_order is None or not invoice.get("po_number"):
        issues.append("No purchase order found for this invoice.")
    else:
        delta = round(invoice_total - po_total, 2)
        if abs(delta) > _MONEY_EPS:
            sign = "exceeds" if delta > 0 else "is under"
            issues.append(
                f"Invoice total {invoice_total:.2f} {sign} PO total "
                f"{po_total:.2f} by {abs(delta):.2f}."
            )

    # 2. PO <-> goods receipt (quantity delivered)
    received_ok = True
    if goods_receipt is not None:
        received = float(goods_receipt.get("received_quantity", 0))
        ordered = float(goods_receipt.get("ordered_quantity", received))
        if received + 1e-9 < ordered:
            received_ok = False
            issues.append(
                f"Goods receipt confirms {received:g} of {ordered:g} units "
                f"delivered."
            )

    return {
        "status": "matched" if not issues else "exception",
        "invoice_total": invoice_total,
        "po_total": po_total,
        "received_ok": received_ok,
        "issues": issues,
    }
