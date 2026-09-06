# QRV.Network Production Content Strategy

## Platform Position
QR-V™ is registry-backed verification infrastructure that turns QR codes into verifiable references. A QR-V scan should resolve through a controlled verification process, not an arbitrary destination.

## Public Site Source of Truth
The canonical public QR-V website and application source is now maintained in:

```text
ohi-stack/qrv-node
```

The former `ohi-stack/qrv-marketing-site` repository and the ChatGPT Sites project `qrv-global-verification` are migration/design sources until parity is verified. New production customer-facing work belongs in `qrv-node`.

## Core Message
Make trusted verification as easy as scanning a QR code.

Supporting promise:

> Verify records, confirm issuer identity, inspect lifecycle status, and resolve to the canonical registry record.

## Canonical Public Platform

```text
qrv.network
```

Public routes should live under the root platform whenever practical:

- `/protocol`
- `/how-it-works`
- `/verify`
- `/registry`
- `/issuer`
- `/use-cases`
- `/pricing`
- `/developers`
- `/docs`
- `/status`
- `/store`
- `/network`
- `/about`
- `/security`
- `/enterprise`

The machine/API boundary remains:

```text
api.qrv.network
```

Legacy subdomains may be retained only as compatibility aliases or controlled redirects where needed.

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
The public site preserves the QR-V Sites direction:

- modern QR-V logo treatment
- responsive customer-facing navigation
- deep navy verification-infrastructure visual language
- gold trust/CTA accents
- cyan network/technology accents
- verification-focused hero copy
- enterprise-grade spacing and typography
- shared desktop/mobile source
- mobile behavior designed intentionally
- deterministic verification states presented without unsupported trust claims

## Commercial Priority
Public pages should lead users toward the revenue-producing QR-V workflows in this order:

1. Verified Certificates
2. Issuer Portal
3. Membership Verification
4. Product Authentication
5. API Platform
6. White-label / Enterprise Deployments
