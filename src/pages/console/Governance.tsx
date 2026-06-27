import { ShieldCheck, User, Lock, ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const controls = [
  {
    icon: User,
    title: "Human-in-the-loop gates",
    desc: "Every exception and any invoice over the $10k policy threshold pauses for a named human approval before money moves.",
  },
  {
    icon: Lock,
    title: "Least-privilege agents",
    desc: "Agents read and recommend; only the unattended ERP Robot can post — and only after an approval token is present.",
  },
  {
    icon: ScrollText,
    title: "Full audit lineage",
    desc: "Maestro + Orchestrator record every actor, input, and decision. Each payment traces back to who approved it and why.",
  },
];

const log = [
  { who: "J. Okafor (AP)", what: "Approved INV-4820 · Prysma Design", when: "08:31" },
  { who: "Triage Agent", what: "Recommended approve w/ PO amendment · INV-4821", when: "09:13" },
  { who: "M. Adeyemi (AP)", what: "Rejected INV-4812 · duplicate", when: "Yesterday 16:51" },
  { who: "ERP Robot", what: "Posted INV-4818 to NetSuite", when: "07:42" },
];

export default function Governance() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Governance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Autonomy with accountability. Agents move fast; people stay in control of
          what matters.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {controls.map((c) => (
          <Card key={c.title}>
            <CardContent className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <c.icon className="h-5 w-5 text-primary" />
              </span>
              <p className="mt-3 font-display text-base font-semibold">{c.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Audit log
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {log.map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <span className="font-medium">{l.who}</span>{" "}
                <span className="text-muted-foreground">— {l.what}</span>
              </div>
              <span className="text-xs text-muted-foreground">{l.when}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
