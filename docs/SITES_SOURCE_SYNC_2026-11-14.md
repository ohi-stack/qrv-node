# QR-V Sites source synchronization — November 14, 2026

Status: READY_FOR_REVIEW for repository synchronization; protected-runtime parity remains BLOCKED.
Owner: ChatGPT Sites builder. Node branch: `work/chatgpt-sites`; review target: `integration/multi-builder`.

## Exact source

November 15 follow-up: `sites/current-source/` and its SHA-256 inventory now match published Sites version 15 (`173d8403784a24b5ed23e4ad4c6d4cac325cd3b4`). The dashboard changes are preserved in this snapshot. The November 14 source and version below describe the earlier synchronization.

Project `appgprj_6a6bc4a21f848191913b5d346d0ae466`, slug `qrv-global-verification`.
Source HEAD: `c33a19764ce9ae663a5660f7c274aad80ae0ece0`.
Latest saved Site version: 14, source `06da543017695394c460da060d28e18d8e6ad857`.
HEAD includes the subsequent admin-dashboard commit; it is not represented as a saved or deployed Site version.

`sites/current-source/` preserves 71 tracked source files with SHA-256 inventory, including the complete app, admin and issuer workspaces, sign-in, API handlers, database schema/migrations, configuration, assets, dependency lock, and tests. Generated builds, TypeScript cache and host-specific `.openai`/`.vinext` metadata are excluded. No deployed database rows or production environment variables were copied.

## Node runtime integration

The homepage, public page components, news, current logo assets and responsive CSS are compiled into `src/web`. Next link/image primitives are adapted to ordinary anchors/images. Anchors return protected navigation to Express; no privileged routes or server files were changed.

The previous Firebase email/Google provider and account modal remain accessible at `/account`. The former homepage's synthetic activity component is no longer mounted on the public homepage or account page.

`/signin`, `/dashboard`, and `/admin` explicitly hand off to the existing Sites-hosted workspace. They do not assert Node admin access or render private inquiries in the public SPA. The complete protected workspace implementation is preserved in `sites/current-source`, but is NOT activated within Express. Existing `/issuer/*`, `/verify/*`, `/registry/*`, `/api/*`, `/status` and machine endpoints retain Node behavior. This is not full runtime parity.

## Runtime dependencies and remaining work

- Sites administrator identity/header validation and D1 inquiry storage require an explicitly designed Node adapter and migration before protected dashboards can operate natively. Do not trust client-supplied Sites identity headers on Node.
- Existing issuer authorization remains separate from Firebase/ChatGPT account identity. Issuer dashboard visual integration must go through the integration lane with authorization and API contract tests.
- The public contact form uses the Node canonical API compatibility gateway. Actual inquiry persistence through that API is unverified; Sites D1 is not silently substituted.
- Generic/unfinished pages in the source remain generic. Import does not certify checkout, billing, API-key management, team administration or Stripe activation. The retrieved source contains no newly connected Stripe checkout.
- Existing API delivery/readiness failures and production lifecycle acceptance remain unresolved by this UI synchronization.

## Validation

- `npm run validate:prod`: source contract, builder lanes, sitemap, skills, old/current import integrity, build, compiled assets and protected route checks.
- `npm run test:site-render`: homepage, store, pricing, docs, news archive and article rendering.
- `node --test sites/current-source/tests/admin-analytics.test.mjs`: 3 chart/range/CSV tests.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities after pinning transitive `@grpc/grpc-js` to 1.13.6; package-lock committed. Firebase provider version preserved.
- Chromium browser launch failed because the execution environment denied its socket operation. Desktop/mobile visual, interactions and authenticated provider flows remain UNVERIFIED.
- No deployment, DNS update, production migration, payment activation or registry mutation performed.

Next action: review the source synchronization PR, then implement and independently validate the protected Node workspace adapter before claiming dashboard parity or production readiness. Promote only through the repository's integration and human release gates.
