import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, SeverityDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgentTimeline } from "@/components/console/AgentTimeline";
import { getInvoice, lineTotal } from "@/data/invoices";
import { formatCurrency } from "@/lib/utils";

type Decision = "approved" | "rejected" | "escalated" | null;

export default function InvoiceDetail() {
  const { id } = useParams();
  const invoice = getInvoice(id ?? "");
  const [decision, setDecision] = useState<Decision>(null);

  if (!invoice) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-muted-foreground">
        Invoice not found.{" "}
        <Link to="/app/invoices" className="text-primary hover:underline">
          Back to queue
        </Link>
      </div>
    );
  }

  const computed = invoice.lineItems.reduce((s, li) => s + lineTotal(li), 0);
  const open = invoice.status === "needs_review" && !decision;
  const displayStatus =
    decision === "approved"
      ? "approved"
      : decision === "rejected"
        ? "rejected"
        : invoice.status;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        to="/app/invoices"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Invoice Queue
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="liquid-glass flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold">
            {invoice.vendor[0]}
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              {invoice.vendor}
            </h1>
            <p className="text-sm text-muted-foreground">
              {invoice.invoiceNumber} · PO {invoice.poNumber} · {invoice.category}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-semibold tabular-nums">
            {formatCurrency(invoice.amount)}
          </p>
          <div className="mt-1 flex justify-end">
            <StatusBadge status={displayStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: extracted data + match */}
        <div className="space-y-6 lg:col-span-2">
          {/* Extracted line items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Extracted invoice
              </CardTitle>
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                <Sparkles className="h-3 w-3" />
                {Math.round(invoice.extractionConfidence * 100)}% confidence
              </span>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 font-medium">Description</th>
                    <th className="py-2 text-right font-medium">Qty</th>
                    <th className="py-2 text-right font-medium">Unit</th>
                    <th className="py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((li, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5">{li.description}</td>
                      <td className="py-2.5 text-right tabular-nums">{li.qty}</td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatCurrency(li.unitPrice)}
                      </td>
                      <td className="py-2.5 text-right font-medium tabular-nums">
                        {formatCurrency(lineTotal(li))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-3 text-right text-muted-foreground">
                      Invoice total
                    </td>
                    <td className="py-3 text-right font-display text-base font-semibold tabular-nums">
                      {formatCurrency(computed)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          {/* 3-way match */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> 3-way match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <MatchTile label="Invoice" value={formatCurrency(invoice.amount)} ok />
                <MatchTile
                  label="Purchase order"
                  value={invoice.match.poTotal ? formatCurrency(invoice.match.poTotal) : "None"}
                  ok={invoice.match.poTotal === invoice.amount}
                />
                <MatchTile
                  label="Goods receipt"
                  value={invoice.match.receiptQtyOk ? "Confirmed" : "Partial"}
                  ok={invoice.match.receiptQtyOk}
                />
              </div>
              {invoice.match.issues.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {invoice.match.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-warning">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                      {issue}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Agent recommendation / exception triage */}
          {invoice.exception && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Triage Agent recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <SeverityDot severity={invoice.exception.severity} />
                  <span className="font-medium capitalize">
                    {invoice.exception.type.replace("_", " ")}
                  </span>
                  <span className="text-muted-foreground">
                    · {invoice.exception.severity} severity ·{" "}
                    {Math.round(invoice.exception.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{invoice.exception.detail}</p>
                <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    Recommended action
                  </p>
                  <p className="mt-1 text-sm">{invoice.exception.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT: timeline + human action */}
        <div className="space-y-6">
          {/* Human-in-the-loop action panel */}
          <Card className="border-warning/20">
            <CardHeader>
              <CardTitle>Your decision</CardTitle>
            </CardHeader>
            <CardContent>
              {open ? (
                <>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Maestro paused this case at a human task. Agents have done the
                    analysis — the call is yours.
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="success"
                      className="w-full"
                      onClick={() => setDecision("approved")}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </Button>
                    <Button
                      variant="danger"
                      className="w-full"
                      onClick={() => setDecision("rejected")}
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setDecision("escalated")}
                    >
                      <ArrowUpRight className="h-4 w-4" /> Escalate to Finance
                    </Button>
                  </div>
                </>
              ) : (
                <DecisionResult decision={decision} status={invoice.status} />
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Process timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentTimeline
                events={
                  decision
                    ? [
                        ...invoice.timeline.filter((t) => t.status !== "active"),
                        {
                          id: "decision",
                          actor: "human" as const,
                          by: "Dharan K (AP)",
                          action:
                            decision === "approved"
                              ? "Approved — released to ERP Robot"
                              : decision === "rejected"
                                ? "Rejected — vendor notified"
                                : "Escalated to Finance review",
                          at: "now",
                          status: "done" as const,
                        },
                      ]
                    : invoice.timeline
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MatchTile({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        ok ? "border-success/30 bg-success/[0.06]" : "border-warning/30 bg-warning/[0.06]"
      }`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
      <p className={`mt-1 text-[10px] ${ok ? "text-success" : "text-warning"}`}>
        {ok ? "● matched" : "● exception"}
      </p>
    </div>
  );
}

function DecisionResult({
  decision,
  status,
}: {
  decision: Decision;
  status: string;
}) {
  const map = {
    approved: { icon: CheckCircle2, tone: "text-success", text: "Approved & released to the ERP Robot for posting and payment scheduling." },
    rejected: { icon: XCircle, tone: "text-danger", text: "Rejected. The vendor has been notified automatically by the Notification Robot." },
    escalated: { icon: ArrowUpRight, tone: "text-warning", text: "Escalated to the Finance review queue for a second approval." },
  } as const;
  const resolved = decision ?? (status === "approved" || status === "posted" ? "approved" : status === "rejected" ? "rejected" : null);
  if (!resolved) {
    return (
      <p className="text-sm text-muted-foreground">
        This invoice has already been resolved by the process.
      </p>
    );
  }
  const m = map[resolved];
  const Icon = m.icon;
  return (
    <div className="flex flex-col items-center gap-2 py-2 text-center">
      <Icon className={`h-10 w-10 ${m.tone}`} />
      <p className="text-sm">{m.text}</p>
    </div>
  );
}
