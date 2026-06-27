import { Link } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Bot,
  User,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { INVOICES, invoiceTotal } from "@/data/invoices";
import { formatCurrency } from "@/lib/utils";

const kpis = [
  { label: "Processed today", value: "142", sub: "+18% vs yesterday", icon: TrendingUp, tone: "text-success" },
  { label: "Auto-approval rate", value: "78%", sub: "111 straight-through", icon: CheckCircle2, tone: "text-success" },
  { label: "Awaiting review", value: "3", sub: "humans in the loop", icon: Clock, tone: "text-warning" },
  { label: "Exceptions caught", value: "$2,240", sub: "held / disputed", icon: AlertTriangle, tone: "text-danger" },
];

const actorIcon = { agent: Bot, robot: Cpu, human: User, system: Cpu };

export default function Dashboard() {
  const recent = INVOICES.slice(0, 5);
  const reviewQueue = INVOICES.filter((i) => i.status === "needs_review");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Invoice-to-Pay overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Agentic accounts payable, orchestrated by UiPath Maestro. Agents do the
          work; you decide the exceptions.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{k.label}</span>
                <k.icon className={`h-4 w-4 ${k.tone}`} />
              </div>
              <p className="mt-2 font-display text-3xl font-semibold">{k.value}</p>
              <p className={`mt-1 text-xs ${k.tone}`}>{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Review queue */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Needs your review</CardTitle>
            <Link
              to="/app/invoices"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View queue <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {reviewQueue.map((inv) => (
              <Link
                key={inv.id}
                to={`/app/invoices/${inv.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <span className="liquid-glass flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold">
                  {inv.vendor[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{inv.vendor}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {inv.invoiceNumber} · {inv.exception?.type.replace("_", " ")}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrency(inv.amount)}
                </span>
                <StatusBadge status={inv.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Live agent feed */}
        <Card>
          <CardHeader>
            <CardTitle>Live agent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.flatMap((inv) =>
              inv.timeline
                .filter((t) => t.status === "done")
                .slice(-1)
                .map((t) => {
                  const Icon = actorIcon[t.actor];
                  return (
                    <div key={inv.id + t.id} className="flex gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.04]">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs">
                          <span className="font-medium">{t.by}</span>{" "}
                          <span className="text-muted-foreground">{t.action.toLowerCase()}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {inv.id} · {t.at}
                        </p>
                      </div>
                    </div>
                  );
                })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Throughput strip */}
      <Card className="mt-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-xs text-muted-foreground">Total value in flight</p>
            <p className="font-display text-2xl font-semibold">
              {formatCurrency(INVOICES.reduce((s, i) => s + invoiceTotal(i.lineItems), 0))}
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Avg. cycle time</p>
            <p className="font-display text-2xl font-semibold">2.4 min</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Touchless rate</p>
            <p className="font-display text-2xl font-semibold gradient-text">78%</p>
          </div>
          <Link to="/app/process">
            <span className="flex items-center gap-1 text-sm text-primary hover:underline">
              See the Maestro flow <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
