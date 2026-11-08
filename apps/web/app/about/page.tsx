// /about: what Whiteflow is and where it stands, in the README's own terms (README.md, "What makes it different",
// "Why this needs on-chain stablecoin settlement", "Limitations", "What's next").
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "About",
  description: "A stablecoin payment gateway for merchants who sell internationally: customers pay USDT on Whitechain with zero gas, and it settles straight to the merchant's wallet.",
  alternates: { canonical: "/about" },
};

const h2 = "text-[17px] font-semibold text-ink";
const DIFFERENT = [
  ["Zero gas for the payer", "the customer signs once; Whiteflow's relayer pays the gas."],
  ["Instant settlement", "money lands in the merchant's own wallet in the same transaction. Whiteflow never holds it."],
  ["Exact amounts", "the customer signs for an exact amount, so under- and overpayment can't happen."],
  ["Receipts anyone can check", "every receipt is an on-chain transaction."],
  ["Easy to add", "a one-line payment button or a small SDK, with signed webhooks."],
] as const;

export default function AboutPage() {
  return (
    <>
      <SiteHeader section="About" />
      <main id="main" className="mx-auto grid max-w-[760px] content-start gap-8 px-4 pt-10 pb-24 md:px-8">
        <div className="grid gap-3">
          <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">About Whiteflow</h1>
          <p className="text-lg text-ink-muted">
            A stablecoin payment gateway for merchants who sell internationally. Customers pay in USDT on Whitechain with zero gas, and the money settles straight to the
            merchant&apos;s own wallet.
          </p>
        </div>

        <section aria-labelledby="what" className="grid gap-3">
          <h2 id="what" className={h2}>
            What it does
          </h2>
          <p className="text-ink-muted">
            Payment links, payment pages, invoices, QR codes, discount vouchers, multi-currency prices and sales reports, with a one-line payment button and an SDK. Plus
            Capital: get paid early from future sales.
          </p>
        </section>

        <section aria-labelledby="different" className="grid gap-3">
          <h2 id="different" className={h2}>
            What makes it different
          </h2>
          <ul className="grid gap-2 text-ink-muted">
            {DIFFERENT.map(([title, text]) => (
              <li key={title}>
                <b className="font-medium text-ink">{title}:</b> {text}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why" className="grid gap-3">
          <h2 id="why" className={h2}>
            Why on-chain settlement
          </h2>
          <p className="text-ink-muted">
            Repayment is enforced where the money arrives. One customer payment is split, in the same transaction, between the merchant, the investors who financed it and
            the fee, under rules neither the merchant nor Whiteflow can change.
          </p>
        </section>

        <section aria-labelledby="now" className="grid gap-3">
          <h2 id="now" className={h2}>
            Where it stands
          </h2>
          <p className="text-ink-muted">
            Built for ETHGlobal Mumbai. Testnet only, because official USD₮ isn&apos;t on Whitechain mainnet yet. The code is open source under the MIT license on{" "}
            <a className="text-accent underline underline-offset-4" href="https://github.com/Vishal4742/whiteflow">
              GitHub
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="next" className="grid gap-3">
          <h2 id="next" className={h2}>
            What&apos;s next
          </h2>
          <ul className="grid list-disc gap-2 pl-5 text-ink-muted">
            <li>Pay from another chain: one tested corridor (Ethereum Sepolia USDC into Whitechain USDT) with an exact destination amount and a refund path.</li>
            <li>Business accounts with roles, and settlement-address changes that need a second approval.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
