# Changelog

Notable changes to Whiteflow. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/). Whiteflow runs on Whitechain testnet only.

## [0.1.0] - 2026-11-08

The first release: the product as it runs at [whiteflow.org](https://whiteflow.org).

### Added
- Gateway: hosted checkout, payment links and payment pages, invoices, QR codes for the counter, discount vouchers,
  multi-currency prices, reports and settlements, signed webhooks, API keys, a one-line pay button and an SDK.
- Settlement in the payment's own transaction, straight to the merchant's wallet; customers pay no gas; a flat
  0.10 USDT fee per payment, capped at 0.25 USDT by the payments contract.
- Capital: cash advances and invoice financing, repaid from sales on chain.
- AI assistants: the `whiteflow-mcp` server on npm, a Claude Desktop extension, one-click Cursor and VS Code installs.
- Pages: pricing, status, about, contact, privacy and terms; robots.txt, sitemap.xml and a web manifest.

### Changed
- Plain wording for customers and merchants, one date format, short wallet addresses with copy, per-page titles and
  share cards, a shared header and footer, a branded 404 and error page ([#75]).

### Security
- Each payment attempt is recorded before it is relayed, and attempts with an unknown outcome are settled from the
  chain, so a single-use payment link can't be paid twice ([#75]).
- Rate limits on the payment and chain-reading routes, capped request bodies, a 10 s database deadline, a per-claim
  lock for capital funding, CSP and Permissions-Policy headers, and the legacy wallet sign-in routes removed ([#75]).

[0.1.0]: https://github.com/Vishal4742/whiteflow/releases/tag/v0.1.0
[#75]: https://github.com/Vishal4742/whiteflow/pull/75
