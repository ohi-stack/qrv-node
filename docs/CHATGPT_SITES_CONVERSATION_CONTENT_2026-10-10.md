# QR-V™ Conversation and ChatGPT Sites Content Integration — 2026-10-10

## Scope and authority
This document is a content integration brief for the canonical qrv.network public application. It is not a production acceptance certificate. QRVP-1 defines protocol behavior; QVS-1.0 defines verification semantics. Site copy must distinguish implemented features from planned capabilities.

## Canonical runtime
- qrv.network: public React/Express platform, verifier, issuer, holder wallet, docs, pricing, developer onboarding.
- api.qrv.network: trusted API, authorization, canonical PostgreSQL records, cryptographic validation, issuance, revocation and audit.
- Legacy verify, issuer, registry, wallet, docs, developer and explorer hostnames: redirects/compatibility only after verified parity.
- qrv-marketing-site and ChatGPT Sites source: provenance/migration sources, not an independently writable production app.

## Public content
**Hero:** QR-V™ Global Verification Network
**Headline:** Verification infrastructure for records that need to be trusted.
**Explanation:** A conventional QR code points to a destination. QR-V is designed to resolve a record identifier and check issuer authorization, integrity and current lifecycle status against an authoritative registry.
**Primary CTA:** Verify a Record → /verify
**Secondary CTA:** Become an Issuer → /issuer
**Tertiary CTA:** Explore QRVP-1 → /protocol
**Caution:** A verification result establishes only what the issuer and registry can substantiate; it does not independently confer governmental recognition, legal title, licensing or ownership.

## Audience pathways
- Verifiers: /verify and /verify/:qrvid; manual lookup and QR scan.
- Issuers: /issuer, registration/login, dashboard, create certificate, records, revocation, audit and account settings.
- Holders: /wallet, registration/login, add/scan, records, record detail, sharing, security and re-verification.
- Developers: /developers, /api-reference, documented authentication and integration examples.
- Enterprises: /enterprise, use cases, security, pricing and onboarding.
- Public learning: /about, /protocol, /standards, /docs, /status.

## Core explanatory sequence
ISSUE → CANONICALIZE → HASH/SIGN (only when operationally enabled) → PERSIST → GENERATE QR → SCAN → RESOLVE → VERIFY → VERIFIED → REVOKE → REVOKED → AUDIT.
The same authoritative PostgreSQL record must drive both VERIFIED and REVOKED states. Never present a mock QR graphic or seeded fixture as live proof.

## Verification states
VERIFIED, REVOKED, EXPIRED, NOT_FOUND, invalid integrity/signature, and UNAVAILABLE must have distinguishable, accessible presentations. A transport failure must never be displayed as VERIFIED. Holder wallet references must be re-verified; a saved record is not a second authority.

## Commercial content
First product: Verified Certificates via the Issuer Portal. Adjacent use cases: membership, product authenticity, document, identity, asset and property-record provenance. These are use cases, not claims of existing production capability. Display only approved live prices and checkout integrations; do not imply that payment provisions a functioning account unless tested.

## Source/design integration
Retain existing React/Vite Sites styling, responsive navigation, accessible typography, QR-V branding, high-contrast dark grid, cyan verification action and green status accents. Import and reconcile source from sites/qrv-global-verification and qrv-marketing-site against src/web, not by replacing Express routes. Keep existing auth/session, readiness/version, redirects, API proxies, QR generation and verification handling.

## Release evidence required
1. Confirm qrv-node branch and current deployed SHA.
2. Reconcile every GPT Sites file with canonical src/web, including images, content, sitemap, navigation, and responsive CSS.
3. Validate no regression in existing routes or security controls.
4. npm run validate:prod and npm run acceptance:live.
5. Confirm real PostgreSQL issuance → public VERIFIED → revoke same record → REVOKED, audit, security and QA evidence.
6. Confirm Hostinger domain mapping and API JSON-only health/readiness.
7. Obtain human approval before merging/deploying. The October 10 qrv-node live-production acceptance failure remains an unresolved release gate until a fresh passing run exists.

## Content governance
Record provenance for each imported Sites asset; deduplicate rather than blindly overwrite. Keep public implementation status separate from roadmap. No secret values or private customer records in frontend bundles. Maintain QRVP-1/QVS-1.0 protocol and standard language without unilateral reinterpretation.
