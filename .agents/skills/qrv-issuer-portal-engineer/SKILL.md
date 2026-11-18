---
name: qrv-issuer-portal-engineer
description: Complete customer-facing issuer identity, certificate issuance, QR creation and revocation while keeping writes server-side.
---
# QRV-06 — qrv-issuer-portal-engineer

**Priority:** P0  
**Lead:** Issuer application engineer  
**Primary implementation repository:** `ohi-stack/qrv-node`  
**Maturity:** SPECIFIED — no execution, CI pass, deployment or production acceptance implied.

## Trigger
Issuer login, signup, dashboard, record/certificate creation, revocation, team, analytics or API key UI changes.

## Normative authority and trust boundary
QRVP-1 defines the protocol layers; QVS-1.0 governs deterministic verification. `qrv.network` is the human-facing platform, `api.qrv.network` is the trusted JSON API, and `qrv-api` alone owns the canonical PostgreSQL registry, protected writes and signing keys. Do not create another registry or change protocol semantics as an incidental implementation detail. An AI agent does not approve its own production release.

## Required inputs
Issuer journeys, permission model, backend OpenAPI, account entitlements, UI routes and acceptance fixtures.

## Procedure
1. Implement server-authenticated issuer login/registration as applicable, provider-verified Google sign-in if enabled, sessions, logout and role/tenant isolation; remove placeholder browser-only grants.
2. Use server-to-server qrv-api calls with scoped credentials for issuance, listing, detail, revocation and audit; no browser signing keys or master API keys.
3. Generate printable QR SVG/PNG only after successful canonical issuance and encode the canonical public verification URL.
4. Provide dashboard KPIs, records, certificates, QR codes, revocations, analytics, API keys, team, billing and settings without inventing data; clearly label unavailable modules.
5. Show explicit success/failure and issuer-safe errors; require authorization and CSRF defenses for mutation.
6. Use customer workflows and public release status truth: a designed page is not proof that its backend operation works.

## Verification and evidence
- Login, expired session, cross-issuer access, CSRF, failed API, create + QR + verify + revoke and dashboard data provenance.
- Desktop/mobile accessibility and account onboarding smoke checks.
- Record target repository, branch, commit SHA, environment, test commands/results, CI links, relevant PR/issue, and evidence artifacts; redact secrets and personal data.
- Fail closed. A page rendering, a mock fixture or design specification does not constitute a production-accepted capability.

## Definition of done
An authorized real issuer completes the lifecycle on qrv.network using qrv-api, with real persisted records and no privilege leakage.

## Escalation / approval
Identity provider policy, billing entitlement changes, or privileged admin mutation requires human approval.

## Response contract
Return: `status` (NOT_STARTED | IN_PROGRESS | BLOCKED | READY_FOR_REVIEW | PASSED | FAILED | COMPLETE), `owner`, `repository`, `branch/PR`, `dependencies`, `evidence`, `blockers`, `next_action`. Use COMPLETE only when all applicable acceptance evidence exists.
