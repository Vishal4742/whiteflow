// Whiteflow navigation (FR-UX-2): the five destinations Overview, Invoices, Payments, Connections, Settings, then the
// existing gateway tools (links, pages, vouchers, reports, settlements, developers, docs) and legacy Capital, outside the
// five (its existing positions stay visible). Between screens that send the same CSP a link is next/link (a client
// navigation, the shell prefetched, NFR-13); every other link is a plain <a>, a full load under its own headers
// (security review 005 F-N4, lib/soft-nav.ts). At phone width the list folds into a menu; from md up it is the sidebar.
import Link from "next/link";
import { FoldedMenu } from "@/components/dashboard/FoldedMenu";
import { softNav } from "@/lib/soft-nav";

const SECTIONS = [
  {
    title: "Workspace",
    items: [
      { key: "home", label: "Overview", href: "/merchant", icon: "overview" },
      { key: "invoices", label: "Invoices", href: "/merchant/invoices", icon: "invoices" },
      { key: "payments", label: "Payments", href: "/merchant/payments", icon: "payments" },
      { key: "connections", label: "Connections", href: "/merchant/connections", icon: "connections" },
      { key: "settings", label: "Settings", href: "/merchant/settings", icon: "settings" },
    ],
  },
  {
    title: "Collections",
    items: [
      { key: "links", label: "Payment links", href: "/merchant/links", icon: "link" },
      { key: "pages", label: "Payment pages", href: "/merchant/pages", icon: "pages" },
      { key: "vouchers", label: "Vouchers", href: "/merchant/vouchers", icon: "voucher" },
    ],
  },
  {
    title: "Accounting",
    items: [
      { key: "reports", label: "Reports", href: "/merchant/reports", icon: "reports" },
      { key: "settlements", label: "Settlements", href: "/merchant/settlements", icon: "settlements" },
      { key: "capital", label: "Capital", href: "/merchant/capital", icon: "capital" },
    ],
  },
  {
    title: "Developers",
    items: [
      { key: "keys", label: "API keys", href: "/merchant/developers", icon: "key" },
      { key: "webhooks", label: "Webhooks", href: "/merchant/developers#webhooks", icon: "webhooks" }, // a section of Developers (batch 045)
      { key: "docs", label: "Docs", href: "/docs", icon: "docs" },
    ],
  },
] as const;

export type NavKey = (typeof SECTIONS)[number]["items"][number]["key"];

// Outline icons, 24 × 24 at a 1.8 stroke (Heroicons v1, MIT): every nav item has one, so the labels line up.
const ICONS: Record<string, readonly string[]> = {
  overview: ["M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"],
  invoices: ["M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"],
  payments: ["M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"],
  connections: ["M13 10V3L4 14h7v7l9-11h-7z"],
  settings: ["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"],
  link: ["M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"],
  pages: ["M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"],
  voucher: ["M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"],
  reports: ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
  settlements: ["M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"],
  capital: ["M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"],
  key: ["M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"],
  webhooks: ["M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"],
  docs: ["M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"],
};

function NavIcon({ name }: { name: string }) {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {(ICONS[name] ?? []).map((d) => (
        <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  );
}

const row = "flex min-h-9 items-center justify-between gap-2.5 rounded-field px-2.5 text-sm transition-colors";

const hrefOf = (key: NavKey) => SECTIONS.flatMap((section): readonly { key: NavKey; href: string }[] => section.items).find((item) => item.key === key)?.href ?? "";

function List({ active }: { active: NavKey }) {
  const here = hrefOf(active);
  return (
    <div className="grid gap-1">
      {SECTIONS.map((section) => (
        <ul key={section.title} className="grid gap-0.5" aria-label={section.title}>
          <li aria-hidden="true" className="eyebrow mt-3 mb-1 px-2.5 text-ink-muted">
            {section.title}
          </li>
          {section.items.map((item) => {
            const isCurrent = item.key === active;
            const className = `${row} ${isCurrent ? "bg-accent-soft font-medium text-accent" : "text-ink hover:bg-surface-sunk"}`;
            const label = (
              <span className="flex min-w-0 items-center gap-2">
                <NavIcon name={item.icon} />
                <span className="truncate">{item.label}</span>
              </span>
            );
            return (
              <li key={item.key}>
                {softNav(here, item.href) ? (
                  <Link href={item.href} aria-current={isCurrent ? "page" : undefined} className={className}>
                    {label}
                  </Link>
                ) : (
                  // a full load: this screen or the target sends another CSP (F-N4)
                  <a href={item.href} aria-current={isCurrent ? "page" : undefined} className={className}>
                    {label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}

export function Nav({ active }: { active: NavKey }) {
  const current = SECTIONS.flatMap((section): readonly { key: NavKey; label: string }[] => section.items).find((item) => item.key === active)?.label;
  return (
    <nav aria-label="Dashboard" className="w-full">
      <FoldedMenu className="group rounded-[10px] border border-hairline bg-surface md:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-3.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <span className="text-ink">Menu</span>
            <span className="font-normal text-ink-muted">· {current}</span>
          </span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="border-t border-hairline p-2">
          <List active={active} />
        </div>
      </FoldedMenu>
      <div className="hidden md:block">
        <List active={active} />
      </div>
    </nav>
  );
}
