// /contact: the one channel the project has today, GitHub issues (the repo is public with issues on).
import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Contact",
  description: "Reach the Whiteflow team on GitHub: questions, bugs and ideas as issues.",
  alternates: { canonical: "/contact" },
};

const card = "grid content-start gap-3 rounded-card border border-hairline bg-surface p-5 shadow-card md:p-6";

export default function ContactPage() {
  return (
    <>
      <SiteHeader section="Contact" />
      <main id="main" className="mx-auto grid max-w-[760px] content-start gap-8 px-4 pt-10 pb-24 md:px-8">
        <div className="grid gap-3">
          <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">Contact</h1>
          <p className="text-lg text-ink-muted">Whiteflow is built in the open. Reach the team on GitHub.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section aria-labelledby="issues" className={card}>
            <h2 id="issues" className="text-[17px] font-semibold text-ink">
              Questions, bugs and ideas
            </h2>
            <p className="text-ink-muted">
              Open an issue: say which page, what you did and what you expected. Never post a private key, an API secret or a webhook secret.
            </p>
            <a className={buttonClasses("primary", "justify-self-start", "md")} href="https://github.com/Vishal4742/whiteflow/issues/new">
              Open an issue ↗
            </a>
          </section>

          <section aria-labelledby="builders" className={card}>
            <h2 id="builders" className="text-[17px] font-semibold text-ink">
              Building with Whiteflow
            </h2>
            <p className="text-ink-muted">The docs cover the API, webhooks and test mode. To use Whiteflow from an AI assistant, connect it over MCP.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/docs" className={buttonClasses("outline", "", "md")}>
                Read the docs
              </Link>
              <Link href="/mcp" className={buttonClasses("outline", "", "md")}>
                Connect your AI
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
