// The one way Whiteflow shows addresses and dates to people. Machine formats (an <input type="date"> value, CSV
// columns, ISO keys) stay ISO; everything a person reads goes through here, so every page reads the same way.

/** 0x7C04…40F5: the start and end of an address or hash, for display next to a Copy button. */
export const shortAddress = (hex: string): string =>
  hex.length > 12 ? `${hex.slice(0, 6)}…${hex.slice(-4)}` : hex;

const IST = "Asia/Kolkata";
const toDate = (value: Date | string | number): Date =>
  value instanceof Date ? value : new Date(value);

/** 7 Nov 2026, 11:37 IST */
export function formatDateTime(value: Date | string | number): string {
  const d = toDate(value);
  return `${d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: IST })} IST`;
}

/** 7 Nov 2026 */
export function formatDate(value: Date | string | number): string {
  return toDate(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: IST,
  });
}

/** 11:37 IST */
export function formatTime(value: Date | string | number): string {
  return `${toDate(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: IST })} IST`;
}
