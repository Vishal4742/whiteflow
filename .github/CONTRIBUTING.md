# Contributing to Whiteflow

Thanks for helping. Whiteflow is a stablecoin payment gateway on Whitechain testnet; everything here runs on test
funds.

## Set up

Requirements: Node 26 (see `.nvmrc`), Foundry 1.8.6 and git. The full setup, per app, is in the
[README](../README.md#setup):

```bash
git clone --recursive https://github.com/Vishal4742/whiteflow && cd whiteflow
cp .env.example .env                         # fill in the values; never commit .env
git config core.hooksPath tools/githooks     # the same checks as CI run before each push
cd apps/web && npm ci && npm run dev         # http://localhost:3000
```

## Making a change

1. Branch from `main` and keep each pull request to one change.
2. Run the checks for what you touched. For the web app: `npm run typecheck && npm run lint && npm test` in
   `apps/web`. For the contracts: `forge test -vv` in `contracts/`.
3. Add or update a test for any change in behaviour, especially anything that moves money.
4. Open a pull request using the template. CI must pass, and a maintainer reviews it before it merges.

Formatting follows `.editorconfig`: two spaces (four in Solidity and Python), LF line endings.

## Reporting bugs and ideas

Use the issue templates. For anything security-related, follow [SECURITY.md](SECURITY.md) instead of opening an
issue.

## Code of conduct

Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
