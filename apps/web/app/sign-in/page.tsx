// /sign-in: business sign-in (batch 050, SRS FR-BIZ-6 v3.1). The only page that loads Privy; next.config.ts gives it
// Privy's CSP and every other page keeps its own (test/csp-privy-scope.test.mjs). Customers never need this page.
import { PlainPage, Problem, card } from "@/components/gateway/Frame";
import { PrivySignIn } from "@/components/workspace/PrivySignIn";
import { privyAppId, walletConnectProjectId } from "@/lib/privy-config";
import { SetupSteps } from "@/components/ui/SetupSteps";

export const metadata = { title: "Sign in", description: "Sign in to Whiteflow with your email or a wallet.", alternates: { canonical: "/sign-in" } };

export default function SignInPage() {
  const appId = privyAppId();
  return (
    <PlainPage>
      <section aria-labelledby="signin-heading" className={`${card} mx-auto mt-10 max-w-lg`}>
        <h1 id="signin-heading" className="title">
          Sign in to Whiteflow
        </h1>
        <p className="text-sm text-ink-muted">Use your email or a wallet.</p>
        <SetupSteps current={1} />
        {appId ? (
          <PrivySignIn appId={appId} wcProjectId={walletConnectProjectId()} />
        ) : (
          <Problem>Sign-in isn&apos;t set up on this server yet: the Privy app id is missing. Nothing else is affected.</Problem>
        )}
        <details className="text-xs text-ink-muted">
          <summary className="cursor-pointer select-none">How sign-in works</summary>
          <p className="mt-2">
            Sign-in is provided by Privy, which receives the email or wallet address you sign in with and sends its own anonymous
            usage analytics. The dashboard and receipts don&apos;t load Privy, and the checkout loads it only when a customer chooses to pay with a phone wallet or email. Your sign-in is
            separate from the wallet that receives payments: you link that wallet with one signature in the next steps.
          </p>
        </details>
      </section>
    </PlainPage>
  );
}
