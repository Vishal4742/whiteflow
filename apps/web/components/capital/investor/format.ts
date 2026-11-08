// Display helpers shared by the investor screens. Times are India time, as on the merchant pages.
export { shortAddress as short } from "@/lib/format";

/** "6 Dec 2026" and "6 Dec 2026, 17:30 IST", from the one site-wide formatter */
export { formatDate as istDate, formatDateTime as istDateTime } from "@/lib/format";

export const KIND_LABEL = { advance: "Cash advance", invoice: "Invoice" } as const;

export const kindBadge = "inline-flex rounded-pill border border-current px-3 py-0.5 text-xs font-medium";
