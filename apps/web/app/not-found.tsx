import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto grid max-w-[1240px] content-start justify-items-start gap-4 px-4 pt-16 pb-24 md:px-8">
        <p className="eyebrow text-ink-muted">404</p>
        <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">
          We can&apos;t find that page.
        </h1>
        <p className="max-w-md text-ink-muted">
          The link may be old or mistyped. If a shop sent you a payment link,
          ask them for a new one.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className={buttonClasses("primary", "", "md")}>
            Go to the home page
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
