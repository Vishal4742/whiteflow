import type { ReactNode } from "react";

export type StatusTone = "paid" | "open" | "pending" | "refunded" | "cancelled" | "neutral" | "warning";

interface StatusBadgeProps {
  status: StatusTone;
  label?: string;
  children?: ReactNode;
  className?: string;
}

const TONES: Record<StatusTone, { bg: string; text: string; border: string; dot: string; defaultLabel: string }> = {
  paid: {
    bg: "bg-positive/10",
    text: "text-positive",
    border: "border-positive/30",
    dot: "bg-positive",
    defaultLabel: "Paid",
  },
  open: {
    bg: "bg-accent-soft",
    text: "text-accent",
    border: "border-accent/30",
    dot: "bg-accent",
    defaultLabel: "Open",
  },
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    dot: "bg-warning animate-pulse",
    defaultLabel: "Confirming",
  },
  refunded: {
    bg: "bg-surface-sunk",
    text: "text-ink-muted",
    border: "border-hairline",
    dot: "bg-ink-muted",
    defaultLabel: "Refunded",
  },
  cancelled: {
    bg: "bg-critical/10",
    text: "text-critical",
    border: "border-critical/30",
    dot: "bg-critical",
    defaultLabel: "Cancelled",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/40",
    dot: "bg-warning",
    defaultLabel: "Action required",
  },
  neutral: {
    bg: "bg-surface-sunk",
    text: "text-ink-muted",
    border: "border-hairline",
    dot: "bg-ink-muted",
    defaultLabel: "Status",
  },
};

export function StatusBadge({ status, label, children, className = "" }: StatusBadgeProps) {
  const tone = TONES[status] ?? TONES.neutral;
  const content = children ?? label ?? tone.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight whitespace-nowrap ${tone.bg} ${tone.text} ${tone.border} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${tone.dot}`} aria-hidden="true" />
      <span>{content}</span>
    </span>
  );
}

