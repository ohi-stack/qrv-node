# QR-V™ Production Content Map

This file defines the production content and route responsibilities for the consolidated QR-V platform node.

## Runtime rule

QR-V production uses two runtime nodes:

```text
qrv.network       = public platform, human workflows, docs, pricing, issuer UI, verification UI
api.qrv.network   = trusted backend, API, registry persistence, cryptography, audit, webhooks
```

Legacy hostnames may remain as compatibility redirects only.

## Primary navigation

```text
QR-V Protocol
How It Works
Registry
Use Cases
Developers
About
```

## Utility navigation

```text
Verify
Issuer Portal
Pricing
Docs
Status
Store
```

## Required public routes

```text
/
/protocol
/how-it-works
/standards
/security
/verify
/verify/:qrvid
/registry
/registry/:qrvid
/explorer
/issuer
/issuer/dashboard
/issuer/records/new
/issuer/records/:qrvid
/docs
/docs/overview
/docs/protocol
/docs/verification
/docs/registry
/docs/issuers
/docs/developers
/api-reference
/developers
/pricing
/store
/enterprise
/certificate-verification
/status
/about
/contact
```

## Route content requirements

### `/`

Purpose: root command hub and enterprise product introduction.

Must state:

- QR-V is registry-backed verification infrastructure.
- QR-V is not a generic QR-code generator.
- The production platform uses `qrv.network` plus `api.qrv.network`.
- The first commercial product is QR-V Verified Certificates.

Primary CTA:

```text
Verify a Record
```

Secondary CTA:

```text
Become an Issuer
```

### `/verify`

Purpose: public verification entry point.

Must support:

- manual QRVID entry
- demo QRVID link
- deterministic status explanation
- public-safe display rules

Canonical demo:

```text
QRV-PROD-CERT-000001
```

### `/issuer`

Purpose: issuer onboarding and login.

Must explain:

- create QR-V records
- generate QR codes
- manage lifecycle
- revoke records
- view analytics
- use API access

### `/issuer/dashboard`

Purpose: authenticated issuer workspace.

Must show:

- active records
- revoked records
- total verifications
- quick issue action
- latest records
- API connectivity state

### `/registry`

Purpose: public-safe registry explanation and lookup UI.

Must explain that the registry is the source of truth but direct persistence stays behind `api.qrv.network`.

### `/explorer`

Purpose: user-friendly inspection surface for QRVID, issuer, hash, certificate, and lifecycle lookups.

### `/docs`

Purpose: documentation landing page.

Minimum sections:

- Overview
- Protocol
- Verification
- Registry
- Issuers
- Developers
- API Reference
- Security

### `/developers`

Purpose: developer onboarding.

Must include:

- API base URL
- verify endpoint
- record create endpoint
- revoke endpoint
- authentication notes
- deterministic response model

### `/pricing`

Purpose: conversion.

Recommended launch structure:

```text
Founding Pilot
Starter Issuer
Professional Issuer
Enterprise / White Label
API Access
Implementation Services
```

### `/status`

Purpose: public operational status.

Must show:

- qrv.network
- api.qrv.network
- registry readiness
- verification availability
- issuer workflow status
- current launch stage

## API dependency

The platform node must call:

```text
https://api.qrv.network/api/v1
```

Do not configure `qrv.network` to call itself as the canonical API.

## Security placement

Never place these in platform/client code:

```text
DATABASE_URL
SUPABASE_SECRET_KEY
QRV_API_KEY
QRV_WEBHOOK_SECRET
JWT_SECRET
Ed25519 private keys
database admin credentials
```

## Definition of done

QR-V is production-ready when:

```text
qrv.network loads
api.qrv.network healthz passes
api.qrv.network readyz passes
issuer creates a certificate
API persists the canonical record
QR code points to qrv.network/verify/{QRVID}
public verification returns VERIFIED
issuer revokes the record
public verification returns REVOKED
audit log records the full lifecycle
```
