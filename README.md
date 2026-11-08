# Whiteflow

USDT payments for merchants on Whitechain. Customers pay no gas, and the money lands in the merchant's own wallet in the same transaction. **Capital** lets a merchant get paid early from future sales. Testnet only (Whitechain Sepolia, chain 1874).

[Live app](https://whiteflow.org) · [Demo shop](https://shop.whiteflow.org) · [API docs](https://whiteflow.org/docs) · [MCP](https://whiteflow.org/mcp) · Video (2:45): ⟨url⟩

## Why it's different
- Customers pay no gas. They sign once; our relayer pays.
- The merchant is paid in the same transaction (T+0). We never hold the money.
- The customer signs for the exact amount, so there's no under- or overpayment.
- Every receipt is an on-chain transaction anyone can check.
- Integration is a one-line pay button or a small SDK, with signed webhooks.

| | Whitepay | Coinbase Commerce | Whiteflow |
|---|---|---|---|
| Money lands in | A WhiteBIT account ([docs](https://docs.whitebit.com/guides/payments-overview)) | Escrow, then USDC | The merchant's wallet, same tx |
| Payer pays gas | Not stated | No (USDC on Base) | No (USDT on Whitechain) |
| Runs on Whitechain | Not mentioned | No | Yes |
| Fee | 0.4–1.5% ([whitepay.com](https://whitepay.com)) | About 1% (Shopify listing) | Flat 0.10 USDT, covers gas |
| Merchant financing | None listed | None | Advances and invoice claims |
| Ahead on | 200+ coins, POS, fiat payouts | Shopify, scale | — |

We'd sit next to Whitepay, not replace it. Why a chain: one payment is split in a single transaction between the merchant, their investors and the gas fee, by rules fixed in the contract. A card or bank rail can't do that.

## Proof on chain
Contracts, all verified on Blockscout: [MerchantPay](https://explorer.testnet.whitechain.io/address/0xab817593253a0a37de723072827d88fe0ca54251) · [CapitalMarket](https://explorer.testnet.whitechain.io/address/0xecd63a369d23dfddc6bfac921e41a86760c20abe) · [ClaimToken](https://explorer.testnet.whitechain.io/address/0xce9b171a5c485a41dced9d7f043733bddc26c388) · [InvestorRegistry](https://explorer.testnet.whitechain.io/address/0x293430fae87ca79844c6e3a64e8044078c4d3e74). An older MerchantPay (`0x83b5…73b7`) is paused and unused.

| What happened | Tx |
|---|---|
| Gasless 25 USDT checkout; the payer holds 0 WBT | [AT-1](https://explorer.testnet.whitechain.io/tx/0x7e03b5d0c52b6b7d941845b364f78875719c481fc7d4b353187038b504b37a11) |
| Refund | [AT-2](https://explorer.testnet.whitechain.io/tx/0x8334c4ba867131e999d1d371b1d1a7f13904ae3312eea7373cc53a4c5a04bbeb) |
| 25 USD payment link: 0.10 fee + 24.90 to the merchant, paid in 3.81 s | [AT-11](https://explorer.testnet.whitechain.io/tx/0x26139ab94216a8e954c977dedc2edda7ccfa921c210cd920ea7f5f2ab6bcf6db) |
| Demo shop on the SDK in 20 lines ([checkout](apps/shop/api/checkout.ts), [webhook](apps/shop/api/webhook.ts)): a 2.00 USDT espresso in 4.98 s, signed webhook delivered once | [AT-14](https://explorer.testnet.whitechain.io/tx/0x29c9ef20eb208091290df43aa9875e06889134ce323a71f69fe79c35b5606ebd) |
| Discount code read from Arkiv: 10% off a 6 + 5 USD page, paid 9.90 USDT | [AT-12](https://explorer.testnet.whitechain.io/tx/0xb3e7154028bac909bfd49b4c5da5d261de3482ae93187f2d942267b744020e81) |
| Priced in euros: 20.00 EUR charged as exactly 22.51 USDT (ECB rate, rounded up) | [AT-13](https://explorer.testnet.whitechain.io/tx/0x6350de188f6c5cc344793b03b70aa6e0184650a3f45d3d5ba81a1811cfee90e9) |
| Advance: funded, then a 5 USDT sale repays the investor 1 USDT in the same tx, then 0 once the cap is reached | [AT-3](https://explorer.testnet.whitechain.io/tx/0x8d4958ebb6c20d1a1e4a269bfd6736c641f62ca02d6521e94b92934c8f3f6810) → [AT-4](https://explorer.testnet.whitechain.io/tx/0x9fc06d890b53dde51e469e348fc9b9bdaadfc541f82e9fbb2a833a74edba5ec8) → [AT-5](https://explorer.testnet.whitechain.io/tx/0x0269606d7668b50e5c0b8d6dca43449def7b660e92371ff4090fbff199df4360) |
| Invoice: two investors buy a 100 USDT invoice; the debtor pays 100.10 and they get 60 + 40 in one tx | [A](https://explorer.testnet.whitechain.io/tx/0x6b346413c77effb7f2084103caf93236a47349681729816bb0a850aa95a9ab3c) + [B](https://explorer.testnet.whitechain.io/tx/0xab395b1dd7c452229661dfab86f7efee79700d87bc00aaa7957390c7627d9744) → [AT-7](https://explorer.testnet.whitechain.io/tx/0xd9172e76c1f19d2152d10283a84732ac0ef14680698f7279cfc2c10dd71003b1) |
| A claim sent to a non-eligible wallet reverts with `ERC7943CannotReceive` | [AT-8](https://explorer.testnet.whitechain.io/tx/0x08f45d4bf2826b350cc065a09888ff5ecf2a064ed12ae662c914b10f889a56f8) |
| 4.32 s from signature to receipt through the production relayer | [NFR-4](https://explorer.testnet.whitechain.io/tx/0xae8b017188d47bc17db535a9cc395a1663a76931c4765cd55f212c73c794a24a) |

Every acceptance test: [`docs/SRS.md`](docs/SRS.md) §6.

## Sponsor tracks
### Whitechain: Operate, Scale, Tokenize
- **Operate:** payment links with QR codes, payment pages, invoices, vouchers, prices in USD, EUR, GBP, INR, SGD or AED (quote locked for 10 min), reports and CSV that match the on-chain `Paid` events (AT-15), signed webhooks, test-mode keys and [API docs](https://whiteflow.org/docs).
- **Scale:** the payer presses one "Confirm payment". No WBT, seed phrase or chain name. The merchant's flat 0.10 USDT fee goes to the relayer in the same tx and covers gas up to about 6.2 gwei. The [relayer](apps/relayer/src/relayer.ts) only sends MerchantPay `paySale`/`payInvoice`, refuses payers with code (incl. EIP-7702), simulates first, caps gas at 6 gwei, limits each payer, pauses after 3 reverts in an hour and keeps a daily WBT budget, all stored in Postgres. Bad calls leave its nonce unchanged (AT-10).
- **Tokenize:** claims are ERC-1155 tokens with ERC-7943 rules: investor allowlist (simulated KYC), at most 8 holders, maturity lock, admin freeze ([ClaimToken.sol](contracts/src/ClaimToken.sol), [InvestorRegistry.sol](contracts/src/InvestorRegistry.sol)). `canTransfer` answers before anyone signs.
- Our feedback for the Whitechain team: [WHITECHAIN_FEEDBACK.md](WHITECHAIN_FEEDBACK.md).

### Arkiv
Discount codes (`mcplus.voucher.v1`) and financing offers (`mcplus.offer.v1`) are Arkiv entities. Before applying a code, the checkout reads its live entity. A missing or expired one refuses the code; if Arkiv is down, the code is refused but the sale can still be paid (FR-ARK-7). Codes are stored only as a keyed hash. Code G4AT12 was created in [this tx](https://rabdi.explorer.arkiv.network/tx/0x3e215e9579b569847274589e0df6b6b10b3fae6c7baa9cfe13aa8ddc553a1fa2), used in AT-12 and expired on 7 Nov as planned. Offers feed the investor offer book and expire at maturity. Writer: `0xF216677A6c7635c34e7dD58927B98D141d538Cbe`. Notes: [`arkiv/`](arkiv/).

### Ethereum Foundation: Anon-RPC, CROPS
Every chain read the browser makes goes through Anon-RPC by default (Nym, with Tor as fallback), Arkiv reads included. A dashboard meter counts them; a production run showed *Private reads 4 of 4*. The pay and checkout pages make no browser chain reads at all, so they can't leak the payer's IP. In Phase 1 the app read blocks through Nym with 0 direct RPC requests in 12 browser runs, and it refuses a swapped worker bundle (pinned hash).

Disclosed exceptions: relayer writes over HTTPS, two mainnet bootstrap reads, explorer history lookups, the server-side reads behind the pay pages, the payer's own wallet if they pick one, Privy and WalletConnect only if the payer presses that option, and the Nym worker's own traffic. A `/p` payment page loads the merchant's logo from the merchant's https host, which sees the payer's IP. The Content-Security-Policy allows only these hosts: the pay and checkout pages allow just Privy and WalletConnect, and payment links (`/l`) allow none.

CROPS: anyone can submit a signed authorization if our relayer is down (C) · MIT licence (O) · private reads by default, no personal data on chain or on Arkiv (P) · non-custodial, keys stay on the user's device (S).

## AI assistant (MCP)
[`packages/mcp`](packages/mcp/README.md) lets an AI assistant manage payment collection: 14 tools for links, invoices, customers, payments and reminders. It can't move money. Sandbox mode (the default) runs on your computer with no account. Testnet mode uses your `sk_test_` key, whose merchant must be linked to a Whiteflow workspace in Settings.
- One click for Claude Desktop, Cursor or VS Code: [whiteflow.org/mcp](https://whiteflow.org/mcp)
- Any MCP client: `npx -y whiteflow-mcp@0.3.0` ([npm](https://www.npmjs.com/package/whiteflow-mcp))

Parts are adapted from [Pixa](https://github.com/soumyacodes007/Pixa) (MIT, see `packages/mcp/THIRD_PARTY_LICENSES`); ETHGlobal mentors confirmed this reuse is within Start Fresh.

## Architecture
```
Shop server ──POST /api/v1/sessions──► Web API (apps/web) ──► checkout link
Customer /pay (no chain reads in the browser) ── signs a USDT authorization, no gas
        ▼
Relayer (apps/relayer): allowlist · payer has no code · signature, balance, window, replay
        · per-payer limits · daily gas budget · simulate first ── pays the WBT gas
        ▼
MerchantPay (one tx): pull USDT ─► 0.10 fee to relayer ─► advance holdback to investors ─► rest to merchant
        ▼
receipt → signed webhook to the shop
Dashboards read the chain privately via Anon-RPC (Nym), one Multicall per screen; offers live on Arkiv.
```
`apps/web`: the Next.js app and gateway API · `apps/relayer`: Node + viem, pays the gas · `packages/sdk`: zero-dependency SDK and pay button · `apps/shop`: the demo shop · `contracts/`: Solidity 0.8.38 (Foundry), every money rule. Postgres holds accounts, sessions, links, webhooks and rate limits. Details: [ARCHITECTURE.md](ARCHITECTURE.md).

## Run it
Needs Node 26 and Foundry 1.8.6. The tests need no `.env`; fork tests use the public Whitechain RPC.
```bash
git clone --recursive https://github.com/Vishal4742/whiteflow && cd whiteflow
(cd contracts && forge build && forge test)          # 164 tests
(cd apps/web && npm ci && npm run typecheck && npm test)
(cd apps/relayer && npm ci && npm test)
(cd packages/sdk && npm ci && npm test)
(cd apps/shop && npm ci && npm test)
```
To run a server, use `npm run dev` in its folder. The web app (localhost:3000) reads `apps/web/.env.local` (names in `.env.example`). The relayer reads `apps/relayer/.env` (`RPC_URL`, `RELAYER_PRIVATE_KEY`, `RELAY_API_SECRET`, `DATABASE_URL`), the shop `apps/shop/.env` (`GATEWAY_URL`, `GATEWAY_SECRET_KEY`, `GATEWAY_WEBHOOK_SECRET`). Never commit a `.env`.

Test funds: claim WBT at faucet.testnet.whitechain.io, then swap some for the prize USDT (`0xcedfb56113143d55b2358b8cfbb0deb5ad2f55a7`) on testnet.yetitrade.fi.

Coverage of the four deployed contracts (`forge coverage --ir-minimum`): 99.1% of lines, 100% of branches and functions. CI runs the same checks on every push.

## Trust and privacy
- **Payer privacy:** the default checkout keeps a guest key in the browser and loads no third-party scripts. Privy (phone wallet or email) loads only if the payer picks it. It then sees the IP, user agent and an analytics id, plus the email, wallet address and signed approval if they use email; the WalletConnect relay sees the IP. We clear Privy's local session after each checkout. On chain, one browser's payments share one guest address, so they can be linked.
- **Admin key (testnet):** one deployer key (`0xb4E7…714D`) is both compliance admin and contract owner. It decides who's an eligible investor, and it can force-transfer claims between eligible investors, freeze claim units, revoke eligibility and pause MerchantPay. Ownership uses `Ownable2Step`; production would put these roles behind a multisig.

## Limitations
- Testnet only: official USD₮ isn't on Whitechain mainnet yet. The maturity lock (60 s) and grace period (120 s) are short so the demo can show them; production would use 1 day and 7 days.
- KYC is simulated by an allowlist. Not built: EAS attestations, pay-on-due-date, default and recourse (a claim that's never repaid stays outstanding).
- A merchant could take sales outside our checkout. Default rules and recourse would reduce that, not prevent it.
- Investor caps (1 per advance, 2 per invoice) are checked by our server, not the contract (which allows 8 holders), so two first fundings sent within seconds can both pass.
- Invoice repayments are limited per payer (10 an hour), not per merchant. A merchant who also controls an invoice's investors could use up the relayer's 0.1 WBT daily gas budget with about 40 repayments (about 4 USDT in fees). No funds are at risk; relaying resumes the next day.
- The relayer's WBT is refilled by hand; the automatic fee-to-WBT swap wasn't built.

## What's next
Pay from another chain, starting with one tested corridor (Ethereum Sepolia USDC into Whitechain USDT) with an exact amount and a refund path.

## Team
⟨team⟩ · How we used AI: [AI_USAGE.md](AI_USAGE.md) · Requirements: [docs/SRS.md](docs/SRS.md) · Design: [ARCHITECTURE.md](ARCHITECTURE.md) · [MIT licence](LICENSE)
