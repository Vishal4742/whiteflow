// claude-frontend checks for merchant sign-in (SIWE + signed session cookie). Run from apps/web: npm test
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createSiweMessage } from "viem/siwe";
import { setupDb } from "./gw-helpers.mjs"; // used nonces are in the database (batch 023)

process.env.AUTH_SECRET = "test-auth-secret-0123456789abcdef0123";
const auth = await import("../lib/auth.ts");

const SECRET = process.env.AUTH_SECRET;
before(setupDb);
const merchant = privateKeyToAccount(generatePrivateKey());
const siwe = (over = {}) =>
  createSiweMessage({ address: merchant.address, chainId: 1874, domain: "shop.test", nonce: "abcdefgh12345678", uri: "http://shop.test", version: "1", expirationTime: new Date(Date.now() + 5 * 60_000), ...over });

test("a session cookie round-trips and names the signed-in wallet", () => {
  const token = auth.signSession(merchant.address, SECRET);
  assert.equal(auth.readSession(token, SECRET), merchant.address);
});

test("forged, edited, wrong-secret and expired session cookies are rejected", () => {
  const token = auth.signSession(merchant.address, SECRET);
  const [payload, tag] = token.split(".");
  const other = Buffer.from(JSON.stringify({ a: "0x1111111111111111111111111111111111111111", e: Date.now() + 1e6 })).toString("base64url");
  assert.equal(auth.readSession(`${other}.${tag}`, SECRET), null, "edited payload");
  assert.equal(auth.readSession(`${payload}.AAAA`, SECRET), null, "bad tag");
  assert.equal(auth.readSession(token, "another-secret-0123456789abcdef0123"), null, "wrong secret");
  assert.equal(auth.readSession(`${token}.x`, SECRET), null, "extra segment");
  assert.equal(auth.readSession(token, SECRET, Date.now() + (auth.SESSION_TTL_S + 1) * 1000), null, "expired");
  assert.equal(auth.readSession(undefined, SECRET), null);
});

test("a correctly signed SIWE message for our domain, nonce and chain signs in", async () => {
  const message = siwe();
  const signature = await merchant.signMessage({ message });
  assert.equal(await auth.verifySignIn({ message, signature, nonce: "abcdefgh12345678", domains: ["shop.test"] }), merchant.address);
});

test("wrong nonce, domain, chain, signer or an expired message is refused", async () => {
  const message = siwe();
  const signature = await merchant.signMessage({ message });
  assert.equal(await auth.verifySignIn({ message, signature, nonce: "zzzzzzzz12345678", domains: ["shop.test"] }), null, "nonce");
  assert.equal(await auth.verifySignIn({ message, signature, nonce: "abcdefgh12345678", domains: ["evil.test"] }), null, "domain");
  const mainnet = siwe({ chainId: 1 });
  assert.equal(await auth.verifySignIn({ message: mainnet, signature: await merchant.signMessage({ message: mainnet }), nonce: "abcdefgh12345678", domains: ["shop.test"] }), null, "chain");
  const intruder = privateKeyToAccount(generatePrivateKey());
  assert.equal(await auth.verifySignIn({ message, signature: await intruder.signMessage({ message }), nonce: "abcdefgh12345678", domains: ["shop.test"] }), null, "signer");
  const old = siwe({ expirationTime: new Date(Date.now() - 1000) });
  assert.equal(await auth.verifySignIn({ message: old, signature: await merchant.signMessage({ message: old }), nonce: "abcdefgh12345678", domains: ["shop.test"] }), null, "expired");
});

test("a message with no expiry, or one valid for longer than 10 minutes, is refused (a captured signature must die)", async () => {
  for (const [what, message] of [["no expiry", siwe({ expirationTime: undefined })], ["a day", siwe({ expirationTime: new Date(Date.now() + 86_400_000) })]]) {
    const signature = await merchant.signMessage({ message });
    assert.equal(await auth.verifySignIn({ message, signature, nonce: "abcdefgh12345678", domains: ["shop.test"] }), null, what);
  }
});

test("the nonce cookie is ours: a plain, edited or old nonce cookie is refused (plan review BLOCKER)", () => {
  const signed = auth.signNonce("abcdefgh12345678", SECRET);
  assert.equal(auth.readNonce(signed, SECRET), "abcdefgh12345678");
  assert.equal(auth.readNonce("abcdefgh12345678", SECRET), null, "plain nonce chosen by the caller");
  assert.equal(auth.readNonce(signed.replace("abcdefgh", "zzzzzzzz"), SECRET), null, "edited nonce");
  assert.equal(auth.readNonce(signed, "another-secret-0123456789abcdef0123"), null, "wrong secret");
  assert.equal(auth.readNonce(auth.signNonce("abcdefgh12345678", SECRET, Date.now() - (auth.NONCE_TTL_S + 1) * 1000), SECRET), null, "old");
});

test("a nonce cookie stamped in the future is refused (M45)", () => {
  assert.equal(auth.readNonce(auth.signNonce("abcdefgh12345678", SECRET, Date.now() + 120_000), SECRET), null);
});

// G2 run (06:30): `next start` reports every request as localhost, but the merchant's browser may be on 127.0.0.1.
test("signInDomains: the request's host, its loopback spellings under localhost, and PUBLIC_ORIGIN's host", () => {
  assert.deepEqual(auth.signInDomains("http://localhost:3100/api/auth/verify", undefined), ["localhost:3100", "127.0.0.1:3100", "[::1]:3100"]);
  assert.deepEqual(auth.signInDomains("https://shop.test/api/auth/verify", undefined), ["shop.test"], "no loopback for a real host");
  assert.deepEqual(auth.signInDomains("https://shop.test/x", "https://pay.example"), ["shop.test", "pay.example"]);
  assert.deepEqual(auth.signInDomains("https://shop.test/x", "javascript:alert(1)"), ["shop.test"], "only an http(s) PUBLIC_ORIGIN");
});

test("a message signed on 127.0.0.1:3100 verifies on a server that sees localhost:3100; another site's doesn't", async () => {
  const signed = async (domain) => {
    const message = createSiweMessage({ address: merchant.address, chainId: 1874, domain, nonce: "abcdefgh12345678", uri: `http://${domain}`, version: "1", expirationTime: new Date(Date.now() + 5 * 60_000) });
    return { message, signature: await merchant.signMessage({ message }) };
  };
  const domains = auth.signInDomains("http://localhost:3100/api/auth/verify", undefined);
  assert.equal(await auth.verifySignIn({ ...(await signed("127.0.0.1:3100")), nonce: "abcdefgh12345678", domains }), merchant.address);
  assert.equal(await auth.verifySignIn({ ...(await signed("127.0.0.1:3112")), nonce: "abcdefgh12345678", domains }), null, "another port");
  assert.equal(await auth.verifySignIn({ ...(await signed("evil.test")), nonce: "abcdefgh12345678", domains }), null, "a phishing site");
});
