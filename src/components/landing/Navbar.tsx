import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems: { label: string; to?: string; href?: string }[] = [
  { label: "Platform", to: "/app/process" },
  { label: "Agents", to: "/app/agents" },
  { label: "Governance", to: "/app/governance" },
  { label: "Docs", href: "https://docs.uipath.com/maestro" },
];

export function Navbar() {
  return (
    <header className="relative z-20">
      <nav className="flex items-center justify-between px-8 py-5">
        {/* Left: logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg liquid-glass">
            <span className="font-display text-lg font-semibold gradient-text">
              C
            </span>
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Clarus
          </span>
        </Link>

        {/* Center: nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) =>
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-foreground/90 transition-colors hover:text-foreground hover:bg-white/[0.03]"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to!}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-foreground/90 transition-colors hover:text-foreground hover:bg-white/[0.03]"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Right: CTA */}
        <Link to="/app">
          <Button variant="heroSecondary" size="pill">
            Open Console
          </Button>
        </Link>
      </nav>

      {/* gradient divider */}
      <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </header>
  );
}
