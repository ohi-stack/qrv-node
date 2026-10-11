# QR-V™ — Production consolidation baseline (11 October 2026)

**Classification:** repository integration / release-candidate requirements, **not** evidence of a completed live release.
**Owner/operator:** ONEGODIAN, LLC (private technology and commercial platform).
**System:** QR-V™ Global Verification Network (GQVN™).
**Protocol baseline:** QRVP-1 (3 March 2026).
**Verification standard baseline:** QVS-1.0 (5 March 2026).
**Product:** QR-V™ Verified Certificates / Founding Issuer Pilot.
**Primary objective:** first external paying certificate issuer with a repeatable, auditable lifecycle.

## 1. Controlling runtime boundary

- `qrv.network` / `ohi-stack/qrv-node`: public React presentation, verification, issuer login/portal, pricing, documentation, support and customer conversion.
- `api.qrv.network/api/v1` / `ohi-stack/qrv-api`: authoritative issuance, cryptographic and lifecycle validation, revocation, audits, tenant authorization, entitlements and webhook processing.
- Exactly **one** writable PostgreSQL registry authority behind the API. The March 2026 deployment record documents an earlier Cloud SQL instance, but does **not** establish which database is currently used in production. Reconcile any Supabase migration to the same single writable authority.
- `qrv.network/api/v1/*` is only a compatibility proxy. A browser, Firestore collection, WordPress database, wallet, QR image or local cache must not become a second registry authority.
- QR payload for new records: `https://qrv.network/verify/{QRVID}`. Previously printed QR links require explicit backward-compatibility testing before retiring their hostname.
- Legacy `verify`, `issuer`, `registry`, `explorer`, `docs`, `developers`, `wallet` subdomains are **not** separate production applications by default. Enable aliases only after routing, DNS and historic link requirements are verified.

## 2. Protocol-level behavior, with maturity boundaries

1. Scan/resolve identifier → registry lookup → issuer and record integrity validation → lifecycle status → minimally disclosed verification response.
2. Canonical states: `VERIFIED`, `REVOKED`, `EXPIRED`, `NOT_FOUND`; malformed IDs are errors, not unknown records.
3. Network error, auth redirect, invalid JSON, unverifiable issuer, integrity failure or invalid signature must never display VERIFIED.
4. SHA-256 is the documented implemented integrity foundation; Ed25519 is a **separate, incomplete production gate** until signing keys, canonical payload, signing, persistence, issuer public-key resolution, verification, rotation, revocation and negative tests are evidenced.
5. QR codes provide resolvable pointers, **not** independent legal proof, title, licensure, government credentials or accreditation.
6. Public, restricted and private disclosure require server-enforced policy. Do not expose recipient, owner, identity or sensitive metadata until that policy is tested at the API boundary.
7. Verification, issuer approval, issuance, revocation, payment and admin control must produce audit events; browsers may not write canonical audit events.

## 3. Required issuer experience

Public `/issuer` and authenticated dashboard must distinguish a **single-issuer founding pilot** from production multi-tenancy.

Required flows and controls:
- approved organization / issuer ID; authorized roles and server-enforced issuer scope;
- overview cards for issued, VERIFIED, REVOKED, EXPIRED, verifications, error rate and revenue where trusted data exists;
- records table, new certificate form, QR/PNG download, record detail, expiration, revocation reason, audit trail and exports;
- API key administration, issuer-specific analytics, team administration, billing/entitlements, settings, documentation and support;
- no fictional dashboard traffic, issuer counts, revenue, health, latency or adoption statistics;
- Google and email Firebase login may serve end-user identity/bookmarks; **it does not itself authorize issuer writes**. Issuer privileges require an API-side approved issuer role and binding.
- do not promote the existing shared access-code founding-pilot flow to multi-tenant SaaS until server-enforced tenant isolation is implemented and tested.

The WordPress issuer plugin is **optional**, subordinate to the same canonical API, and not required for the first sellable certificate lifecycle. Never create a second writable WordPress registry.

## 4. Commercial v1

