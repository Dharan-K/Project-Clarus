import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/data/types";
import { STATUS_LABEL } from "@/data/types";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  ingesting: "bg-muted text-muted-foreground border-border",
  extracting: "bg-primary/10 text-primary border-primary/30",
  matching: "bg-primary/10 text-primary border-primary/30",
  needs_review: "bg-warning/10 text-warning border-warning/30",
  approved: "bg-success/10 text-success border-success/30",
  posted: "bg-success/15 text-success border-success/40",
  rejected: "bg-danger/10 text-danger border-danger/30",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {(status === "extracting" || status === "matching") && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SeverityDot({
  severity,
}: {
  severity: "low" | "medium" | "high";
}) {
  const color =
    severity === "high"
      ? "bg-danger"
      : severity === "medium"
        ? "bg-warning"
        : "bg-muted-foreground";
  return <span className={cn("h-2 w-2 rounded-full", color)} />;
}
