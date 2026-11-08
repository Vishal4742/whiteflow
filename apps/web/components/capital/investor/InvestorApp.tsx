"use client";

// The investor's Capital pages (CAPITAL-TAB §4): a top bar with the wordmark, Offers / Your claims, and the wallet (with
// the private-read meter once connected, FR-PRIV-3), over the page's header and its screen. No sign-in: the fund
// signature is the authority and holdings are public reads by address (G8).
import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { PrivateReads } from "@/components/dashboard/PrivateReads";
import { short } from "./format";
import { Holdings } from "./Holdings";
import { OfferBook } from "./OfferBook";
import { useInvestor, type WalletState } from "./useInvestor";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const PAGES = [
  { key: "book", label: "Offers", href: "/capital" },
  { key: "holdings", label: "Your claims", href: "/capital/holdings" },
] as const;

export type InvestorView = (typeof PAGES)[number]["key"];

export interface InvestorAppProps {
  view: InvestorView;
  header: ReactNode;
}

export function InvestorApp({ view, header }: InvestorAppProps) {
  const { state, connect, disconnect } = useInvestor();
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        section="Capital"
        contained={false}
        nav={
            <nav aria-label="Capital" className="flex gap-1">
              {PAGES.map((p) => (
                <a
                  key={p.key}
                  href={p.href}
                  aria-current={p.key === view ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-[10px] px-2.5 text-sm whitespace-nowrap sm:px-3 ${p.key === view ? "bg-accent-soft font-medium text-accent" : "text-ink hover:bg-surface-sunk"}`}
                >
                  {p.label}
                </a>
              ))}
            </nav>
        }
        actions={<WalletChip state={state} connect={connect} disconnect={disconnect} />}
      />
      <main id="main" className="flex-1">
      {header}
      {/* left-aligned with the header's text, as on the dashboard pages */}
      <div className="grid w-full max-w-6xl content-start gap-6 px-4 pt-6 pb-16 md:px-8 md:pt-8">
        {(state.phase === "disconnected" || state.phase === "wrong-network") && state.error && (
          <p role="alert" className="text-sm text-critical">
            {state.error}
          </p>
        )}
        {state.phase === "wrong-network" && !state.error && (
          <p role="status" className="text-sm text-warning">
            Your wallet is on another network. Switch it to Whitechain testnet to buy or to see your claims.
          </p>
        )}
        {view === "book" ? <OfferBook state={state} connect={connect} /> : <Holdings state={state} connect={connect} />}
      </div>
      </main>
      <SiteFooter contained={false} />
    </div>
  );
}

/** Disconnect (batch 063): back to Connect, and no silent reconnect on the next visit until Connect is pressed. */
const Disconnect = ({ onClick }: { onClick: () => void }) => (
  <Button variant="quiet" className="text-sm" onClick={onClick} aria-label="Disconnect wallet">
    Disconnect
  </Button>
);

function WalletChip({ state, connect, disconnect }: { state: WalletState; connect: () => void; disconnect: () => void }) {
  switch (state.phase) {
    case "checking":
      return null;
    case "connecting":
      return <span className="text-sm text-ink-muted">Waiting for your wallet…</span>;
    case "disconnected":
      return (
        <Button className="h-11 px-5 text-sm" onClick={connect}>
          Connect wallet
        </Button>
      );
    case "wrong-network":
      return (
        <>
          <span className="data text-ink-muted max-sm:hidden">{short(state.account)}</span>
          <Button className="h-11 px-5 text-sm" onClick={connect}>
            Switch network
          </Button>
          <Disconnect onClick={disconnect} />
        </>
      );
    case "ready":
      return (
        <>
          <PrivateReads className="shrink-0" />
          <span className="data text-ink-muted max-sm:hidden">{short(state.wallet.account)}</span>
          <Disconnect onClick={disconnect} />
        </>
      );
  }
}
