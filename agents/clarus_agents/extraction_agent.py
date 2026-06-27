"""Extraction Agent — turns a raw invoice document into structured data.

Input  : raw invoice text (from OCR / email body / PDF text layer)
Output : {vendor, invoice_number, po_number, currency, line_items[], total,
          extraction_confidence}
"""
from __future__ import annotations

from .llm_client import structured_call

_SCHEMA = {
    "type": "object",
    "properties": {
        "vendor": {"type": "string"},
        "invoice_number": {"type": "string"},
        "po_number": {"type": "string", "description": "PO reference, or empty string if none"},
        "currency": {"type": "string", "description": "ISO currency code, e.g. USD"},
        "line_items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "description": {"type": "string"},
                    "quantity": {"type": "number"},
                    "unit_price": {"type": "number"},
                },
                "required": ["description", "quantity", "unit_price"],
                "additionalProperties": False,
            },
        },
        "total": {"type": "number"},
        "extraction_confidence": {
            "type": "number",
            "description": "0..1 confidence in the extraction",
        },
    },
    "required": [
        "vendor",
        "invoice_number",
        "po_number",
        "currency",
        "line_items",
        "total",
        "extraction_confidence",
    ],
    "additionalProperties": False,
}

_SYSTEM = (
    "You are an accounts-payable document-understanding agent. Extract the "
    "vendor, invoice number, purchase-order reference, currency, every line "
    "item (description, quantity, unit price), and the invoice total from the "
    "document. Be precise with numbers. If a purchase-order reference is not "
    "present, return an empty string for po_number. Report a calibrated "
    "extraction_confidence between 0 and 1."
)


def extract_invoice(raw_document: str) -> dict:
    """Extract a structured invoice from raw document text."""
    return structured_call(
        system=_SYSTEM,
        user=f"Extract the invoice below.\n\n---\n{raw_document}\n---",
        schema=_SCHEMA,
        schema_name="invoice_extraction",
        max_tokens=2048,
    )
