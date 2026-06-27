import { Cpu, Bot, User, GitBranch, Database, Flag, CircleDot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type NodeType = "start" | "robot" | "agent" | "gateway" | "human" | "end";

const meta: Record<NodeType, { icon: typeof Cpu; ring: string; lane: string }> = {
  start: { icon: CircleDot, ring: "border-success/50 text-success", lane: "Trigger" },
  robot: { icon: Cpu, ring: "border-sky-400/50 text-sky-400", lane: "RPA Robot" },
  agent: { icon: Bot, ring: "border-primary/50 text-primary", lane: "AI Agent" },
  gateway: { icon: GitBranch, ring: "border-warning/50 text-warning", lane: "Decision" },
  human: { icon: User, ring: "border-warning/50 text-warning", lane: "Human task" },
  end: { icon: Flag, ring: "border-success/50 text-success", lane: "End" },
};

const flow: { type: NodeType; title: string; note: string }[] = [
  { type: "start", title: "Invoice received", note: "Email / EDI / portal" },
  { type: "robot", title: "Ingest", note: "Mailbox Robot → Orchestrator queue" },
  { type: "agent", title: "Extract & Normalize", note: "Document understanding agent" },
  { type: "agent", title: "3-Way Match", note: "Invoice ↔ PO ↔ goods receipt" },
  { type: "gateway", title: "Clean & in policy?", note: "Threshold + match rules" },
  { type: "agent", title: "Exception Triage", note: "Classify + recommend" },
  { type: "human", title: "AP Review", note: "Approve / Reject / Escalate" },
  { type: "robot", title: "Post to ERP", note: "ERP Robot → schedule payment" },
  { type: "end", title: "Paid / Closed", note: "Audit trail written" },
];

export default function ProcessFlow() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Maestro BPMN process
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The end-to-end Invoice-to-Pay flow as orchestrated in UiPath Maestro.
          Robots, agents, and people each do the right task at the right time.
        </p>
      </div>

      {/* legend */}
      <div className="mb-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {(["robot", "agent", "gateway", "human"] as NodeType[]).map((t) => {
          const M = meta[t];
          return (
            <span key={t} className="flex items-center gap-1.5">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${M.ring}`}>
                <M.icon className="h-3 w-3" />
              </span>
              {M.lane}
            </span>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            {flow.map((node, i) => {
              const M = meta[node.type];
              const Icon = M.icon;
              return (
                <div key={i}>
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-card ${M.ring}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{node.title}</p>
                        <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {M.lane}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{node.note}</p>
                    </div>
                    {node.type === "gateway" && (
                      <span className="hidden text-xs text-success md:block">
                        78% straight-through →
                      </span>
                    )}
                  </div>
                  {i < flow.length - 1 && (
                    <div className="ml-[21px] h-5 w-px bg-border" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-4 text-sm text-muted-foreground">
            <Database className="h-5 w-5 text-primary" />
            Every step writes to the Orchestrator audit log — full lineage from
            ingestion to payment, with the human decision recorded for compliance.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
