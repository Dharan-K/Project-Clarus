import { useState } from "react";
import type { FormEvent } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { INVOICES } from "@/data/invoices";
import { formatCurrency } from "@/lib/utils";

export function ConsoleLayout() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const reviewQueue = INVOICES.filter((i) => i.status === "needs_review");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(`/app/invoices${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
          <form
            onSubmit={onSearch}
            className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-1.5 text-sm text-muted-foreground focus-within:ring-1 focus-within:ring-primary/40"
          >
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search invoices, vendors, POs…"
              className="w-72 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </form>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              Maestro process live
            </span>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {reviewQueue.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-warning" />
                )}
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                    <div className="border-b border-border px-4 py-3 text-sm font-medium">
                      Needs your review ({reviewQueue.length})
                    </div>
                    <div className="max-h-80 overflow-y-auto py-1">
                      {reviewQueue.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                          You&apos;re all caught up 🎉
                        </p>
                      ) : (
                        reviewQueue.map((inv) => (
                          <Link
                            key={inv.id}
                            to={`/app/invoices/${inv.id}`}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.03]"
                          >
                            <span className="liquid-glass flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold">
                              {inv.vendor[0]}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {inv.vendor}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {inv.invoiceNumber} ·{" "}
                                {inv.exception?.type.replace("_", " ")}
                              </p>
                            </div>
                            <span className="shrink-0 text-xs font-semibold tabular-nums">
                              {formatCurrency(inv.amount)}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
