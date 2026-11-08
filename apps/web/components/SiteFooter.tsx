// The one footer for the pages outside the dashboard and the pay screens (Workspace, Docs, Capital, 404): where to
// go next, and the testnet note the landing page carries too. Checkout, invoices and receipts stay free of it.
import Link from "next/link";

const LINKS = [
  ["/docs", "Docs"],
  ["/pricing", "Pricing"],
  ["/status", "Status"],
  ["/mcp", "Connect your AI"],
  ["https://shop.whiteflow.org", "Demo shop"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["https://github.com/Vishal4742/whiteflow", "GitHub"],
] as const;

/** `contained={false}` lines it up with full-width pages (Capital), as SiteHeader does. */
export function SiteFooter({ contained = true }: { contained?: boolean }) {
  return (
    <footer className="border-t border-hairline">
      <div
        className={`flex flex-wrap items-center gap-x-6 px-4 py-3 text-sm text-ink-muted md:px-8 ${contained ? "mx-auto max-w-[1240px]" : ""}`}
      >
        <span className="inline-flex min-h-11 items-center">
          Whitechain testnet only
        </span>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
