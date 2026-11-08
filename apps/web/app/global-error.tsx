"use client";

// The last resort, when the root layout itself fails: it replaces <html>, so it brings its own styles and stays plain.
import "./globals.css";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-full">
        <main id="main" className="mx-auto grid max-w-[1240px] content-start justify-items-start gap-4 px-4 pt-16 pb-24 md:px-8">
          <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.035em] text-ink">Something went wrong.</h1>
          <p className="max-w-md text-ink-muted">Whiteflow hit a problem on our side. Try again in a moment. If you were paying, check for a receipt before you pay again.</p>
          {error.digest && <p className="text-xs text-ink-muted">Reference {error.digest}</p>}
          <button type="button" onClick={reset} className="h-11 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-on-accent">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
