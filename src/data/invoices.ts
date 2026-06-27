import type { Invoice, LineItem } from "./types";

export const lineTotal = (li: LineItem) => li.qty * li.unitPrice;
export const invoiceTotal = (items: LineItem[]) =>
  items.reduce((sum, li) => sum + lineTotal(li), 0);

/**
 * Mock invoice book used by the Console. In production these rows are hydrated
 * from the UiPath Maestro process instances + Orchestrator queue items; here we
 * keep them static so the demo is deterministic.
 */
export const INVOICES: Invoice[] = [
  {
    id: "INV-4821",
    vendor: "Nimbus Cloud Services",
    invoiceNumber: "NCS-2026-0461",
    poNumber: "PO-77310",
    amount: 18450,
    currency: "USD",
    receivedAt: "Today, 09:12",
    dueInDays: 21,
    status: "needs_review",
    category: "Cloud Infrastructure",
    extractionConfidence: 0.97,
    lineItems: [
      { description: "Compute — reserved instances (annual)", qty: 12, unitPrice: 1200 },
      { description: "Object storage — 40TB tier", qty: 1, unitPrice: 3850 },
      { description: "Premium support uplift", qty: 1, unitPrice: 800 },
    ],
    match: {
      status: "exception",
      poTotal: 17650,
      receiptQtyOk: true,
      issues: ["Invoice total exceeds PO by $800 (premium support not on PO)"],
    },
    exception: {
      type: "price_variance",
      severity: "medium",
      detail:
        "Line 3 'Premium support uplift' ($800) is not present on PO-77310. Invoice is $800 over the purchase order.",
      recommendation:
        "Route to AP reviewer. Support uplift matches the signed MSA addendum dated 2026-04-02 — recommend APPROVE with PO amendment.",
      confidence: 0.88,
    },
    timeline: [
      { id: "t1", actor: "robot", by: "Mailbox Robot", action: "Invoice ingested from ap@clarus.io", at: "09:12", status: "done" },
      { id: "t2", actor: "agent", by: "Extraction Agent", action: "Extracted 3 line items, vendor & PO ref", detail: "Confidence 97%", at: "09:12", status: "done" },
      { id: "t3", actor: "agent", by: "Match Agent", action: "Ran 3-way match (invoice ↔ PO ↔ receipt)", detail: "1 exception found", at: "09:13", status: "done" },
      { id: "t4", actor: "agent", by: "Triage Agent", action: "Classified exception: price variance", detail: "Recommends approve w/ PO amendment", at: "09:13", status: "done" },
      { id: "t5", actor: "human", by: "Awaiting AP Reviewer", action: "Human approval required", at: "—", status: "active" },
    ],
  },
  {
    id: "INV-4822",
    vendor: "Vortex Logistics",
    invoiceNumber: "VL-88204",
    poNumber: "PO-77298",
    amount: 6240,
    currency: "USD",
    receivedAt: "Today, 08:47",
    dueInDays: 14,
    status: "needs_review",
    category: "Freight & Logistics",
    extractionConfidence: 0.91,
    lineItems: [
      { description: "LTL freight — Q2 lanes", qty: 48, unitPrice: 120 },
      { description: "Fuel surcharge", qty: 1, unitPrice: 480 },
    ],
    match: {
      status: "exception",
      poTotal: 6240,
      receiptQtyOk: false,
      issues: ["Receipt shows 42 of 48 shipments delivered — 6 not yet received"],
    },
    exception: {
      type: "quantity_mismatch",
      severity: "high",
      detail:
        "Goods receipt confirms 42 of 48 billed shipments. Billing for 6 undelivered shipments ($720).",
      recommendation:
        "Route to AP reviewer. Recommend PARTIAL approval of $5,520; hold $720 pending delivery confirmation.",
      confidence: 0.93,
    },
    timeline: [
      { id: "t1", actor: "robot", by: "Mailbox Robot", action: "Invoice ingested via EDI", at: "08:47", status: "done" },
      { id: "t2", actor: "agent", by: "Extraction Agent", action: "Extracted 2 line items", detail: "Confidence 91%", at: "08:47", status: "done" },
      { id: "t3", actor: "agent", by: "Match Agent", action: "Quantity mismatch vs goods receipt", detail: "42/48 received", at: "08:48", status: "done" },
      { id: "t4", actor: "agent", by: "Triage Agent", action: "Classified: quantity mismatch (high)", at: "08:48", status: "done" },
      { id: "t5", actor: "human", by: "Awaiting AP Reviewer", action: "Human approval required", at: "—", status: "active" },
    ],
  },
  {
    id: "INV-4820",
    vendor: "Prysma Design Co.",
    invoiceNumber: "PRY-1199",
    poNumber: "PO-77280",
    amount: 9600,
    currency: "USD",
    receivedAt: "Today, 08:05",
    dueInDays: 30,
    status: "approved",
    category: "Professional Services",
    extractionConfidence: 0.99,
    lineItems: [
      { description: "Brand system — phase 2", qty: 1, unitPrice: 9600 },
    ],
    match: { status: "matched", poTotal: 9600, receiptQtyOk: true, issues: [] },
    timeline: [
      { id: "t1", actor: "robot", by: "Mailbox Robot", action: "Invoice ingested", at: "08:05", status: "done" },
      { id: "t2", actor: "agent", by: "Extraction Agent", action: "Extracted line item", detail: "Confidence 99%", at: "08:05", status: "done" },
      { id: "t3", actor: "agent", by: "Match Agent", action: "Clean 3-way match", detail: "Under $10k threshold", at: "08:06", status: "done" },
      { id: "t4", actor: "human", by: "J. Okafor (AP)", action: "Approved", at: "08:31", status: "done" },
    ],
  },
  {
    id: "INV-4818",
    vendor: "Cirrus Analytics",
    invoiceNumber: "CA-5521",
    poNumber: "PO-77244",
    amount: 4200,
    currency: "USD",
    receivedAt: "Today, 07:40",
    dueInDays: 28,
    status: "posted",
    category: "Software & SaaS",
    extractionConfidence: 0.98,
    lineItems: [{ description: "Analytics seats — 14 users", qty: 14, unitPrice: 300 }],
    match: { status: "matched", poTotal: 4200, receiptQtyOk: true, issues: [] },
    timeline: [
      { id: "t1", actor: "robot", by: "Mailbox Robot", action: "Invoice ingested", at: "07:40", status: "done" },
      { id: "t2", actor: "agent", by: "Extraction Agent", action: "Extracted line item", at: "07:40", status: "done" },
      { id: "t3", actor: "agent", by: "Match Agent", action: "Clean 3-way match", at: "07:41", status: "done" },
      { id: "t4", actor: "robot", by: "ERP Robot", action: "Posted to NetSuite, payment scheduled", at: "07:42", status: "done" },
    ],
  },
  {
    id: "INV-4815",
    vendor: "Kynder Supplies",
    invoiceNumber: "KS-3380",
    poNumber: "—",
    amount: 1290,
    currency: "USD",
    receivedAt: "Today, 07:18",
    dueInDays: 7,
    status: "needs_review",
    category: "Office & Facilities",
    extractionConfidence: 0.84,
    lineItems: [
      { description: "Ergonomic chairs", qty: 6, unitPrice: 180 },
      { description: "Standing desk converters", qty: 3, unitPrice: 70 },
    ],
    match: {
      status: "exception",
      poTotal: 0,
      receiptQtyOk: true,
      issues: ["No purchase order found for this invoice"],
    },
    exception: {
      type: "missing_po",
      severity: "medium",
      detail: "No PO reference on the invoice and no open PO matched to vendor Kynder Supplies.",
      recommendation:
        "Route to AP reviewer. Amount under $1,500 discretionary limit — recommend approve and back-fill a PO, or reject if unauthorized.",
      confidence: 0.79,
    },
    timeline: [
      { id: "t1", actor: "robot", by: "Mailbox Robot", action: "Invoice ingested", at: "07:18", status: "done" },
      { id: "t2", actor: "agent", by: "Extraction Agent", action: "Extracted 2 line items", detail: "Confidence 84%", at: "07:18", status: "done" },
      { id: "t3", actor: "agent", by: "Match Agent", action: "No PO match found", at: "07:19", status: "done" },
      { id: "t4", actor: "agent", by: "Triage Agent", action: "Classified: missing PO", at: "07:19", status: "done" },
      { id: "t5", actor: "human", by: "Awaiting AP Reviewer", action: "Human approval required", at: "—", status: "active" },
    ],
  },
  {
    id: "INV-4812",
    vendor: "Halcyn Media",
    invoiceNumber: "HM-7740",
    poNumber: "PO-77201",
    amount: 15000,
    currency: "USD",
    receivedAt: "Yesterday, 16:22",
    dueInDays: 19,
    status: "rejected",
    category: "Marketing",
    extractionConfidence: 0.96,
    lineItems: [{ description: "Programmatic ad spend — duplicate", qty: 1, unitPrice: 15000 }],
    match: {
      status: "exception",
      poTotal: 15000,
      receiptQtyOk: true,
      issues: ["Duplicate of INV-4790 already paid on 2026-06-20"],
    },
    exception: {
      type: "duplicate",
      severity: "high",
      detail: "Invoice HM-7740 matches paid invoice INV-4790 (same PO, amount, and period).",
      recommendation: "Recommend REJECT — duplicate submission. Notify vendor.",
      confidence: 0.95,
    },
    timeline: [
      { id: "t1", actor: "robot", by: "Mailbox Robot", action: "Invoice ingested", at: "16:22", status: "done" },
      { id: "t2", actor: "agent", by: "Extraction Agent", action: "Extracted line item", at: "16:22", status: "done" },
      { id: "t3", actor: "agent", by: "Match Agent", action: "Duplicate detected vs INV-4790", at: "16:23", status: "done" },
      { id: "t4", actor: "agent", by: "Triage Agent", action: "Classified: duplicate (high)", at: "16:23", status: "done" },
      { id: "t5", actor: "human", by: "M. Adeyemi (AP)", action: "Rejected — duplicate", at: "16:51", status: "done" },
    ],
  },
];

export function getInvoice(id: string) {
  return INVOICES.find((i) => i.id === id);
}
