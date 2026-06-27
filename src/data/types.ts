export type InvoiceStatus =
  | "ingesting"
  | "extracting"
  | "matching"
  | "needs_review"
  | "approved"
  | "posted"
  | "rejected";

export type Actor = "robot" | "agent" | "human" | "system";

export type ExceptionType =
  | "price_variance"
  | "quantity_mismatch"
  | "missing_po"
  | "duplicate"
  | "tax_mismatch"
  | "over_threshold";

export interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface TimelineEvent {
  id: string;
  actor: Actor;
  /** Name of the agent/robot/person that performed the step. */
  by: string;
  action: string;
  detail?: string;
  at: string; // ISO-ish display time
  status: "done" | "active" | "blocked";
}

export interface MatchResult {
  status: "matched" | "exception";
  poTotal: number;
  receiptQtyOk: boolean;
  issues: string[];
}

export interface Exception {
  type: ExceptionType;
  severity: "low" | "medium" | "high";
  detail: string;
  recommendation: string;
  confidence: number; // 0..1
}

export interface Invoice {
  id: string;
  vendor: string;
  invoiceNumber: string;
  poNumber: string;
  amount: number;
  currency: string;
  receivedAt: string;
  dueInDays: number;
  status: InvoiceStatus;
  category: string;
  lineItems: LineItem[];
  match: MatchResult;
  exception?: Exception;
  timeline: TimelineEvent[];
  /** Extraction confidence from the document-understanding agent. */
  extractionConfidence: number;
}

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  ingesting: "Ingesting",
  extracting: "Extracting",
  matching: "3-Way Match",
  needs_review: "Needs Review",
  approved: "Approved",
  posted: "Posted to ERP",
  rejected: "Rejected",
};
