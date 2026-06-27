import { Bot, FileText, ShieldCheck, Sparkles, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const agents = [
  {
    name: "Extraction Agent",
    icon: FileText,
    built: "Python coded agent + Document Understanding",
    desc: "Reads PDFs/EDI, extracts vendor, line items, totals and PO reference into structured data.",
    runs: 142,
    accuracy: "96.4%",
  },
  {
    name: "Match Agent",
    icon: ShieldCheck,
    built: "Python coded agent",
    desc: "Performs the 3-way match across invoice, purchase order, and goods receipt; flags any discrepancy.",
    runs: 142,
    accuracy: "99.1%",
  },
  {
    name: "Triage Agent",
    icon: Sparkles,
    built: "UiPath Agent Builder + LLM",
    desc: "Classifies exceptions (price variance, quantity, duplicate, missing PO) and recommends an action with rationale.",
    runs: 31,
    accuracy: "92.7%",
  },
  {
    name: "ERP Robot",
    icon: Cpu,
    built: "UiPath RPA (unattended)",
    desc: "Posts approved invoices to the ERP and schedules payment; notifies vendors on rejection.",
    runs: 111,
    accuracy: "100%",
  },
];

export default function Agents() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Agents & Robots</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The workforce behind the process — a mix of coded agents, low-code Agent
          Builder agents, and RPA robots, all orchestrated by Maestro.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {agents.map((a) => (
          <Card key={a.name}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <span className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <a.icon className="h-5 w-5 text-primary" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-base font-semibold">{a.name}</p>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-0.5 text-xs text-primary">{a.built}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
                  <div className="mt-3 flex gap-5 text-xs">
                    <span className="text-muted-foreground">
                      Runs today:{" "}
                      <span className="font-semibold text-foreground">{a.runs}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Accuracy:{" "}
                      <span className="font-semibold text-success">{a.accuracy}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
