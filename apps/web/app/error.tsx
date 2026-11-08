"use client";

// A page that fails on the server or in the browser lands here, inside the root layout. The message stays neutral: an
// error after a payment was sent doesn't mean it failed, so a payer checks for a receipt before trying again.
import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/Button";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error("page error", error.digest ?? error.name), [error]); // never the message: it can hold internals

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto grid max-w-[1240px] content-start justify-items-start gap-4 px-4 pt-16 pb-24 md:px-8">
        <p className="eyebrow text-ink-muted">Error</p>
        <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink md:text-[44px]">Something went wrong.</h1>
        <p className="max-w-md text-ink-muted">This page hit a problem on our side. Try again in a moment. If you were paying, check for a receipt before you pay again.</p>
        {error.digest && <p className="data text-xs text-ink-muted">Reference {error.digest}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={reset} className={buttonClasses("primary", "cursor-pointer", "md")}>
            Try again
          </button>
          <Link href="/" className={buttonClasses("outline", "", "md")}>
            Go to the home page
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
