# Security policy

Whiteflow runs on Whitechain testnet with test USDT; no real money moves. Security reports are still welcome and
taken seriously.

## Reporting a vulnerability

Please report it privately: open the repository's **Security** tab and choose **Report a vulnerability**. That
creates a private advisory only the maintainers can see. Don't open a public issue, and never include a private key,
an API secret or a webhook secret in any report.

Please include what you found, where (file, route or contract), how to reproduce it, and what an attacker could do.

## Scope

- The web app and API (`apps/web`), the relayer (`apps/relayer`), the contracts (`contracts/`), the SDK and pay
  button (`packages/sdk`) and the MCP server (`packages/mcp`).
- The live deployment at whiteflow.org and its subdomains.

## Supported versions

Only the latest release and `main` get fixes.
