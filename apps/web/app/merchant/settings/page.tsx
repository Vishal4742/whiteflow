// Whiteflow Workspace Settings (/merchant/settings):
// Workspace profile, receiving-wallet policies, network configuration, and honest permissions disclosures.
import { connection } from "next/server";
import { Suspense } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Shell } from "@/components/dashboard/Shell";
import { Account, EditorialHeader } from "@/components/gateway/Frame";
import { StatusBadge } from "@/components/ui/Badge";
import { LegacyAccess } from "@/components/workspace/LegacyAccess";
import { WorkspaceSettings } from "@/components/workspace/WorkspaceSettings";
import { payConfig } from "@/lib/config";
import { currentMerchant } from "@/lib/merchant-session";
import { relayerHealth } from "@/lib/relay";
import { shortAddress } from "@/lib/format";
import { EXPLORER } from "@/lib/usdt";

export const metadata = { title: "Settings" };

const header = (
  <EditorialHeader
    label="Settings"
    lede="Workspace preferences, receiving-wallet policy, and network parameters."
  >
    Workspace &amp; <span className="emphasis">settlement policy.</span>
  </EditorialHeader>
);


export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <Shell active="settings" privateReads={false}>
          {header}
          <p className="px-4 py-8 text-ink-muted md:px-8">Loading settings…</p>
        </Shell>
      }
    >
      <SettingsLoader />
    </Suspense>
  );
}

async function SettingsLoader() {
  await connection();
  const merchant = await currentMerchant();
  // the Whiteflow workspace (Privy sign-in, team, receiving wallet) shows whether or not a merchant wallet is linked;
  // without a linked wallet, the link step (batch 051) sits right under it
  if (!merchant) {
    return (
      <Shell active="settings" privateReads={false}>
        {header}
        <div className="grid max-w-4xl gap-8 px-4 py-6 md:px-8 md:py-8">
          <WorkspaceSettings />
          <section aria-labelledby="link-heading" className="grid gap-3 rounded-card border border-hairline bg-surface p-5 md:p-6 shadow-card">
            <h2 id="link-heading" className="text-[17px] font-semibold text-ink">Link your existing merchant wallet</h2>
            <p className="text-xs text-ink-muted">If you used the merchant dashboard with a wallet before, link it once: its links, keys and payments come with it.</p>
            <LegacyAccess />
          </section>
        </div>
      </Shell>
    );
  }

  const pay = payConfig();
  const health = pay ? await relayerHealth(pay.relayerUrl) : null;
  const running = health !== null && !health.paused;

  return (
    <Shell active="settings" privateReads={false} account={<Account merchant={merchant} />}>
      {header}
      <div className="grid gap-8 px-4 py-6 md:px-8 md:py-8 max-w-4xl">
        {/* the workspace, its receiving wallet (versioned policy), approval wallets and team: all read from the workspace */}
        <WorkspaceSettings />
        {/* where this workspace is paid, in what a merchant checks a payment against; the relayer's own books stay Whiteflow's */}
        <section aria-labelledby="network-heading" className="grid gap-4 rounded-card border border-hairline bg-surface p-5 md:p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="network-heading" className="text-[17px] font-semibold text-ink">
              Network
            </h2>
            <StatusBadge status={running ? "paid" : "warning"} label={running ? "Network fees covered" : "Payments paused"} />
          </div>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="grid gap-1">
              <dt className="eyebrow text-ink-muted">Network</dt>
              <dd className="font-medium text-ink">Whitechain testnet</dd>
            </div>
            <div className="grid gap-1">
              <dt className="eyebrow text-ink-muted">Paid in</dt>
              <dd className="font-medium text-ink">USDT, in the payment&apos;s own transaction</dd>
            </div>
            {pay?.merchantPay && (
              <div className="grid gap-1 sm:col-span-2">
                <dt className="eyebrow text-ink-muted">Payments contract</dt>
                <dd className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-mono text-ink">{shortAddress(pay.merchantPay)}</span>
                  <CopyButton text={pay.merchantPay} name="payments contract address" label="Copy" />
                  <a href={`${EXPLORER}/address/${pay.merchantPay}`} target="_blank" rel="noreferrer" className="font-medium text-accent underline underline-offset-4">
                    View on explorer ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {!running && <p className="text-xs text-ink-muted">Whiteflow is topping up the network fee balance. Nothing is lost; payments resume shortly.</p>}
        </section>
      </div>
    </Shell>
  );
}