Sell the result: an organization can issue an authenticatable, current, revocable certificate.
Initial buyer categories: safety/trade training, certification programs, continuing education, workforce providers, private academies, professional associations and internal staff training.

Primary funnel:
`certificate problem → live demonstration → qualified issuer pilot → approved agreement/payment → issuer entitlement → issue → scan/verify → support/renewal`.

Use the live public price presentation as the **public launch pricing candidate**:
- controlled Pilot: $0 (subject to approval/limits);
- Starter: $49/month;
- Professional: $299/month;
- Enterprise: custom proposal.

Historical plans also contain $29/$99/$499, $199/$499/$1,500/$5,000+, and implementation prices from $1,500 to $25,000. Those are **historic/proposed offer variants**, not simultaneously binding prices. Validate any existing Stripe price IDs/payment links against the actual commercial catalog before surfacing them. No entitlement may activate from a browser redirect or unverified payment; use verified server-side Stripe webhook state and idempotent provisioning.

A proposed short-term founding implementation fee is $1,500 plus $299/month after pilot activation, **subject to offer approval and a written agreement**, not an automatically active Stripe price.

Operational scorecard: independent paying issuers, genuine issued records, verification requests, renewal/MRR, implementation receipts, revocations, support incidents, time to activate, payment/entitlement failures and net margin **after** costs. Targets are projections, not historical achievements.

## 5. Must pass before production designation

- Same known QRVID is created by an authorized issuer, has an independently scannable URL, verifies VERIFIED, is revoked, then verifies REVOKED on the **same URL**, with traceable audit events.
- Separate issuer cannot read, issue as, or revoke another issuer's records. Do not rely on a client-supplied issuer name or header without API validation.
- Server rejects missing/invalid issuer tokens, cross-tenant access, malformed IDs, invalid signature, unavailable datastore, invalid response content-type and upstream login redirects.
- Live routing and host acceptance: `qrv.network` owns UI; `api.qrv.network` returns public JSON health/readiness/version and canonical API JSON; no login SPA/proxy interception.
- CI build, route tests, negative-state tests and dependency audit pass with a reproducible lockfile.
- Database backup, controlled migration, database ingress restriction, key custody/rotation, privacy, rate limits, observability, rollback and human release approval documented.
- One independent external issuer successfully executes the lifecycle before claiming third-party network adoption.

## 6. Deliberately deferred

No additional standalone subdomain, blockchain rewrite, mobile scanner, public explorer expansion, universal wallet/holder custody, financial-token feature, federation, multiregion replication, new vertical or 100-page standard rewrite is a prerequisite to the first paid certificate pilot.

Wallet, advanced holder access, multi-issuer issuance, white-label and federated nodes remain staged work unless their implementation has passed its own production tests. Open PR descriptions and ChatGPT Sites screens are **not** operational evidence.

## 7. Source-of-record and chronology

Materials contributing to this integration baseline:
- `QR-V™ Internet Protocol (QRVP-1) Developer Specification.pdf`
- `QR-V™ Global Verification Standard QVS-1.0.pdf`
- `QR-V™ Infrastructure Deployment Record.pdf`
- `Domain Acquisition Record QR-V™ Global Verification Network.pdf`
- `QR-V™ Root Domain Infrastructure Architecture.pdf`
- `QR-V™ Issuer Portal.pdf`
- `The Product That Can Get the First 10,000 QR-V Users.pdf`
- `QR-V™ First $1M Monetization Plan.pdf`
- project conversation: subsequent root-domain consolidation, production-site validation, Stripe catalog and 30-day revenue strategy.

Historical domain and database claims are documentary history, not a substitute for current infrastructure evidence. Public attribution may identify Gregory “One” Jones / One Gregory Onegodian™ as the originator/architect according to the source records; describe ONEGODIAN, LLC as the private commercial owner/operator. Do not imply regulatory endorsement, governmental sovereignty or independently adopted Internet-standard status.

**Versioning rule:** if not operational, documented and repeatable, the capability is pre-release, not current production.
