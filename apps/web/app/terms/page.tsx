// /terms: the rules Whiteflow runs by today, from how it is built: README ("What makes it different", "Operations",
// "Limitations"), MerchantPay.sol (the fee, its 0.25 USDT cap, permissionless pay functions) and the app's own copy.
// No governing law, liability or dispute terms: nothing in the repo sets them (owner to decide).
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Terms",
  description: "How Whiteflow works on testnet: who holds the money, the fee, admin powers and today's limits.",
  alternates: { canonical: "/terms" },
};

const h2 = "text-[17px] font-semibold text-ink";
const list = "grid list-disc gap-2 pl-5 text-ink-muted";
const link = "text-accent underline underline-offset-4";

export default function TermsPage() {
  return (
    <>
      <SiteHeader section="Terms" />
      <main id="main" className="mx-auto grid max-w-[760px] content-start gap-8 px-4 pt-10 pb-24 md:px-8">
        <div className="grid gap-3">
          <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">Terms</h1>
          <p className="text-lg text-ink-muted">Whiteflow runs on Whitechain testnet. These are the rules it runs by today, taken from how it is built.</p>
        </div>

        <section aria-labelledby="testnet" className="grid gap-3">
          <h2 id="testnet" className={h2}>
            Testnet only
          </h2>
          <ul className={list}>
            <li>Whiteflow uses test USDT on Whitechain testnet. No real money moves.</li>
            <li>
              To get test funds, claim WBT at faucet.testnet.whitechain.io and swap some to USDT on testnet.yetitrade.fi. The app has no faucet button.
            </li>
          </ul>
        </section>

        <section aria-labelledby="money" className="grid gap-3">
          <h2 id="money" className={h2}>
            Who holds the money
          </h2>
          <ul className={list}>
            <li>Each payment settles straight to the business&apos;s own wallet, in the same transaction. Whiteflow never holds it.</li>
            <li>A customer approves an exact amount, so a payment can&apos;t be short or over.</li>
            <li>Refunds are sent from the business&apos;s own wallet.</li>
          </ul>
        </section>

        <section aria-labelledby="fees" className="grid gap-3">
          <h2 id="fees" className={h2}>
            Fees
          </h2>
          <ul className={list}>
            <li>
              A flat 0.10 USDT per payment. On a sale it comes out of the payment; on an invoice the payer adds it on top. Details on{" "}
              <Link href="/pricing" className={link}>
                Pricing
              </Link>
              .
            </li>
            <li>The contract owner can change the fee, but the payments contract never lets it go above 0.25 USDT.</li>
            <li>Whiteflow&apos;s relayer pays the network fee for payments. Refunds and withdrawals pay their own, from the business&apos;s wallet.</li>
          </ul>
        </section>

        <section aria-labelledby="relayer" className="grid gap-3">
          <h2 id="relayer" className={h2}>
            If Whiteflow is down
          </h2>
          <p className="text-ink-muted">
            The payment functions are open to anyone, so a signed payment can still be submitted without our relayer. The code is open source under the MIT license.
          </p>
        </section>

        <section aria-labelledby="admin" className="grid gap-3">
          <h2 id="admin" className={h2}>
            Admin powers on testnet
          </h2>
          <p className="text-ink-muted">
            One key is both the compliance admin and the owner of the contracts. It can pause payments, decide who may invest, move claims between eligible investors, freeze
            claim units and revoke an investor&apos;s eligibility.
          </p>
        </section>

        <section aria-labelledby="limits" className="grid gap-3">
          <h2 id="limits" className={h2}>
            Limits today
          </h2>
          <ul className={list}>
            <li>Investor checks (KYC) are simulated.</li>
            <li>On testnet a claim locks 60 seconds before it is due, with a 120-second grace period.</li>
            <li>There is no default or recourse process: a claim that is never repaid stays outstanding.</li>
            <li>A business could take sales outside the checkout.</li>
            <li>Investor caps are enforced by our server, not by the contract.</li>
            <li>Invoice repayments are limited to 10 an hour per payer.</li>
            <li>When the relayer&apos;s daily network fee budget runs out, relaying pauses until the next day.</li>
          </ul>
        </section>

        <p className="text-ink-muted">
          Questions:{" "}
          <Link href="/contact" className={link}>
            contact us
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
