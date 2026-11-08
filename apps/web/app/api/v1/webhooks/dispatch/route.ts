// POST /api/v1/webhooks/dispatch: retry the webhook deliveries that are due (FR-GW-7). Called by a cron with
// `authorization: Bearer <CRON_SECRET>`; 503 while CRON_SECRET is unset, 401 for anything else.
import { createHash, timingSafeEqual } from "node:crypto";
import { HttpError, handle, ok } from "../../../../../lib/server/http.ts";
import { payConfig } from "../../../../../lib/config.ts";
import { settleStale } from "../../../../../lib/settle.ts";
import { dispatchDue } from "../../../../../lib/server/webhooks.ts";

// hashing first gives equal lengths, so the compare is constant-time whatever the caller sends
const digest = (text: string) => createHash("sha256").update(text).digest();

export async function POST(request: Request) {
  return handle(async () => {
    const secret = process.env.CRON_SECRET;
    if (!secret) throw new HttpError(503, "Webhook retries aren't set up on this server.");
    if (!timingSafeEqual(digest(request.headers.get("authorization") ?? ""), digest(`Bearer ${secret}`))) throw new HttpError(401, "Missing or wrong cron secret.");
    const pay = payConfig();
    const processed = await dispatchDue();
    const swept = pay ? await settleStale(pay.merchantPay).catch(() => 0) : 0; // pending checkouts looked at; a failure never hides `processed`
    return ok({ processed, swept });
  });
}

export const GET = POST; // Vercel Cron sends a GET with the same Authorization header
