// Shared pieces of the Whiteflow gateway screens:
// Editorial header, card styles, input field tokens, account badges, and signed-out states.
import type { ReactNode } from "react";
import { LegacyAccess, WorkspaceSignOut } from "@/components/workspace/LegacyAccess";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export { plainToggle } from "@/components/SiteHeader";
export const card = "grid min-w-0 content-start gap-4 rounded-card border border-hairline bg-surface p-5 md:p-6 shadow-card";
export const field = "h-11 w-full min-w-0 rounded-field border border-hairline bg-surface px-3 text-ink text-sm focus:border-accent transition-colors";
export const textLink = "inline-flex min-h-10 items-center text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-hover transition-colors";
/** Halftone grain printed into a surface: one CSS gradient, no image bytes. */
export const grain = "bg-[radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--ink)_7%,transparent)_1px,transparent_1.4px)] bg-size-[4px_4px]";
/** The same grain in light dots, for the night surface. */
export const nightGrain = "bg-scene-night bg-[radial-gradient(circle_at_1px_1px,rgba(237,237,243,0.07)_1px,transparent_1.4px)] bg-size-[4px_4px]";

export function EditorialHeader({
  label,
  lede,
  children,
  action,
}: {
  label: string;
  lede?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="grid gap-4 border-b border-hairline bg-surface/50 px-4 pt-7 pb-6 backdrop-blur-xs md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-start md:gap-6 md:px-8 md:pt-10 md:pb-8">
      <span className="eyebrow self-start border-t border-accent pt-2.5 font-medium text-accent">
        {label}
      </span>
      <div className="grid gap-2 max-w-2xl">
        <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">
          {children}
        </h1>
        {lede && <p className="text-sm text-ink-muted leading-relaxed">{lede}</p>}
      </div>
      {action && <div className="self-start md:ml-auto">{action}</div>}
    </header>
  );
}

/** A section label over a rule, as in the design's spec grid. */
export const SectionLabel = ({ id, children }: { id?: string; children: ReactNode }) => (
  <h2 id={id} className="eyebrow border-t border-hairline pt-3 font-medium text-ink-muted">
    {children}
  </h2>
);

export function Problem({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="flex items-start gap-3 rounded-[12px] border border-warning/30 bg-warning/10 p-4 text-sm text-ink">
      <span className="mt-0.5 text-warning" aria-hidden="true">⚠️</span>
      <div className="grow">{children}</div>
    </div>
  );
}

export function Account({ merchant }: { merchant: string }) {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <span className="data text-xs font-mono text-ink bg-surface-sunk px-2 py-1 rounded-[6px] border border-hairline">
        {merchant.slice(0, 6)}…{merchant.slice(-4)}
      </span>
      <WorkspaceSignOut />
    </div>
  );
}

/** A dashboard page without the Shell: the wordmark home and a label, over the page. */
export function PlainPage({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader section="Workspace" />
      <main id="main" className="mx-auto max-w-[1240px] px-4 pt-6 pb-16 md:px-8">{children}</main>
      <SiteFooter />
    </>
  );
}


/** Every dashboard page without a linked workspace (batch 051): what a business gets, and the way in: Whiteflow
 *  sign-in, a workspace, then an Owner links the merchant wallet (LegacyAccess). `available` (the retired wallet
 *  cookie's secret) is ignored; the SIWE cleanup batch removes it from the pages. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SignedOut(props: { available?: boolean }) {
  return (
    <PlainPage>
      <div className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
        <div className="grid content-start gap-5 lg:pt-4">
          <span className="eyebrow self-start border-t border-accent pt-2.5 font-medium text-accent">
            Whiteflow Business Workspace
          </span>
          <h1 className="max-w-[15ch] text-[38px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[52px]">
            One invoice. <span className="emphasis text-accent">Clear settlement.</span>
          </h1>
          <p className="max-w-[44ch] text-sm text-ink-muted leading-relaxed">Get paid in USDT on Whitechain, straight to your own wallet.</p>
        </div>
        <section aria-labelledby="setup" className={`${card} gap-3 shadow-card lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start`}>
          <h2 id="setup" className="text-base font-semibold text-ink">
            Open your workspace
          </h2>
          <LegacyAccess />
          <div className="grid gap-2 border-t border-hairline pt-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <form method="post" action="/api/demo-checkout">
                <button type="submit" className={`${textLink} cursor-pointer`}>
                  Try sample customer checkout
                </button>
              </form>
              <a href="/docs" className={textLink}>
                Developer documentation
              </a>
            </div>
            <p className="text-xs text-ink-muted">
              Test mode: Whitechain testnet. No real funds move.
            </p>
          </div>
        </section>
      </div>
    </PlainPage>
  );
}
