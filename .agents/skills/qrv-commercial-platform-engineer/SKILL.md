---
name: qrv-commercial-platform-engineer
description: Deliver issuer SaaS onboarding, billing entitlement and recurring customer value after core verification is accepted.
---
# QRV-11 — qrv-commercial-platform-engineer

**Priority:** P2  
**Lead:** Commercial application engineer  
**Primary implementation repository:** `ohi-stack/qrv-node`  
**Maturity:** SPECIFIED — no execution, CI pass, deployment or production acceptance implied.

## Trigger
Pricing, checkout, subscription, limits, trials, paid onboarding or white-label provisioning.

## Normative authority and trust boundary
QRVP-1 defines the protocol layers; QVS-1.0 governs deterministic verification. `qrv.network` is the human-facing platform, `api.qrv.network` is the trusted JSON API, and `qrv-api` alone owns the canonical PostgreSQL registry, protected writes and signing keys. Do not create another registry or change protocol semantics as an incidental implementation detail. An AI agent does not approve its own production release.

## Required inputs
Approved price catalog, billing processor contracts, customer entitlement model, issuer offering and legal disclosures.

## Procedure
1. Treat Verified Certificates and Issuer Portal as first commercial products; reconcile proposed prices with the live approved Stripe catalog before display.
2. Implement secure onboarding from payment to entitlement through backend verified signed webhooks and idempotent processing; no payment secret in browser bundles.
3. Apply plan limits to issuer authority through qrv-api, not a UI-only counter; produce billing/status and customer support visibility.
4. Track qualified issuers, activated issuers, valid records, successful verifications, churn and usage without fabricated metrics.
5. Separate proof of record authenticity from governmental recognition, licensing, title, financial validity or ownership claims.
6. Do not turn on billing/provisioning production mutations before the P0 certificate lifecycle and security gates pass.

## Verification and evidence
- Webhook signature/replay, entitlement drift, failed payment, cancellation, idempotency, tenant isolation and audit.
- First paying issuer journey only after production acceptance; terms and disclosures reviewed.
- Record target repository, branch, commit SHA, environment, test commands/results, CI links, relevant PR/issue, and evidence artifacts; redact secrets and personal data.
- Fail closed. A page rendering, a mock fixture or design specification does not constitute a production-accepted capability.

## Definition of done
Approved paid issuer can onboard, issue permitted records and obtain correct subscription access with reconciliation evidence.

## Escalation / approval
Changes to price, live funds movement, refunds, legal claims and enterprise commitments require human approval.

## Response contract
Return: `status` (NOT_STARTED | IN_PROGRESS | BLOCKED | READY_FOR_REVIEW | PASSED | FAILED | COMPLETE), `owner`, `repository`, `branch/PR`, `dependencies`, `evidence`, `blockers`, `next_action`. Use COMPLETE only when all applicable acceptance evidence exists.
