import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { INVOICES } from "@/data/invoices";
import { STATUS_LABEL, type InvoiceStatus } from "@/data/types";
import { formatCurrency } from "@/lib/utils";

const STATUSES = Object.keys(STATUS_LABEL) as InvoiceStatus[];

export default function InvoiceQueue() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const needle = q.trim().toLowerCase();
  const filtered = INVOICES.filter((inv) => {
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchesQuery =
      !needle ||
      [inv.vendor, inv.invoiceNumber, inv.poNumber, inv.category].some((f) =>
        f.toLowerCase().includes(needle)
      );
    return matchesStatus && matchesQuery;
  });

  function clearSearch() {
    const next = new URLSearchParams(params);
    next.delete("q");
    setParams(next, { replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Invoice Queue
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every invoice and where it sits in the Maestro process.
          </p>
        </div>

        {/* Status filter */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              statusFilter !== "all"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-white/[0.03]"
            }`}
          >
            <Filter className="h-4 w-4" />
            {statusFilter === "all" ? "Filter" : STATUS_LABEL[statusFilter]}
          </button>

          {filterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setFilterOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-xl">
                <FilterRow
                  label="All statuses"
                  active={statusFilter === "all"}
                  onClick={() => {
                    setStatusFilter("all");
                    setFilterOpen(false);
                  }}
                />
                {STATUSES.map((s) => (
                  <FilterRow
                    key={s}
                    label={STATUS_LABEL[s]}
                    active={statusFilter === s}
                    onClick={() => {
                      setStatusFilter(s);
                      setFilterOpen(false);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active filters */}
      {(needle || statusFilter !== "all") && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">
            {filtered.length} of {INVOICES.length}
          </span>
          {needle && (
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-foreground hover:bg-white/[0.03]"
            >
              “{q}” <X className="h-3 w-3" />
            </button>
          )}
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-foreground hover:bg-white/[0.03]"
            >
              {STATUS_LABEL[statusFilter]} <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Vendor</th>
              <th className="px-5 py-3 font-medium">Invoice</th>
              <th className="px-5 py-3 font-medium">PO</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr
                key={inv.id}
                className="group border-b border-border/60 last:border-0 transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-5 py-3">
                  <Link
                    to={`/app/invoices/${inv.id}`}
                    className="flex items-center gap-3"
                  >
                    <span className="liquid-glass flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold">
                      {inv.vendor[0]}
                    </span>
                    <span className="font-medium group-hover:text-foreground">
                      {inv.vendor}
                    </span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {inv.invoiceNumber}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{inv.poNumber}</td>
                <td className="px-5 py-3 text-muted-foreground">{inv.category}</td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums">
                  {formatCurrency(inv.amount)}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={inv.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-muted-foreground"
                >
                  No invoices match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function FilterRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-white/[0.03]"
    >
      <span className={active ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      {active && <Check className="h-3.5 w-3.5 text-primary" />}
    </button>
  );
}
