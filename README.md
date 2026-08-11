# QR-V™ Consolidated Platform Node

`qrv-node` is the browser-facing production application for the QR-V™ Global Verification Network.

## Production Architecture

QR-V is consolidated to two deployed application nodes:

```text
https://qrv.network      → all public and authenticated browser experiences
https://api.qrv.network  → all versioned JSON/API operations
```

PostgreSQL remains the canonical registry datastore but is no longer exposed as a separate public application node.

## Canonical Platform Routes

```text
/
/verify
/verify/:qrvid
/issuer
/issuer/login
/issuer/dashboard
/issuer/records
/issuer/certificates
/issuer/revocations
/issuer/analytics
/issuer/api-keys
/issuer/billing
/issuer/settings
/registry
/registry/:qrvid
/explorer
/docs
/developers
/protocol
/how-it-works
/use-cases
/pricing
/status
/network
/security
/about
/contact
/terms
/privacy
```

## Service Boundary

The platform node must never write directly to PostgreSQL. All issuance, registry, verification, revocation, audit, analytics, billing-entitlement, and integration operations are performed through `api.qrv.network`.

## Verification Flow

```text
QR scan
→ https://qrv.network/verify/{qrvid}
→ GET https://api.qrv.network/api/v1/verify/{qrvid}
→ PostgreSQL registry lookup
→ deterministic verification result
→ public QR-V result page
```

## Issuer Flow

```text
qrv.network/issuer
→ authenticated issuer workflow
→ api.qrv.network
→ PostgreSQL registry
→ QRVID + hash/signature + audit event
→ qrv.network/verify/{qrvid}
```

## Environment

```env
NODE_ENV=production
PORT=3000
SERVICE_NAME=qrv-platform
SERVICE_VERSION=2.1.0
QRV_PUBLIC_BASE_URL=https://qrv.network
QRV_API_BASE_URL=https://api.qrv.network/api/v1
DEMO_QRVID=QRV-PROD-CERT-000001
QRV_API_TIMEOUT_MS=7000
QRV_WRITE_API_KEY=<server-side API key>
QRV_ISSUER_ID=<issuer id>
QRV_ISSUER_NAME=<issuer display name>
ISSUER_PORTAL_USERNAME=<issuer administrator username>
ISSUER_PORTAL_PASSWORD_SCRYPT=<salt:derived hex>
ISSUER_SESSION_SECRET=<minimum 32-character secret>
ISSUER_SESSION_TTL_SECONDS=28800
```

Issuer secrets remain server-side. Login is disabled and readiness returns 503 until the complete issuer configuration is present. Sessions use signed, HTTP-only, same-site cookies; mutations require a session-bound CSRF token; API calls have a bounded timeout.

## Hostinger

```text
Repository: ohi-stack/qrv-node
Branch: main after consolidation PR is approved
Framework: Express
Entry file: server.js
Node: 20+
Start: npm start
```

## Production Rule

Do not create new public QR-V subdomains for ordinary product surfaces. Add browser features as `qrv.network/<route>` unless a separate network origin is required for a concrete security, protocol, scaling, or compliance reason.
