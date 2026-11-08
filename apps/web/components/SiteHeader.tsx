// The one top bar for every page outside the dashboard's sidebar layout: the Whiteflow wordmark, a section label
// ("Workspace", "Docs", "Capital"), optional tabs, then the page's actions and the day/night switch, always last.
// Same height, border and gutters everywhere. The landing page keeps its own marketing nav; /proofs sits on its scene.
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhiteflowWordmark } from "@/components/WhiteflowLogo";

/** The day/night switch on a plain surface; the landing dresses it as glass instead. */
export const plainToggle =
  "border-hairline text-ink-muted hover:border-accent hover:text-ink";

export function SiteHeader({
  section,
  nav,
  actions,
  contained = true,
}: {
  section?: string;
  nav?: ReactNode;
  actions?: ReactNode;
  /** false: left-aligned like the content below it (Capital), instead of the centred 1240px column */
  contained?: boolean;
}) {
  return (
    <header className="border-b border-hairline bg-surface">
      <div
        className={`flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 md:px-8 ${contained ? "mx-auto max-w-[1240px]" : ""}`}
      >
        {/* a full load: home runs under its own headers (security review 005 F-N4) */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex min-h-11 items-center whitespace-nowrap"
        >
          <WhiteflowWordmark />
        </a>
        {section && (
          <span className="eyebrow text-ink-muted max-sm:hidden">
            {section}
          </span>
        )}
        {nav}
        <div className="ml-auto flex items-center gap-3">
          {actions}
          <ThemeToggle className={plainToggle} />
        </div>
      </div>
    </header>
  );
}
