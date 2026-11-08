import { WhiteflowMark } from "@/components/WhiteflowMark";

// The brand W (components/WhiteflowMark.tsx). Kept under this name for the wordmark below.
export function WhiteflowLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return <WhiteflowMark className={className} />;
}

/** The one Whiteflow lockup: the W in the accent colour, then "White" + "flow" in blue. Size and text colour come from `className`
 *  (default 18px ink), so a caller's `text-xs` really makes it small. */
export function WhiteflowWordmark({ className = "text-[18px] text-ink", flowClassName = "text-accent" }: { className?: string; flowClassName?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.4em] font-semibold tracking-[-0.03em] ${className}`}>
      <WhiteflowLogo className="h-[0.8em] w-auto text-accent" />
      <span>
        White<span className={flowClassName}>flow</span>
      </span>
    </span>
  );
}
