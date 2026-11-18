# QRV.Network Production Content Strategy

## Platform Position
QR-V™ is registry-backed verification infrastructure that turns QR codes into verifiable references. A QR-V scan should resolve through a controlled verification process, not an arbitrary destination.

## Canonical Public Site Source of Truth
The production QR-V public website source and runtime are now maintained in:

```text
ohi-stack/qrv-node
```

This repository, `ohi-stack/qrv-marketing-site`, is retained as a migration/source-history repository for the original React/Vite visual system, public content, SEO assets, commercialization materials, and ChatGPT Sites provenance. It must not define a competing production deployment.

The ChatGPT Sites project `qrv-global-verification` remains a design/content provenance source. New production public-site changes should converge into `qrv-node`.

## Core Message
Turn every scan into verifiable proof.

Supporting promise:

> Verify records, confirm issuer identity, inspect lifecycle status, and resolve to the canonical registry record.

## Canonical Public Platform

```text
qrv.network
```

Canonical routes include:

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
- `/contact`

The machine/API boundary remains:

```text
api.qrv.network
```

Legacy subdomains may be retained only as compatibility aliases or controlled redirects.

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
- Property and asset references
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
The public site should preserve the QR-V Sites direction:

- modern QR-V logo treatment
- responsive header and mega-menu-ready information architecture
- verification-focused hero copy
- QR-V network visual representation
- enterprise-grade spacing and typography
- shared desktop/mobile source
- intentional mobile navigation

## Commercial Priority
1. Verified Certificates
2. Issuer Portal
3. Membership Verification
4. Product Authentication
5. API Platform
6. White-label / Enterprise Deployments
