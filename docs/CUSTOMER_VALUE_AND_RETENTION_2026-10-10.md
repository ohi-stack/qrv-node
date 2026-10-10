# QR-V™ Customer Value and Repeat Usage — October 10, 2026

Status: Product and content requirements. Not a claim of live production acceptance.

## Primary customer promise
**Make every certificate you issue independently verifiable.**

QR-V™ is registry-backed verification infrastructure, not a generic QR generator. Organizations subscribe to continuously issue credentials, preserve authoritative records, expose current status to third-party verifiers, revoke/expire records, and retain auditable evidence.

## Customer journeys
1. **Visitor:** Understand the offer → view a real, clearly labeled demonstration → choose pilot or issuer plan → apply or pay → onboarding.
2. **Issuer:** Authenticate → create certificate → persist in canonical PostgreSQL via api.qrv.network → generate QRVID and canonical verification URL → deliver credential → review analytics → revoke/expire.
3. **Verifier:** Scan or enter QRVID → resolve via authoritative API → display VERIFIED, REVOKED, EXPIRED, NOT_FOUND, or appropriate fail-closed error; never fabricate trust.
4. **Holder:** Add QRVID to /wallet → save permitted reference → reverify upon opening → share canonical verification URL; wallet is not an independent registry or proof of ownership.
5. **Developer:** Review OpenAPI → obtain scoped access → verify with deterministic machine-readable responses.

## Public-facing copy
**Headline:** Make every certificate verifiable.
**Subheading:** Issue QR-linked certificates backed by an authoritative record, with current verification status, expiration and revocation controls, and audit history.
**Primary CTA:** Start a Verified Certificate Pilot
**Secondary CTA:** See How Verification Works
**Issuer CTA:** Manage Certificates
**Holder CTA:** Open QR-V Wallet
**Developer CTA:** Explore the API

### Why customers renew
Each new class, training session, membership cycle, or certification event produces additional records. Independent recipients and employers can check current issuer-issued status. Issuers retain the ability to revoke, expire, and audit records throughout their lifecycle. Do not claim QR-V itself establishes licensing, property title, governmental authority, or truth of underlying issuer assertions.

## Commercial surfaces
- /use-cases/certificates: first market wedge; examples for training organizations, associations, employers, education providers.
- /issuer: issuer onboarding, certificates, records, QR issuance, revocation, analytics.
- /pricing: show only confirmed live purchasable plans and their actual limits. Historical pricing models conflict; reconcile with Stripe and entitlements before publishing.
- /demo: distinguish sandbox/demo from production records; never present mock data as VERIFIED production evidence.
- /wallet: holder-facing QR-V reference wallet, not a crypto wallet.
- /developers: documented API, security and rate limits.
- /status: honest runtime and acceptance state.

## Success measures
Primary: paying issuers who issue additional legitimate records in the next billing period.
Supporting: monthly active verified records per paying issuer; issuer activation rate; records issued; third-party verifications; revocations; issuer retention; contracted MRR; support incidents.

## Production acceptance (blocking)
- Real PostgreSQL issuance survives restart.
- Canonical QR URL resolves on qrv.network.
- Same record transitions VERIFIED → REVOKED after authorized revocation.
- Audit events exist.
- Ed25519 verification, key lifecycle, issuer isolation, privacy, authentication, rate limits, backup/restore, QA and security gates pass.
- Live production acceptance passes at exact deployed commit; current GitHub acceptance failure must be resolved before declaring launch-ready.
- Billing → provisioning → entitlement enforcement is tested before accepting unattended paid subscriptions.
- Legacy wallet.qrv.network redirect remains disabled until /wallet passes acceptance.

## Architecture and source policy
qrv.network owns human-facing routes. api.qrv.network alone owns authoritative verification, persistence, signing, and audit. qrv-marketing-site remains a protected source/reference, not a second production origin. Preserve ChatGPT Sites source provenance and compare latest Sites exports against qrv-node before changing visuals; do not claim new Sites synchronization without evidence.

## Release policy
This file is a content/product specification, not deployment approval. Implement via reviewed PR; preserve Express-owned routes and React/Vite source, pass CI, inspect hosting mapping, obtain release approval, and then redeploy and verify live pages.
