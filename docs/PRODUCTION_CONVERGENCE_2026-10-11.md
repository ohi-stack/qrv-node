# QR-V Production Convergence — 2026-10-11

Status: RELEASE BLOCKED until evidence gates pass. This document is a production execution contract, not evidence of deployment.

## Canonical topology
- qrv.network: Express-owned public routes, React/Vite presentation, issuer and holder/wallet experiences.
- api.qrv.network: authoritative JSON API, PostgreSQL writes, issuance, issuer authorization, verification, revocation, audit and Ed25519 key custody.
- PostgreSQL: sole canonical writable registry. No separate writable registry in qrv-node or wallet.
- Legacy hostnames: compatibility redirects only after parity and preservation of path/query/QRVID are tested.
- Protocol QRVP-1 and standard QVS-1.0 remain normative; do not silently alter verification semantics.

## P0 release blockers (do not bypass)
1. Reproduce issue #49 against exact head using npm audit --json, npm ls firebase @grpc/grpc-js, and lockfile; remediate compatible Firebase/Firestore transitive vulnerabilities without npm audit fix --force. Require npm audit --audit-level=high PASS, CI PASS, Google sign-in/session/CSRF regression PASS.
2. Diagnose QR-V Live Production Acceptance failure on 813d2cb: archive job logs/annotations; map each failing assertion to Express route, proxy, auth, missing implementation, or stale assertion; correct code or test with evidence, never weaken acceptance to hide a defect.
3. Verify deployed build provenance, /healthz, /readyz, /version, static /robots.txt, /sitemap.xml, /site.webmanifest, issuer and verification route ownership.
4. Verify real PostgreSQL issuance: authorized issuer -> persistent record -> canonical QR URL -> public VERIFIED -> revoke same QRVID -> public REVOKED -> audit events. Prove across restart/redeployment; reject demo/in-memory fixtures as production evidence.
5. Require SHA-256 canonicalization and Ed25519 signing/verification with immutable kid, active/retired/revoked key lifecycle, rotation and historical verification. Signing private keys only on API backend.
6. Test auth and authorization: email/Google login if supported, issuer tenancy/RBAC, server-side session, CSRF, rate limiting, restricted-data filtering and negative cases.
7. Confirm backup/restore, migration safety, monitoring, alerting, rollback and independent security/QA review. Human approval required before merge or deployment.

## P0 human workflows
- Visitor: discover -> verify by QRVID or scan -> understand deterministic VERIFIED/REVOKED/EXPIRED/NOT_FOUND/INVALID/UNAVAILABLE states.
- Issuer: onboarding -> login -> dashboard -> create record/certificate -> generate QR -> manage/revoke -> analytics/audit/API keys/team/billing as implemented. Do not show fake operational data.
- Holder: /wallet, /wallet/login, /wallet/register, /wallet/dashboard, /wallet/records, /wallet/records/:qrvid, /wallet/add, /wallet/scan, /wallet/share, /wallet/settings, /wallet/security, /wallet/help. Wallet stores references and allowed metadata only; reverify on display and fail closed on unavailable/invalid status.
- Developer/agent: documented API contract, keys/scopes, predictable errors, idempotency, rate limits, integration examples.
- Buyer: pricing/store -> pilot inquiry -> authorized issuer provisioning; paid checkout must not imply automatic provisioning until integration is tested.

## Claims and commercialization
QR-V is registry-backed verification infrastructure, not a generic QR generator. Public demonstrations and published documentation do not establish a complete production service. Prioritize Verified Certificates and Founding Issuer Pilot, then independent external issuer evidence and paid subscriptions. Do not imply governmental title, license, ownership or official status merely from a QR-V verification result.

## Deferred (not launch blockers)
Independent explorer/docs/developer runtimes, native mobile scanner, blockchain registry, multi-region/federated registry, speculative product verticals, cosmetic dashboards without data. Wallet remains an agreed holder-facing P0 workflow, but it must not delay fixing security and verification truth.

## Acceptance evidence manifest
For every gate record: issue, owner, PR, exact SHA, CI run URL, test output, deployment SHA/version, endpoint/result, screenshot or redacted logs, reviewer, rollback evidence and human approval. Status must be NOT_STARTED/IN_PROGRESS/BLOCKED/READY_FOR_REVIEW/PASSED/FAILED/COMPLETE. COMPLETE requires reproducible evidence.

## Safe deployment order
Dependency/security remediation -> acceptance/routing/auth correction -> API/PostgreSQL/signing gates -> qrv-node issuer/verification/wallet contract validation -> staging E2E -> backup/rollback rehearsal -> human approval -> deployment -> live acceptance -> pilot issuer.
