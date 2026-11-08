// /privacy: what Whiteflow stores, who else sees what, and what stays in the browser, as built today. Each line is checked
// against the code: db/050_web_sessions.sql, db/053_identity.sql, db/001_keys.sql, db/030_webhooks.sql, db/052_rate_limits.sql,
// lib/guest-wallet.ts, lib/server/auth-sessions.ts, lib/server/events.ts, lib/server/webhooks.ts, components/PrivyPay.tsx,
// components/merchant/Invoices.tsx, next.config.ts (CSP) and README "Privacy of the payer options". No legal entity,
// retention period or rights process is stated because none exists in the repo yet (owner to decide).
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Privacy",
  description: "What Whiteflow stores, who else sees what, and what stays in your browser.",
  alternates: { canonical: "/privacy" },
};

const h2 = "text-[17px] font-semibold text-ink";
const list = "grid list-disc gap-2 pl-5 text-ink-muted";

const SECTIONS: { id: string; title: string; items: string[] }[] = [
  {
    id: "paying",
    title: "If you pay",
    items: [
      "The default checkout makes a key in your browser to approve the payment. It needs no email and loads no third-party scripts.",
      "Your browser keeps that key and reuses it at every later checkout, so those payments share one payer address on chain. Clearing this site's data deletes the key.",
      "For each checkout we store the business, amount, reference, items, price and currency conversion, return link and times, and once paid, the payer address and the transaction. There is no name or email field.",
      "Pay pages make no chain reads from your browser: our server reads the chain instead.",
      "Paying with a phone wallet or with email goes through Privy and the WalletConnect relay, which load only when you choose that option. Privy receives your IP address, browser details and a Privy analytics id; with email, also the email, that wallet's address and the payment approval it signs. The WalletConnect relay sees your IP address, and its messages are end-to-end encrypted. We sign out of Privy and clear its session and analytics id from your browser after each checkout; what Privy already received stays with Privy.",
      "A payment page with a logo loads the logo from the address the business chose, so that site sees your IP address.",
      "Every payment is a public transaction on Whitechain testnet that anyone can look up.",
    ],
  },
  {
    id: "business",
    title: "If you run a business on Whiteflow",
    items: [
      "Sign-in goes through Privy, by email or with a wallet. Privy receives that email or wallet address and sends its own anonymous usage analytics.",
      "We store your account: the Privy user id, your email if you signed in with one, your last sign-in time and the wallets Privy verified.",
      "We store your workspace: its name, time zone, members and roles, the receiving-wallet policy and approval wallets, notifications, and an audit log of who did what and when (no IP addresses).",
      "Your session is a cookie (wf_session) holding a random token, of which we keep only a hash. It lasts 8 hours, and signing out ends it.",
      "We keep only a hash of each API key, which is shown to you once. A webhook's signing secret is stored so it can sign deliveries and is never shown again; each delivery's body and result is kept. Webhooks go only to public internet addresses.",
      "A webhook sends the payment's id, status, amount, currency, reference, transaction and link or page id. It carries no customer name or email, because we don't collect one.",
      "The customer names and labels you give invoices stay in your own browser and never go on chain.",
      "Payment links, payment pages and vouchers you create are stored with their descriptions, items, logo address and expiry.",
    ],
  },
  {
    id: "investing",
    title: "If you invest through Capital",
    items: [
      "Your browser reads the chain through Anon-RPC (the Nym mixnet, with a Tor fallback) by default. The exceptions are listed in our README.",
      "Your browser remembers what you funded and whether you disconnected your wallet.",
      "Who may invest is an on-chain allowlist (simulated KYC on testnet), so it is public.",
    ],
  },
  {
    id: "everyone",
    title: "For everyone",
    items: [
      "IP addresses are used to rate-limit requests. Each is stored with its limit and pruned after that time window ends.",
      "Your browser remembers your day or night setting.",
      "Whiteflow loads no analytics, advertising or tracking scripts. Privy's analytics id exists only when Privy loads.",
      "No names or emails go on chain or on Arkiv.",
    ],
  },
  {
    id: "services",
    title: "Services involved",
    items: [
      "Vercel hosts the site.",
      "Neon runs our Postgres database.",
      "Privy handles sign-in and the optional phone-wallet or email payment.",
      "The WalletConnect relay connects phone wallets, when you choose one.",
      "Arkiv keeps public records of capital offers and vouchers.",
      "Frankfurter provides exchange rates; our server fetches them, not your browser.",
      "The Nym mixnet carries private chain reads.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader section="Privacy" />
      <main id="main" className="mx-auto grid max-w-[760px] content-start gap-8 px-4 pt-10 pb-24 md:px-8">
        <div className="grid gap-3">
          <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">Privacy</h1>
          <p className="text-lg text-ink-muted">What Whiteflow stores, who else sees what, and what stays in your browser. This describes the app as it is built today, on Whitechain testnet.</p>
        </div>
        {SECTIONS.map((s) => (
          <section key={s.id} aria-labelledby={s.id} className="grid gap-3">
            <h2 id={s.id} className={h2}>
              {s.title}
            </h2>
            <ul className={list}>
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="text-ink-muted">
          Questions about this page:{" "}
          <Link href="/contact" className="text-accent underline underline-offset-4">
            contact us
          </Link>
          . Never include a private key or a secret.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
