import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Navigation items configuration.
 *
 * Each item supports either:
 * - `to`   → Internal application route handled by React Router.
 * - `href` → External URL opened in a new browser tab.
 *
 * Only one of `to` or `href` is expected to be used for each item.
 */
const navItems: { label: string; to?: string; href?: string }[] = [
  { label: "Platform", to: "/app/process" },
  { label: "Agents", to: "/app/agents" },
  { label: "Governance", to: "/app/governance" },
  { label: "Docs", href: "https://docs.uipath.com/maestro" },
];

/**
 * Navbar
 *
 * Main navigation bar used across the Clarus landing interface.
 *
 * Structure:
 * 1. Left section   → Clarus logo and brand name.
 * 2. Center section → Primary navigation links.
 * 3. Right section  → CTA button for opening the application console.
 * 4. Bottom         → Decorative gradient divider.
 *
 * Internal navigation uses React Router's <Link>.
 * External navigation uses a normal <a> element and opens in a new tab.
 *
 * The center navigation is hidden on smaller screens and becomes
 * visible from the `md` breakpoint onward.
 */
export function Navbar() {
  return (
    <header className="relative z-20">
      <nav className="flex items-center justify-between px-8 py-5">
        {/* ------------------------------------------------------------------
            LEFT SECTION: Brand identity

            Clicking either the Clarus icon or name navigates users back
            to the application's landing page.
        ------------------------------------------------------------------ */}
        <Link to="/" className="flex items-center gap-2.5">
          {/* Glass-style logo container */}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg liquid-glass">
            {/* Clarus initial with gradient typography */}
            <span className="font-display text-lg font-semibold gradient-text">
              C
            </span>
          </span>

          {/* Product / platform name */}
          <span className="font-display text-xl font-semibold tracking-tight">
            Clarus
          </span>
        </Link>

        {/* ------------------------------------------------------------------
            CENTER SECTION: Primary navigation

            Hidden on smaller screens using `hidden`.
            Displayed as a flex container from the `md` breakpoint.

            The rendering logic automatically chooses:
            - <a>    for external URLs (`href`)
            - <Link> for internal application routes (`to`)
        ------------------------------------------------------------------ */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) =>
            item.href ? (
              /* External navigation item */
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
              /* Internal React Router navigation item */
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

        {/* ------------------------------------------------------------------
            RIGHT SECTION: Primary call-to-action

            Routes users to the main Clarus application console.
        ------------------------------------------------------------------ */}
        <Link to="/app">
          <Button variant="heroSecondary" size="pill">
            Open Console
          </Button>
        </Link>
      </nav>

      {/* --------------------------------------------------------------------
          DECORATIVE DIVIDER

          A subtle horizontal gradient line separating the navbar from
          the page content below it.
      -------------------------------------------------------------------- */}
      <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </header>
  );
}
