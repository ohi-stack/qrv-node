# QR-V Production Implementation Gates — 2026-10-11

Status: IMPLEMENTATION CONTRACT / NOT RELEASE EVIDENCE
Owner repository: ohi-stack/qrv-node
Runtime: qrv.network (browser-facing Express + React/Vite)
Authority: api.qrv.network (API + canonical PostgreSQL)

## Non-negotiable boundaries
- Preserve QRVP-1 identifier/resolution/verification/registry/response semantics and QVS-1.0 deterministic status rules.
- Do not add a second writable registry or database to qrv-node, Wallet, or browser.
- No database URL, signing private key, Firebase admin credential, Stripe secret, or privileged API key in VITE_* or browser bundles.
- Preserve Express-owned verification, issuer, registry, health/readiness/version, compatibility, QR, status and redirect routes while integrating the frontend.
- Legacy issuer/verify/registry/wallet/docs/developers/explorer hostnames are compatibility aliases only; enable redirects after canonical deep-link and status acceptance.
- Verification is of issuer-attributed record integrity and lifecycle state, not governmental approval, title ownership, licensing, or legal validity.

## P0 customer journeys
1. Visitor: landing page → explain verification → public scan/manual QRVID → accessible current result with provenance, issuer, timestamps, state and privacy filtering.
2. Issuer: register/login (secure session, optional Google OAuth), authorization/tenant isolation → dashboard → issue certificate → QRVID → canonical HTTPS QR → verification → revoke same record → REVOKED → audit history.
3. Holder: /wallet, /wallet/login, /wallet/register, /wallet/dashboard, /wallet/records, /wallet/records/:qrvid, /wallet/add, /wallet/scan, /wallet/share, /wallet/settings, /wallet/security, /wallet/help. Save only permitted reference/metadata, re-verify on view/share, fail closed when API unavailable, never claim possession proves ownership.
4. Admin: /admin with RBAC/MFA as appropriate, live issuer/record/verification/revocation metrics, activity, charts, security/health, billing visibility and audit drilldowns; no mock counters or cross-tenant leakage.
5. Developer/agent: documented OpenAPI, key lifecycle, examples, machine-readable deterministic errors, rate limits, sandbox, integration guides.
6. Customer: pricing → signup → billing → webhook-verified entitlement/provisioning → receipt/account state; do not enable charges for unavailable services.

## Implementation priorities
P0-A: Diagnose October 10 failed live acceptance at 813d2cb. Collect job logs, annotations, redirect chains, actual content types/status codes and current hosting mappings; classify defect vs stale assertion before changing tests.
P0-B: Resolve issue #49 Firebase/Firestore/grpc high-severity audit without force upgrades; preserve Google login, sessions and acceptance. Require clean npm audit --audit-level=high, lockfile reproducibility and regression tests.
P0-C: Reconcile open PRs #40–#51 and Sites/marketing frontend sources. Choose one canonical implementation per route. Preserve working Express routes, source provenance, accessibility, responsive design and SEO.
P0-D: Prove real PostgreSQL record → SHA-256 and Ed25519 key-id validation → canonical QR → VERIFIED → revoke SAME QRVID → REVOKED → immutable audit; survive restart; enforce issuer isolation and privacy modes.
P0-E: Finish secure issuer and wallet flows, dashboard data APIs, admin RBAC, error/loading/empty states, keyboard/mobile usability.
P0-F: Hostinger platform/API mapping, secrets separation, migrations/backups/restore drill, readiness, monitoring, rollback, and legacy redirects.
P1: Stripe catalog reconciliation, customer onboarding/provisioning, real analytics, developer portal/SDK, external founding-issuer pilots.
P2: White-label, advanced identity/financial/property integrations and expanded campaigns after production acceptance.

## Required release evidence
- Record exact deployed SHA, version, environment, migration revision, API origin and time.
- CI: lint, build, tests, routing, contract, dependency audit, CodeQL/security, accessible/mobile checks.
- Live: healthz/readyz/version JSON, root/verify/issuer/wallet/admin routes, desktop/mobile consistency, protected-route auth, negative verification states, fail-closed upstream outage.
- Cryptography: signing key_id, rotation/retirement/compromise procedures, historical signature validation.
- Persistence: transaction audit, tenant boundaries, backup/restore and restart survival.
- Lifecycle: issue/store/QR/scan/VERIFIED/revoke/REVOKED/audit using one real PostgreSQL record, with captured redacted evidence.
- Payments: signed webhook, idempotent provisioning, entitlement enforcement and failure/retry tests before paid launch.
- Human release approval and rollback rehearsal; do not claim COMPLETE or production-ready solely from source or green local tests.

## Cross-repository responsibility
qrv-node owns browser UX, secure session/BFF and presentation; qrv-api owns authoritative writes, cryptography, registry, verification, audit and privileged admin data. Legacy qrv-* repositories are sources/modules or compatibility services pending audited migration, not new independent authorities.

## Truthfulness and release posture
This document is a production implementation plan, not proof these features are deployed. Maintain explicit DESIGN / IMPLEMENTED / TESTED / DEPLOYED / ACCEPTED classifications. Do not merge or deploy while October 10 acceptance and issue #49 are unresolved.
