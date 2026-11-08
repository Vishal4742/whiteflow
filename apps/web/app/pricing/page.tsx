// /pricing: what a payment costs and who pays it. Every figure comes from MerchantPay.sol (the 0.10 USDT relay fee,
// capped at MAX_FEE 0.25 USDT; a sale's fee comes out of the price, an invoice's is added on top) and the app's own copy.
import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Pricing",
  description: "A flat 0.10 USDT fee inside each payment, which pays the network fee. Nobody paying through Whiteflow needs gas.",
  alternates: { canonical: "/pricing" },
};

const h2 = "text-[17px] font-semibold text-ink";
const card = "grid gap-3 rounded-card border border-hairline bg-surface p-5 shadow-card md:p-6";

export default function PricingPage() {
  return (
    <>
      <SiteHeader section="Pricing" />
      <main id="main" className="mx-auto grid max-w-[760px] content-start gap-8 px-4 pt-10 pb-24 md:px-8">
        <div className="grid gap-3">
          <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">Pricing</h1>
          <p className="text-lg text-ink-muted">One flat fee per payment. It pays the network fee, so nobody paying you needs gas.</p>
        </div>

        <section aria-labelledby="per-payment" className={card}>
          <h2 id="per-payment" className="eyebrow text-ink-muted">
            Each payment
          </h2>
          <p className="flex items-baseline gap-2">
            <span className="text-[44px] leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">0.10</span>
            <span className="eyebrow text-ink-muted">USDT</span>
          </p>
          <p className="text-ink-muted">
            Taken inside the payment, in the same transaction that settles the rest to your wallet. The payments contract caps this fee at 0.25 USDT.
          </p>
        </section>

        <section aria-labelledby="who-pays" className="grid gap-3">
          <h2 id="who-pays" className={h2}>
            Who pays what
          </h2>
          <ul className="grid gap-3 text-ink-muted">
            <li>
              <b className="font-medium text-ink">Checkout, payment links and pages:</b> the customer pays exactly the price. The fee comes out of it, so you receive the price
              minus 0.10 USDT, less any share a Capital advance sends to your investors.
            </li>
            <li>
              <b className="font-medium text-ink">Invoices:</b> the payer pays what&apos;s due plus the 0.10 USDT fee, and the invoice shows that total before they pay. The
              amount due goes to you, or repays the investors if you sold the invoice through Capital.
            </li>
            <li>
              <b className="font-medium text-ink">Network fees:</b> nobody paying through Whiteflow needs WBT, Whitechain&apos;s own coin. Whiteflow pays the network fee.
            </li>
            <li>
              <b className="font-medium text-ink">Refunds and withdrawals:</b> these are transactions from your own wallet, so your wallet pays their small network fee in WBT.
            </li>
            <li>
              <b className="font-medium text-ink">Capital:</b> each offer sets its own price and what the investor gets back.
            </li>
          </ul>
        </section>

        <section aria-labelledby="testnet" className="grid gap-3">
          <h2 id="testnet" className={h2}>
            Testnet only
          </h2>
          <p className="text-ink-muted">
            Whiteflow runs on Whitechain testnet with test USDT. No real money moves. To try it, claim WBT at the{" "}
            <a className="text-accent underline underline-offset-4" href="https://faucet.testnet.whitechain.io" target="_blank" rel="noreferrer">
              Whitechain faucet
            </a>{" "}
            and swap some to USDT on{" "}
            <a className="text-accent underline underline-offset-4" href="https://testnet.yetitrade.fi" target="_blank" rel="noreferrer">
              YetiTrade
            </a>
            .
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/merchant" className={buttonClasses("primary", "", "md")}>
            Open workspace
          </Link>
          <Link href="/docs" className={buttonClasses("outline", "", "md")}>
            Read the docs
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
