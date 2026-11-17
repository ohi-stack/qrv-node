# QR-V Production Consolidation — 2026-10-11

Status: implementation contract, NOT production acceptance evidence.

## Architecture
- qrv.network is the canonical human-facing Express/React platform. Preserve existing Express-owned routes and Sites frontend parity.
- api.qrv.network is the only trusted JSON/API/data plane and canonical PostgreSQL registry authority. No competing writable registry, signing private keys, or database credentials in qrv-node.
- Legacy issuer/verify/registry/wallet/docs/developer hostnames redirect compatibly to qrv.network paths; preserve existing QRVID deep links.
- QRVP-1 protocol and QVS-1.0 standard govern deterministic verification, independent of deployment topology.

## P0 acceptance blockers (resolve before release)
1. Investigate failed QR-V Live Production Acceptance on 813d2cb: obtain workflow job logs/annotations, compare live routes, auth redirects, Hostinger proxy, and script assertions; patch actual defect, not tests to hide defects.
2. Resolve issue #49 Firebase/Firestore transitive high-severity audit findings, including @grpc/grpc-js, without npm audit fix --force; preserve Google sign-in and sessions; require clean npm audit --audit-level=high and lockfile regression.
3. Establish live API /healthz and /readyz JSON responses, correct API-host routing, fail-closed unavailable behavior, no login-page redirects on API endpoints.
4. Demonstrate real issuer authentication, role-scoped authorization, CSRF/session protection, privacy filters, rate limiting, and secure error responses.
5. Demonstrate one PostgreSQL-backed issuance transaction: authorized issuer creates certificate → canonical QRVID → SHA-256 integrity → Ed25519 signature verification with key ID and rotation policy → QR linking to qrv.network/verify/:qrvid → public VERIFIED → authorized revoke same record → public REVOKED → audit events. Prove persistence after restart and issuer isolation. No fabricated fixtures as production proof.
6. Back up PostgreSQL and rehearse restore before schema migration; validate migration and rollback. Obtain deployment SHA, timestamp, CI, and live acceptance evidence.

## Customer workflows
- Public: /, /verify, /verify/:qrvid, /registry, /explorer, /docs, /developers, /pricing, /status, /security, /contact.
- Issuer: /issuer/login, /issuer/dashboard, /issuer/records, /issuer/certificates, /issuer/revocations, /issuer/api-keys, /issuer/settings; certificate-first commercialization.
- Wallet: /wallet, /wallet/login, /wallet/register, /wallet/dashboard, /wallet/records, /wallet/records/:qrvid, /wallet/add, /wallet/scan, /wallet/share, /wallet/settings, /wallet/security, /wallet/help. Wallet stores references/permitted metadata only, and re-verifies on open; never becomes a second verification authority.
- Admin: protected /admin dashboard with issuer/record/verification/revocation activity, operational health, audit, subscription/revenue data, and analytics. Every metric must derive from authorized API queries; show empty/unavailable states rather than invented totals.
- Billing: connect real checkout/subscription lifecycle to provisioned issuer tenant and entitlements, webhook signature validation, idempotency, and audit. Never equate a Stripe product or payment link with automatic provisioning until tested.

## Repo responsibilities
qrv-node owns UI, BFF/session layer, routing, accessibility, and API consumption; qrv-api owns authoritative state and privileged operations. Preserve other repositories as migration sources until feature parity is tested, not independent production runtimes.

## Release policy
CI: lint, build, unit/integration, API contract, E2E, auth, issuer isolation, privacy, dependency audit, QR lifecycle, live route assertions. No auto-merge or deployment while red. Human release approval required. Document expected vs actual evidence per gate. Production claim only when fully operational, documented, repeatable, and externally verified.

## Commercial launch
First product: QR-V Verified Certificates via Issuer Portal. Founding issuer pilot: two affiliated businesses then one independent issuer; collect real adoption and verification metrics. Market as issuer-backed record/status/integrity verification, not proof of legal validity, notarization, governmental authority, or factual truth.
