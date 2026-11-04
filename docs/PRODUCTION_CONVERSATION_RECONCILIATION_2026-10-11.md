# QR-V production conversation reconciliation — 2026-10-11

Status: **release candidate guidance, not production acceptance**. Owner: ONEGODIAN, LLC. Originator attribution: Gregory “One” Jones / One Gregory Onegodian™. QRVP-1 initial design March 2026; QVS-1.0 March 2026.

## Canonical boundaries
- Public: https://qrv.network — human-facing website, issuer/admin sessions, public /verify/{QRVID}, documentation, pricing, registry-safe views.
- Trusted API: https://api.qrv.network/api/v1 — canonical PostgreSQL registry, authenticated issuer mutations, revocation, signature/key lifecycle, audit, entitlements. Do not move secrets into qrv-node or the browser.
- Encode newly issued QR marks as https://qrv.network/verify/{QRVID}. Preserve deep links for already issued QR marks. Legacy hosts may redirect only after parity/acceptance is proven.
- This supersedes the March seven-public-subdomain deployment proposal, **not** the QRVP-1 identifier/verification requirements. No new scanner, blockchain, federation, or extra public apps as a prerequisite for first revenue.

## Source-of-truth hierarchy
1. Current deployed API OpenAPI contract and passing integration tests for actual endpoints, payloads, and status codes.
2. config/routes.manifest.json for public route inventory and ownership.
3. QRVP-1 developer specification and QVS-1.0 for protocol intent, with explicit documented divergences rather than silent reinterpretation.
4. Historic issuer/pricing/monetization plans as **proposals**, not evidence of enabled billing or cryptographic signing.

Do not assume a GET request body is interoperable; normalize QRVID safely and use versioned, documented API contracts. Distinguish record status from signature state and upstream availability. No response may claim VERIFIED on a network error, invalid issuer signature, unauthorized issuer, expired or revoked record. A QR is a locator, not proof of physical identity, title ownership, or issuer legitimacy by itself.

## Product v1 — verified certificates
Issuer onboarding/approval → authenticated issuance → canonical PostgreSQL record → QRVID + downloadable QR → public verification → expiration/revocation on same QRVID → durable audit → operator metrics. Verify tenant isolation, issuer scopes, CSRF/session controls, replay/idempotency, rate limits, accessibility, privacy redaction, and fail-closed upstream behavior. Real external pilot required for commercial acceptance.

Issuer dashboard: Overview, Records, Issue Record, Certificates, QR Codes, Revocations, Analytics, API Keys, Team, Billing, Settings. Admin: paying/pilot issuers, implementation revenue, MRR, production records, verification counts, revocations, audit, security alerts, signing readiness, health, pipeline. Charts must show actual API-backed data and correct empty/error states, never illustrative counts presented as production.

## Commercial release
Flagship: Verified Certificate Pilot for training/certification issuers, associations, academies. Preserve published pricing until owner approves a single versioned catalog; historical $29/$99/$499, $49/$299, and $199/$499/$1500/$5000+ proposals conflict. Stripe payment links/products from prior discussions are historical claims; verify live Stripe product IDs, webhooks, entitlements and actual checkout before displaying as active. Do not grant issuer privileges from a success redirect alone. Require verified signed webhook, idempotent provisioning, cancellation/chargeback handling and operator review.

## P0 release gates
1. Issue #49: eliminate high-severity Firebase/Firestore transitive dependency audit findings using compatible upgrades and committed reproducible lockfile. Never force downgrade or bypass audit.
2. Investigate October 10 live production acceptance failure at commit 813d2cb. Compare actual route/proxy/auth behavior with scripts/live-acceptance.mjs; change assertions only if demonstrably stale, with documented evidence.
3. Ed25519: issuer signing keys secured in API-side key management, canonical signed bytes, persisted signatures/key IDs, verification, rotation and invalid-signature rejection. Until independently proven, display SHA-256 active / Ed25519 pending.
4. Full issuer create → VERIFIED → revoke → REVOKED same URL and audit in actual API-backed PostgreSQL environment; expiration, NOT_FOUND, malformed QRVID and upstream outage tested.
5. Google sign-in, session expiration, issuer RBAC, CSRF, rate limits, secret boundary, mobile/browser and privacy tests; API/proxy deep links, legacy redirect preservation.
6. npm ci; npm run validate:prod; npm audit --audit-level=high; npm run acceptance:live, all green on exact release SHA; hosted evidence, independent review, human merge/deployment approval and rollback plan.

No feature is 'production' solely because it is in a route manifest, design document, open PR, or demo. Do not merge competing open PRs without conflict reconciliation. Do not claim compliance certification, global standard adoption, cryptographic completeness, profitability, or government endorsement without independent evidence.

## Sequencing
Security/acceptance remediation → contract and Tier 1 route reconciliation → authenticated issuer lifecycle → signature gate → payment/entitlement integration → external issuer pilot → sales. Wallet and broader verticals are not first-certificate-release blockers unless separately approved and fully tested.

## Acceptance evidence record
Record exact commit SHA, workflow/run URL, package lockfile hash, deployed runtime version, canonical origin/proxy config, API version, test output, real test QRVID, signed/unsigned state, verified and revoked timestamps, redacted audit evidence, payment provisioning test, rollback instructions, and named human release approval. Never include secrets or private holder details.
