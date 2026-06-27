import { Bot, Cpu, User, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/data/types";

const ACTOR_META = {
  agent: { icon: Bot, label: "Agent", ring: "border-primary/40 text-primary" },
  robot: { icon: Cpu, label: "Robot", ring: "border-sky-400/40 text-sky-400" },
  human: { icon: User, label: "Human", ring: "border-warning/40 text-warning" },
  system: { icon: Cpu, label: "System", ring: "border-border text-muted-foreground" },
};

export function AgentTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-5 pl-2">
      {events.map((e, i) => {
        const meta = ACTOR_META[e.actor];
        const Icon = meta.icon;
        const isLast = i === events.length - 1;
        return (
          <li key={e.id} className="relative flex gap-4">
            {/* connector */}
            {!isLast && (
              <span className="absolute left-[15px] top-8 h-[calc(100%+4px)] w-px bg-border" />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-card",
                meta.ring,
                e.status === "active" && "animate-pulse-ring"
              )}
            >
              {e.status === "active" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : e.actor === "human" && e.status === "done" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{e.by}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{e.at}</span>
              </div>
              <p
                className={cn(
                  "text-sm",
                  e.status === "active" ? "text-warning" : "text-muted-foreground"
                )}
              >
                {e.action}
              </p>
              {e.detail && (
                <p className="mt-0.5 text-xs text-muted-foreground/70">{e.detail}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
