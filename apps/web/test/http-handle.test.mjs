// claude-frontend batch 038: handle() (lib/server/http.ts) wraps every gateway route. With cacheComponents, Next
// prerenders GET routes at build and stops one that reads the Request by throwing its own error; handle() must let
// that through (NFR-11: a clean build) and keep answering everything else as before. Run from apps/web: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { redirect } from "next/navigation.js";

const { HttpError, handle } = await import("../lib/server/http.ts");
const { DbUnavailable } = await import("../lib/server/db.ts");

/** handle() over a body that throws `error`, with console.error recorded. */
async function run(error) {
  const logged = [];
  const original = console.error;
  console.error = (...args) => void logged.push(args);
  try {
    return { res: await handle(async () => { throw error; }), logged };
  } catch (thrown) {
    return { thrown, logged };
  } finally {
    console.error = original;
  }
}

/** Next's prerender stops, as next/dist builds them: an Error with a digest. */
const withDigest = (digest) => Object.assign(new Error("prerender stopped"), { digest });

for (const [what, error] of [
  ["the prerender-interrupted error", withDigest("NEXT_PRERENDER_INTERRUPTED")],
  ["a hanging-promise rejection", withDigest("HANGING_PROMISE_REJECTION")],
  ["a redirect", (() => { try { redirect("/x"); } catch (e) { return e; } })()],
]) {
  test(`handle: ${what} from Next goes back to Next, unlogged`, async () => {
    const { res, thrown, logged } = await run(error);
    assert.equal(res, undefined);
    assert.equal(thrown, error);
    assert.deepEqual(logged, []);
  });
}

test("handle: an HttpError is its status and message", async () => {
  const { res, logged } = await run(new HttpError(409, "Already paid."));
  assert.equal(res.status, 409);
  assert.deepEqual(await res.json(), { error: "Already paid." });
  assert.deepEqual(logged, []);
});

test("handle: no database is a 503", async () => {
  const { res } = await run(new DbUnavailable());
  assert.equal(res.status, 503);
});

test("handle: anything else is a 500 that names no internals, logged by name only", async () => {
  const { res, logged } = await run(new TypeError("select * from secrets"));
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: "Something went wrong on our side. Try again." });
  assert.deepEqual(logged, [["gateway api error:", "TypeError"]]);
});

test("readText: a body over the cap is a 413, refused by its Content-Length before it's read (security audit L5)", async () => {
  const { readText } = await import("../lib/server/http.ts");
  const is413 = (e) => e instanceof HttpError && e.status === 413;
  const declared = new Request("http://x.test/", { method: "POST", headers: { "content-length": "20000" }, body: "{}" });
  await assert.rejects(readText(declared), is413);
  assert.equal(declared.bodyUsed, false, "refused before reading");
  await assert.rejects(readText(new Request("http://x.test/", { method: "POST", body: "x".repeat(20_000) })), is413);
  assert.equal(await readText(new Request("http://x.test/", { method: "POST", body: '{"a":1}' })), '{"a":1}');
});

test("a 429 says when to retry: Retry-After is the seconds left in the window", async () => {
  const { rateLimit, resetRateLimits } = await import("../lib/server/http.ts");
  resetRateLimits();
  const res = await handle(async () => {
    rateLimit("retry-after-test", 1, 60_000, 0);
    rateLimit("retry-after-test", 1, 60_000, 1_000);
    return new Response("not limited");
  });
  assert.equal(res.status, 429);
  assert.equal(res.headers.get("retry-after"), "59");
  assert.equal((await handle(async () => { throw new HttpError(400, "bad"); })).headers.get("retry-after"), null, "only a 429 carries it");
});
