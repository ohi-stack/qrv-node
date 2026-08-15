# QR-V™ Founding Issuer Pilot Program

**Program status:** Production activation
**Commercial owner:** ONEGODIAN, LLC
**Platform:** QR-V™ Global Verification Network
**Protocol:** QRVP-1
**Standard:** QVS-1.0
**Initial product:** QR-V™ Verified Certificates

## 1. Purpose

The QR-V™ Founding Issuer Pilot Program converts QR-V from deployed verification infrastructure into measured real-world usage. The pilot validates the complete production lifecycle:

`ISSUER ONBOARDING → ISSUE → REGISTER → QR → SCAN → VERIFY → REVOKE/EXPIRE → AUDIT`

The pilot does not confer governmental, licensing, recording-office, title, accreditation, or other legal authority. QR-V verifies the issuer's registered record, provenance, integrity, lifecycle status, and permitted metadata.

## 2. Pilot cohort

### QRV-PILOT-001 — ONEGODIAN, LLC

Initial scope:
- certificates of completion
- product/authenticity certificates
- QR-V-issued digital certificates
- public-safe internal business records

Target: 50 legitimate production records.

### QRV-PILOT-002 — Algonquian Real Estate LLC

Initial scope:
- training/completion certificates
- property information packages
- inspection/contractor record references where appropriate
- transaction-document integrity references where appropriate
- property marketing/authenticity records

Target: 50 legitimate production records.

Real-estate pilot records must not be represented as deeds, title insurance, land-record filings, governmental records, professional licenses, or evidence of legal title unless the underlying issuer actually has authority to make that representation.

### QRV-PILOT-003 — Independent Founding Issuer

Target: first unrelated external organization successfully onboarded after the two affiliated issuer pilots pass acceptance.

Candidate categories: training provider, nonprofit, contractor, auto business, membership organization, employer, school, association, or professional-services company.

## 3. Pilot issuer record

Every pilot issuer must have:
- immutable internal issuer UUID
- human-readable issuer code
- legal name
- display name
- issuer status
- verified organization contact
- public issuer profile
- signing public key where cryptographic signing is enabled
- approved record types
- pilot start date
- audit history

Recommended codes:
- `QRV-ISS-000001` — ONEGODIAN, LLC
- `QRV-ISS-000002` — Algonquian Real Estate LLC
- `QRV-ISS-000003` — reserved for first independent founding issuer after approval

Do not seed an external organization as an approved issuer before its onboarding and authorization are complete.

## 4. Record policy

The first 100 records must be legitimate records issued in the ordinary course of the participating organization's activities. Demo fixtures do not count toward the 100-record production objective.

Initial QRVID family:
- `QRV-PROD-CERT-######`

New QR codes must resolve to the canonical platform URL:
- `https://qrv.network/verify/{qrvid}`

Each record must preserve:
- issuer
- record type
- subject/recipient data permitted for disclosure
- issuance timestamp
- expiration timestamp when applicable
- deterministic lifecycle state
- SHA-256 record hash
- Ed25519 signature when enabled
- privacy classification
- audit events

## 5. Deterministic states

The pilot acceptance contract uses:
- `VERIFIED`
- `REVOKED`
- `EXPIRED`
- `NOT_FOUND`

Additional security states may be returned by implementation controls, but no ambiguous success state may be substituted for `VERIFIED`.

## 6. Privacy and data minimization

Public verification responses must expose only data necessary to establish authenticity and status. Sensitive or unnecessary personal data must not be placed in QR payloads or public verification responses.

Use public, restricted, or private disclosure modes according to the record type. The canonical registry may retain fields that the public verifier does not expose.

## 7. Pilot metrics

Track per issuer and globally:
- records issued
- records currently VERIFIED
- records revoked
- records expired
- verification scans/requests
- unique verification sessions where technically and lawfully measurable
- verification success rate
- API error rate
- p50/p95 verification latency
- issuance failures
- revocation propagation time
- support incidents
- issuer activation date
- time from onboarding to first issued record

## 8. Production acceptance gates

### Gate A — Platform readiness
- `qrv.network` operational
- `api.qrv.network/healthz` passes
- `api.qrv.network/readyz` passes
- production database migrated
- audit logging enabled
- production secrets configured server-side

### Gate B — Issuer 001 lifecycle
ONEGODIAN, LLC can create a certificate, receive a QRVID, render a scannable QR, obtain `VERIFIED`, revoke the record, and then obtain `REVOKED`.

### Gate C — Issuer 002 lifecycle
Algonquian Real Estate LLC independently completes the same lifecycle under its own issuer identity and authorization scope.

### Gate D — 100-record milestone
At least 100 legitimate production records exist across Pilot Issuers 001 and 002 and are auditable by issuer and lifecycle state.

### Gate E — External adoption
An unrelated organization completes onboarding, issues its first legitimate record, and successfully verifies it publicly. Only after this gate should QR-V describe the program as demonstrating independent external issuer adoption.

## 9. Operating controls

Human approval is required for:
- approving or suspending an issuer
- changing an issuer's legal identity
- production signing-key rotation
- destructive record corrections
- privacy-mode overrides
- schema migrations affecting canonical verification semantics

Revocation must be auditable and should be immediately reflected by the verification API after the authoritative write commits.

## 10. Pilot dashboard

`/issuer` should expose a Founding Pilot view with:
- issuer identity and status
- production record count
- verified/revoked/expired counts
- recent verification activity
- issue-record action
- record manager
- revoke action
- QR/download action
- API usage
- audit trail

An internal/admin view should aggregate the cohort and show progress toward `100 records + 1 independent issuer`.

## 11. Commercial transition

Pilot participation is not a promise of permanent free service. Before external onboarding, publish a short pilot agreement defining:
- pilot term
- included issuance/verification volume
- data processing responsibilities
- support scope
- permitted claims and use of QR-V marks
- termination and record-retention behavior
- conversion path to a paid QR-V Issuer plan

The commercial objective is to convert validated issuer workflows into recurring Issuer Portal subscriptions, implementation services, API usage, and enterprise/white-label deployments.

## 12. Definition of done

The Founding Issuer Pilot Program v1 is complete only when:

1. ONEGODIAN, LLC has a production issuer identity and successful create → QR → VERIFIED → revoke → REVOKED lifecycle.
2. Algonquian Real Estate LLC has a separate production issuer identity and passes the same lifecycle.
3. The two issuers collectively issue at least 100 legitimate production records.
4. Pilot metrics and audit events are visible and exportable.
5. The first unrelated external issuer is onboarded and successfully verifies at least one legitimate record.
6. The results are documented as a dated pilot report without overstating legal authority or independent adoption.

## 13. North-star pilot objective

> Issue and publicly verify the first 100 legitimate QR-V records across two affiliated businesses, then onboard the first independent external issuer.
