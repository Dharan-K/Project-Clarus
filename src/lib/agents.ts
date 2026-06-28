/**
 * Client for the live Clarus agents — the same FastAPI service that UiPath
 * Maestro calls. Lets the Console run the real coded agents from the browser.
 */

export const AGENTS_URL =
  ((import.meta.env.VITE_AGENTS_URL as string | undefined) ??
    "https://clarus-agents.onrender.com").replace(/\/$/, "");

export interface LiveLineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface LiveResult {
  route: "auto_approve" | "human_review";
  invoice: {
    vendor: string;
    invoice_number: string;
    po_number: string;
    currency: string;
    line_items: LiveLineItem[];
    total: number;
    extraction_confidence: number;
  };
  match: {
    status: string;
    invoice_total: number;
    po_total: number;
    received_ok: boolean;
    issues: string[];
  };
  triage: null | {
    exception_type: string;
    severity: string;
    detail: string;
    recommendation: string;
    recommended_action: string;
    confidence: number;
  };
}

/** Calls the live agents' /demo pipeline and returns the real result. */
export async function runLiveAnalysis(signal?: AbortSignal): Promise<LiveResult> {
  const res = await fetch(`${AGENTS_URL}/demo`, { signal });
  if (!res.ok) throw new Error(`Agents returned HTTP ${res.status}`);
  return (await res.json()) as LiveResult;
}
