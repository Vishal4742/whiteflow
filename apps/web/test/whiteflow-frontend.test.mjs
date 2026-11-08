// Whiteflow Frontend & Presentation Verification Tests
// Tests the Whiteflow navigation shell, branding tokens, status badges, and invoice presentation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

test("Whiteflow branding is present in layout metadata and header", () => {
  const layout = readFileSync(join(ROOT, "app/layout.tsx"), "utf8");
  assert.match(layout, /title: \{ default: "Whiteflow · Business payments workspace", template: "%s · Whiteflow" \}/);
  assert.match(layout, /One invoice\. Clear settlement\./);
  assert.match(layout, /<TestModeBadge \/>/);
});

test("Whiteflow design tokens preserve the blue palette", () => {
  const tokens = readFileSync(join(ROOT, "app/tokens.css"), "utf8");
  assert.match(tokens, /--accent:\s*#3b4fd9;/); // Blue accent
  assert.match(tokens, /--accent-soft:\s*#e7eafc;/); // Soft blue
  assert.match(tokens, /--ground:\s*#f5f5f9;/);
  assert.match(tokens, /--surface:\s*#ffffff;/);
});

test("Navigation shell includes all 5 target destinations and preserves existing tools", async () => {
  const navSource = readFileSync(join(ROOT, "components/dashboard/Nav.tsx"), "utf8");
  
  // 5 Target Destinations
  assert.match(navSource, /label:\s*"Overview",\s*href:\s*"\/merchant"/);
  assert.match(navSource, /label:\s*"Invoices",\s*href:\s*"\/merchant\/invoices"/);
  assert.match(navSource, /label:\s*"Payments",\s*href:\s*"\/merchant\/payments"/);
  assert.match(navSource, /label:\s*"Connections",\s*href:\s*"\/merchant\/connections"/);
  assert.match(navSource, /label:\s*"Settings",\s*href:\s*"\/merchant\/settings"/);

  // Preserved Tools
  assert.match(navSource, /"\/merchant\/links"/);
  assert.match(navSource, /"\/merchant\/pages"/);
  assert.match(navSource, /"\/merchant\/vouchers"/);
  assert.match(navSource, /"\/merchant\/reports"/);
  assert.match(navSource, /"\/merchant\/settlements"/);
  assert.match(navSource, /"\/merchant\/developers"/);
  assert.match(navSource, /"\/docs"/);
});

test("Invoices route exists and is backed by on-chain reads", () => {
  const invoicesPage = readFileSync(join(ROOT, "app/merchant/invoices/page.tsx"), "utf8");
  assert.match(invoicesPage, /merchantInvoices/);
  assert.match(invoicesPage, /paidLogs/);
  assert.match(invoicesPage, /readRelayFee/);
  assert.match(invoicesPage, /Invoices, <span className="emphasis">paid on chain\./);
});

test("Connections route exists and discloses honest MCP status", () => {
  // the MCP block lives in a component shared with the public /mcp page
  const connPage =
    readFileSync(join(ROOT, "app/merchant/connections/page.tsx"), "utf8") + readFileSync(join(ROOT, "components/McpInstall.tsx"), "utf8");
  assert.match(connPage, /Model Context Protocol \(MCP\)/);
  assert.match(connPage, /A hosted connector URL is on the way\./);
  // the working connector is offered as a download, and no made-up hosted URL is shown
  assert.match(connPage, /href="\/downloads\/whiteflow\.mcpb" download/);
  assert.doesNotMatch(connPage, /api\.whiteflow\.io/);
  assert.match(readFileSync(join(ROOT, "app/mcp/page.tsx"), "utf8"), /<McpInstall /);
  assert.match(connPage, /listKeys/);
  assert.match(connPage, /listWebhooks/);
});

test("Settings route exists and organizes receiving wallet policy honestly", () => {
  const settingsPage = readFileSync(join(ROOT, "app/merchant/settings/page.tsx"), "utf8");
  // the receiving wallet and its versioned policy are the workspace's own (WorkspaceSettings), never the server's demo merchant
  assert.match(settingsPage, /<WorkspaceSettings \/>/);
  assert.doesNotMatch(settingsPage, /merchantConfig/);
  // the network card says whether fees are covered, without the relayer's own balances
  assert.match(settingsPage, /Whitechain testnet/);
  assert.match(settingsPage, /relayerHealth/);
  assert.doesNotMatch(settingsPage, /health\.wbt|budgetLeft/);
});

test("Customer receipt card renders Whiteflow trust mark and settlement rail", () => {
  const receiptPage = readFileSync(join(ROOT, "app/r/[id]/page.tsx"), "utf8");
  assert.match(receiptPage, /WhiteflowWordmark/);
  assert.match(receiptPage, /Whitechain testnet/);
  assert.match(receiptPage, /EXPLORER/);
});


test("both pay routes read their body through the capped reader (security audit L5)", () => {
  for (const route of ["app/api/v1/invoices/[id]/pay/route.ts", "app/api/v1/sessions/[id]/pay/route.ts"]) {
    const source = readFileSync(join(ROOT, route), "utf8");
    assert.match(source, /await readJsonOrNull\(request\)/, route);
    assert.doesNotMatch(source, /request\.json\(\)/, route);
  }
});

test("the MCP install pins the version packages/mcp publishes (security audit M1)", () => {
  const { version } = JSON.parse(readFileSync(join(ROOT, "../../packages/mcp/package.json"), "utf8"));
  const pinned = `whiteflow-mcp@${version}`;
  assert.ok(readFileSync(join(ROOT, "components/McpInstall.tsx"), "utf8").includes(`"${pinned}"`), "McpInstall.tsx");
  assert.ok(readFileSync(join(ROOT, "../../README.md"), "utf8").includes(`npx -y ${pinned}\``), "README.md");
});

test("every page sends a Permissions-Policy that turns off camera, microphone and location (security audit L3)", () => {
  assert.match(readFileSync(join(ROOT, "next.config.ts"), "utf8"), /key: "Permissions-Policy", value: "camera=\(\), microphone=\(\), geolocation=\(\)"/);
});

test("every footer and sitemap page exists, and the public pages each name their canonical URL", () => {
  const footer = readFileSync(join(ROOT, "components/SiteFooter.tsx"), "utf8");
  const sitemap = readFileSync(join(ROOT, "app/sitemap.ts"), "utf8");
  const paths = new Set([...footer.matchAll(/\["(\/[a-z-]*)", "/g), ...sitemap.matchAll(/"(\/[a-z-]*)"/g)].map((m) => m[1]));
  for (const path of paths) {
    const page = join(ROOT, "app", path === "/" ? "" : path, "page.tsx");
    assert.ok(existsSync(page), `${path} is linked but app${path}/page.tsx doesn't exist`);
  }
  for (const path of ["/pricing", "/about", "/contact", "/status"]) {
    assert.match(readFileSync(join(ROOT, "app", path, "page.tsx"), "utf8"), new RegExp(`canonical: "${path}"`), path);
  }
});

test("every database call has a 10 s deadline, so a stalled database fails fast (code review 2026-11-08 F6)", () => {
  const db = readFileSync(join(ROOT, "lib/server/db.ts"), "utf8");
  assert.match(db, /const QUERY_TIMEOUT_MS = 10_000;/);
  assert.match(db, /sql\.query\(text, params, deadline\(\)\)/, "query");
  assert.match(db, /isolationLevel: "ReadCommitted", \.\.\.deadline\(\)/, "transaction");
});
