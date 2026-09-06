# QRV.Network Production Content Strategy

## Platform Position
QR-V™ is registry-backed verification infrastructure that turns QR codes into verifiable references. A QR-V scan should resolve through a controlled verification process, not an arbitrary destination.

## Historical Public Site Source of Truth
The public QR-V website source was previously maintained in:

```text
ohi-stack/qrv-marketing-site
```

The ChatGPT Sites project `qrv-global-verification` was a design/content source synchronized into that repository.

**Consolidation note (2026-09-06):** `ohi-stack/qrv-node` is now the canonical production repository for `qrv.network`. This document is preserved for content strategy and provenance; source-authority statements above are historical and superseded by `docs/MARKETING_SITE_CONSOLIDATION_AUDIT_2026-09-06.md`.

## Core Message
Turn every scan into verifiable proof.

Supporting promise:

> Verify records, confirm issuer identity, inspect lifecycle status, and resolve to the canonical registry record.

## Canonical Public Platform

```text
qrv.network
```

Public routes should live under the root platform whenever practical:

- `/protocol`
- `/how-it-works`
- `/verification`
- `/registry`
- `/issuers`
- `/use-cases`
- `/pricing`
- `/developers`
- `/docs`
- `/status`
- `/store`
- `/network`
- `/about`
- `/support`

The machine/API boundary remains:

```text
api.qrv.network
```

Legacy subdomains may be retained only as compatibility aliases or controlled redirects where needed.

## Primary Pages
1. Home
2. QR-V Protocol
3. How It Works
4. Verification
5. Registry
6. Issuers
7. Use Cases
8. Pricing
9. Developers
10. Documentation
11. Status
12. Store
13. Network
14. About
15. Support / Contact
16. Privacy
17. Terms

## Live Demo Record

```text
QRV-PROD-CERT-000001
```

## Use Case Categories
- Certificates
- Credentials
- Product authenticity
- Membership verification
- Document verification
- Financial records
- Property and title references
- Event access
- Supply chain traceability
- Asset registration

## CTA Language
- Verify a Record
- Become an Issuer
- View Live Demo
- Read Developer Docs
- Check Network Status
- Explore QR-V Network

## Visual / UX Direction
The public site should preserve the current QR-V Sites direction:

- modern QR-V logo treatment
- responsive header and mega menu
- separate light/dark logo variants where needed
- animated QR-V network representation in hero sections
- verification-focused hero copy
- enterprise-grade spacing and typography
- shared desktop/mobile source
- mobile navigation designed intentionally rather than a wrapped desktop menu

## Commercial Priority
Public pages should lead users toward the revenue-producing QR-V workflows in this order:

1. Verified Certificates
2. Issuer Portal
3. Membership Verification
4. Product Authentication
5. API Platform
6. White-label / Enterprise Deployments
