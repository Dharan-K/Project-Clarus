import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Workflow,
  Bot,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/invoices", label: "Invoice Queue", icon: Inbox },
  { to: "/app/process", label: "Process Flow", icon: Workflow },
  { to: "/app/agents", label: "Agents", icon: Bot },
  { to: "/app/governance", label: "Governance", icon: ShieldCheck },
];

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card/40">
      <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
        <span className="liquid-glass flex h-8 w-8 items-center justify-center rounded-lg">
          <span className="font-display text-lg font-semibold gradient-text">C</span>
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-semibold">Clarus</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Agentic AP
          </p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-white/[0.06] text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-white/[0.06] text-foreground"
                : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
            )
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            DC
          </span>
          <div className="leading-tight">
            <p className="text-xs font-medium">Dharan K</p>
            <p className="text-[10px] text-muted-foreground">AP Reviewer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
