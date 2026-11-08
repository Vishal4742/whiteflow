"use client";

// Phase 1 rail proofs (DEP-6, DEP-3), moved to /proofs. Internal page;
// Phase 2 replaces it with the checkout and the merchant dashboard.
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { DitherScene } from "@/components/DitherScene";
import { HoldButton } from "@/components/HoldButton";
import { TRANSPORT_LABEL, getChainClient } from "@/lib/anon";
import { proveTypedDataSigning } from "@/lib/guest-wallet";
import { WhiteflowMark } from "@/components/WhiteflowMark";

type Proof =
  | { state: "running" }
  | { state: "ok"; detail: string; ms: number }
  | { state: "failed"; error: string };

const STILL_WORKING_AFTER_S = 60;

/** One plain line: viem's shortMessage when present, never the request body or URL. */
function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) return "Unexpected error";
  const short = (error as { shortMessage?: unknown }).shortMessage;
  return (typeof short === "string" ? short : error.message).split("\n")[0];
}

function useProof(run: () => Promise<string>) {
  const [proof, setProof] = useState<Proof>({ state: "running" });
  // Resolves on success and rejects on failure, so a HoldButton can show done or fall back to idle.
  const execute = useCallback(() => {
    const startedAt = performance.now();
    return run().then(
      (detail) => setProof({ state: "ok", detail, ms: performance.now() - startedAt }),
      (error: unknown) => {
        setProof({ state: "failed", error: errorMessage(error) });
        throw error;
      },
    );
  }, [run]);
  useEffect(() => {
    execute().catch(() => {}); // the failure is already on screen
  }, [execute]);
  const retry = () => {
    setProof({ state: "running" });
    return execute();
  };
  return [proof, retry] as const;
}

const readBlock = async () => {
  const client = await getChainClient();
  const block = await client.getBlockNumber();
  return `Block ${block.toLocaleString("en-US")} on Whitechain testnet, via ${TRANSPORT_LABEL}`;
};

const signProof = async () => {
  const { address, valid } = await proveTypedDataSigning();
  if (!valid) throw new Error("Signature did not verify");
  return `Guest wallet ${address.slice(0, 6)}…${address.slice(-4)} signed a payment message and it checked out`;
};

/** Mounted only while a proof runs, so it restarts from 0 on every run. */
function Elapsed() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="data text-ink-muted" aria-hidden="true">
      {" "}({seconds} s{seconds >= STILL_WORKING_AFTER_S && " · still working"})
    </span>
  );
}

function StatusPill({ proof }: { proof: Proof }) {
  const [tone, word] =
    proof.state === "ok" ? ["text-positive", "OK"] : proof.state === "failed" ? ["text-critical", "Failed"] : ["text-ink-muted", "Running"];
  return <span className={`inline-flex rounded-pill border border-current px-3 py-0.5 text-xs font-medium tracking-wide ${tone}`}>{word}</span>;
}

interface ProofCardProps {
  title: string;
  step: string;
  runningText: string;
  proof: Proof;
  action: ReactNode;
}

function ProofCard({ title, step, runningText, proof, action }: ProofCardProps) {
  return (
    <section className="grid content-start gap-4 rounded-md border border-hairline bg-surface p-6 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <span className="label text-ink-muted">{step}</span>
        <StatusPill proof={proof} />
      </div>
      <h2 className="title">{title}</h2>
      <p className="min-h-10 text-sm break-words">
        <span role="status" aria-live="polite">
          {proof.state === "running" && runningText}
          {proof.state === "ok" && <span className="tabular-nums">{proof.detail}</span>}
          {proof.state === "failed" && <span className="text-critical">{proof.error}</span>}
        </span>
        {proof.state === "running" && <Elapsed />}
        {proof.state === "ok" && proof.ms >= 1000 && <span className="data text-ink-muted"> ({(proof.ms / 1000).toFixed(1)} s)</span>}
      </p>
      <div>{action}</div>
    </section>
  );
}

export default function RailProofs() {
  const [read, retryRead] = useProof(readBlock);
  const [sign, retrySign] = useProof(signProof);
  const reading = read.state === "running";
  return (
    <main id="main">
      <section className="relative overflow-hidden bg-scene-night text-glass-ink">
        <DitherScene />
        {/* Night wash behind the text so it keeps AA contrast over lit dots; the moon side stays clear. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-r from-scene-night from-25% via-scene-night/70 via-50% to-transparent to-75%" />
        <div className="relative mx-auto max-w-5xl px-4 pt-6 pb-24">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="title inline-flex min-h-11 items-center gap-2 whitespace-nowrap">
              <WhiteflowMark />
              <span>
                White<span className="text-accent-night">flow</span>
              </span>
            </Link>
          </header>
          <h1 className="display-xl mt-20 max-w-xl text-balance">
            Private reads.
            <br />
            Signed on your <span className="emphasis">device</span>.
          </h1>
          <p className="mt-4 max-w-md opacity-80">
            Two checks before any money moves: the app reads Whitechain through the Nym mixnet, and a guest wallet signs a payment message without
            leaving the browser.
          </p>
        </div>
      </section>
      <div className="relative mx-auto -mt-12 grid max-w-5xl gap-6 px-4 pb-16 md:grid-cols-2">
        <ProofCard
          title="Private chain read"
          step="Check 1"
          runningText="Connecting privately… the first private read can take one to two minutes."
          proof={read}
          action={
            // aria-disabled, not disabled: a disabled button drops keyboard focus to the body in Chromium.
            <Button variant="quiet" aria-disabled={reading} onClick={reading ? undefined : () => void retryRead().catch(() => {})}>
              Read block again
            </Button>
          }
        />
        <ProofCard
          title="Guest wallet signature"
          step="Check 2"
          runningText="Signing…"
          proof={sign}
          action={<HoldButton label="Hold to sign again" busyLabel="Signing" doneLabel="Signed" onConfirm={retrySign} />}
        />
      </div>
    </main>
  );
}
