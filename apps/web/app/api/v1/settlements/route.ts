// GET /api/v1/settlements?from=YYYY-MM-DD&to=YYYY-MM-DD → the merchant wallet's USDT balance and one row per payment
// (gross, fee, investors' share, net, tx), newest first (SRS FR-GW-10). Batch 051 R2-1 payments:read (any member of the
// workspace that linked the merchant wallet).
import { handle, ok, sharedRateLimit } from "../../../../lib/server/http.ts";
import { legacyAccess } from "../../../../lib/server/legacy.ts";
import { merchantPayAddress, rangeOf } from "../../../../lib/server/reports.ts";
import { settlements } from "../../../../lib/server/settlements.ts";

export async function GET(request: Request) {
  return handle(async () => {
    const { merchant } = await legacyAccess(request, "payments:read");
    await sharedRateLimit(`settlements:${merchant.toLowerCase()}`, 30, 60_000, "memory"); // 2-20 Blockscout pages a call, as /reports
    const range = rangeOf(request);
    return ok(await settlements(merchantPayAddress(), merchant, range));
  });
}
