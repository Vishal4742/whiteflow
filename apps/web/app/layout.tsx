import { SITE } from "@/lib/config";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { TestModeBadge } from "@/components/TestModeBadge";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

// the browser bar takes the page's ground colour (tokens.css --ground), light and dark
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "#12131c" },
  ],
};

// Self-hosted at build time by next/font: no request to Google at runtime (NFR-8).
const instrumentSans = Instrument_Sans({ variable: "--font-instrument-sans", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", style: "italic" }); // italic only: used for one emphasis phrase
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Whiteflow · Business payments workspace", template: "%s · Whiteflow" },
  description: "One invoice. Clear settlement. Request business payments, accept supported crypto, and settle exact USDT to Whitechain.",
  openGraph: { type: "website", siteName: "Whiteflow" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      {/* the saved day/night choice, before first paint (batch 060); it sets data-theme, hence suppressHydrationWarning */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-field focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-surface">
          Skip to content
        </a>
        <TestModeBadge />
        {children}
      </body>
    </html>
  );
}
