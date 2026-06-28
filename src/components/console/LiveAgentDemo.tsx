import { useState } from "react";
import { Zap, Sparkles, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { runLiveAnalysis, AGENTS_URL, type LiveResult } from "@/lib/agents";
import { formatCurrency } from "@/lib/utils";

type State = "idle" | "loading" | "done" | "error";

export function LiveAgentDemo() {
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<LiveResult | null>(null);
  const [error, setError] = useState("");

  async function run() {
    setState("loading");
    setError("");
    setResult(null);
    try {
      const r = await runLiveAnalysis();
      setResult(r);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setState("error");
    }
  }

  const host = AGENTS_URL.replace(/^https?:\/\//, "");

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Live agent run
        </CardTitle>
        <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted-foreground">
          {host}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Run the real coded agents live — the same deployed service that UiPath
          Maestro calls. This performs a real extraction, 3-way match, and triage
          recommendation on the sample invoice.
        </p>

        <Button onClick={run} disabled={state === "loading"} className="mt-4">
          {state === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Running…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Run live analysis
            </>
          )}
        </Button>

        {state === "loading" && (
          <p className="mt-3 text-xs text-muted-foreground">
            Calling the live agents… the first run can take ~50s if the free
            service was idle.
          </p>
        )}

        {state === "error" && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/[0.06] p-3 text-sm text-danger">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Couldn&apos;t reach the live agents.</p>
              <p className="text-xs opacity-80">
                {error} — the free service may be waking up; try again in a minute.
              </p>
            </div>
          </div>
        )}

        {state === "done" && result && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> Live result received from the
              agents
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Vendor" value={result.invoice.vendor} />
              <Stat
                label="Invoice total"
                value={formatCurrency(result.invoice.total)}
              />
              <Stat
                label="Match"
                value={result.match.status}
                tone={
                  result.match.status === "matched"
                    ? "text-success"
                    : "text-warning"
                }
              />
              <Stat
                label="Route"
                value={result.route.replace("_", " ")}
                tone={
                  result.route === "auto_approve"
                    ? "text-success"
                    : "text-warning"
                }
              />
            </div>

            {result.match.issues.length > 0 && (
              <ul className="space-y-1.5">
                {result.match.issues.map((issue, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-warning"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    {issue}
                  </li>
                ))}
              </ul>
            )}

            {result.triage && (
              <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Triage Agent recommends:{" "}
                  {result.triage.recommended_action.replace("_", " ")} ·{" "}
                  {Math.round(result.triage.confidence * 100)}% confidence
                </p>
                <p className="mt-1 text-sm">{result.triage.recommendation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  tone = "text-foreground",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white/[0.02] p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-0.5 truncate text-sm font-semibold capitalize ${tone}`}>
        {value}
      </p>
    </div>
  );
}
