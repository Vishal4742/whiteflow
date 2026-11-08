// /status: can customers pay right now? The relayer's own health (lib/relay.ts relayerHealth, 3 s timeout), read on
// every request; the same reading and words as the Network card in Settings.
import { connection } from "next/server";
import { Suspense } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusBadge, type StatusTone } from "@/components/ui/Badge";
import { payConfig } from "@/lib/config";
import { formatDateTime } from "@/lib/format";
import { relayerHealth } from "@/lib/relay";

export const metadata = {
  title: "Status",
  description: "Whether payments on Whiteflow are running right now.",
  alternates: { canonical: "/status" },
};

export default function StatusPage() {
  return (
    <>
      <SiteHeader section="Status" />
      <main id="main" className="mx-auto grid max-w-[760px] content-start gap-8 px-4 pt-10 pb-24 md:px-8">
        <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">Status</h1>
        <Suspense fallback={<p className="text-ink-muted">Checking payments…</p>}>
          <Payments />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

const STATES: Record<"running" | "paused" | "unknown" | "off", { tone: StatusTone; label: string; text: string }> = {
  running: { tone: "paid", label: "Running", text: "Customers can pay, and Whiteflow is covering the network fees." },
  paused: { tone: "warning", label: "Paused", text: "Whiteflow is topping up the network fee balance. Nothing is lost; payments resume shortly." },
  unknown: { tone: "warning", label: "Unknown", text: "We couldn't check payments just now. Reload in a minute." },
  off: { tone: "neutral", label: "Off", text: "Payments aren't live on this server yet." },
};

/** The relayer's answer and when we asked, in one plain function (the render body never reads the clock, as on the home). */
async function readPayments() {
  const pay = payConfig();
  const health = pay ? await relayerHealth(pay.relayerUrl) : null;
  return { state: STATES[!pay ? "off" : health === null ? "unknown" : health.paused ? "paused" : "running"], checkedText: formatDateTime(Date.now()) };
}

async function Payments() {
  await connection();
  const { state, checkedText } = await readPayments();
  return (
    <section aria-labelledby="payments" className="grid gap-4 rounded-card border border-hairline bg-surface p-5 shadow-card md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="payments" className="text-[17px] font-semibold text-ink">
          Payments
        </h2>
        <StatusBadge status={state.tone} label={state.label} />
      </div>
      <p className="text-ink-muted">{state.text}</p>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="grid gap-1">
          <dt className="eyebrow text-ink-muted">Network</dt>
          <dd className="text-ink">Whitechain testnet</dd>
        </div>
        <div className="grid gap-1">
          <dt className="eyebrow text-ink-muted">Checked</dt>
          <dd className="text-ink">{checkedText}</dd>
        </div>
      </dl>
    </section>
  );
}
