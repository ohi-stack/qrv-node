# QR-V™ Global Verification Network — Full Production Sitemap

**Baseline:** 2026-09-18  
**Canonical human-facing platform:** `https://qrv.network`  
**Canonical trusted API/data plane:** `https://api.qrv.network`  
**Protocol:** QRVP-1  
**Verification standard:** QVS-1.0

## Architecture rule

`qrv.network` is the canonical human/customer/issuer/developer platform. `api.qrv.network` is the only separately operated machine-oriented trust/data boundary. Legacy QR-V subdomains are compatibility redirects or branded entry points, not competing applications.

```text
qrv.network
    │
    └── api.qrv.network/api/v1
            │
            └── PostgreSQL canonical registry
```

New QR-V codes encode:

```text
https://qrv.network/verify/{QRVID}
```

## Main navigation

The public header remains conversion-focused:

```text
Products · Solutions · Developers · Documentation · Pricing · About
```

Primary actions:

```text
Verify Record · Issuer Login · Get Started
```

The complete sitemap belongs in mega menus, contextual navigation, dashboards, documentation, and footer navigation—not directly in the header.

## Full public route tree

### `/about`

```text
/about
/about/what-is-qr-v
/about/how-it-works
/about/network-architecture
/about/trust-model
/about/security
/about/standards
/about/contact
```

### `/verify`

```text
/verify
/verify/{qrvid}
/verify/scan
/verify/manual
/verify/verification-states
/verify/how-verification-works
/verify/help
```

### `/registry`

```text
/registry
/registry/search
/registry/{qrvid}
/registry/issuers
/registry/issuers/{issuerId}
/registry/record-types
/registry/status
/registry/about
```

### `/issuer`

```text
/issuer
/issuer/login
/issuer/register
/issuer/onboarding
/issuer/dashboard
/issuer/records
/issuer/records/new
/issuer/records/{qrvid}
/issuer/records/{qrvid}/edit
/issuer/records/{qrvid}/qr
/issuer/records/{qrvid}/certificate
/issuer/records/{qrvid}/history
/issuer/records/{qrvid}/revoke
/issuer/certificates
/issuer/certificates/new
/issuer/certificates/templates
/issuer/certificates/bulk
/issuer/certificates/import
/issuer/contact-cards
/issuer/contact-cards/new
/issuer/contact-cards/{qrvid}
/issuer/contact-cards/bulk
/issuer/analytics
/issuer/audit-log
/issuer/team
/issuer/api-keys
/issuer/webhooks
/issuer/integrations
/issuer/billing
/issuer/subscription
/issuer/settings
/issuer/security
/issuer/support
```

### `/products`

```text
/products
/products/certificate-verification
/products/document-verification
/products/identity-verification
/products/membership-verification
/products/product-authentication
/products/asset-registration
/products/property-records
/products/financial-records
/products/verified-contact-card
/products/api
/products/enterprise
/products/white-label
```

### `/solutions`

```text
/solutions
/solutions/education
/solutions/government
/solutions/business
/solutions/identity
/solutions/membership
/solutions/certificates
/solutions/documents
/solutions/products
/solutions/property
/solutions/financial-records
/solutions/assets
/solutions/agents
```

### `/developers`

```text
/developers
/developers/get-started
/developers/quickstart
/developers/authentication
/developers/api-keys
/developers/verification
/developers/issuance
/developers/revocation
/developers/registry
/developers/webhooks
/developers/errors
/developers/rate-limits
/developers/security
/developers/sdks
/developers/sdks/javascript
/developers/sdks/typescript
/developers/sdks/node
/developers/sdks/rest
/developers/agents
/developers/agents/overview
/developers/agents/verification
/developers/agents/examples
/developers/agents/security
/developers/examples
/developers/examples/verify
/developers/examples/issue
/developers/examples/revoke
/developers/examples/webhooks
```

### `/docs`

```text
/docs
/docs/overview
/docs/overview/what-is-qr-v
/docs/overview/core-concepts
/docs/overview/product-scope
/docs/overview/architecture
/docs/protocol
/docs/protocol/qr-vp-1
/docs/protocol/identifiers
/docs/protocol/records
/docs/protocol/resolution
/docs/protocol/hashing
/docs/protocol/signatures
/docs/protocol/revocation
/docs/verification
/docs/verification/qvs-1
/docs/verification/workflow
/docs/verification/states
/docs/verification/integrity
/docs/verification/fail-closed
/docs/registry
/docs/registry/architecture
/docs/registry/records
/docs/registry/issuers
/docs/registry/lifecycle
/docs/registry/audit
/docs/issuers
/docs/issuers/getting-started
/docs/issuers/onboarding
/docs/issuers/issuance
/docs/issuers/revocation
/docs/issuers/key-management
/docs/issuers/security
/docs/developers
/docs/api-reference
/docs/deployment
/docs/examples
/docs/changelog
```

### `/protocol`

```text
/protocol
/protocol/qr-vp-1
/protocol/qvs-1
/protocol/identifier-specification
/protocol/verification-model
/protocol/cryptography
/protocol/issuer-model
/protocol/registry-model
/protocol/lifecycle
/protocol/versioning
```

### `/security`

```text
/security
/security/overview
/security/cryptography
/security/ed25519
/security/sha-256
/security/key-management
/security/privacy
/security/responsible-disclosure
/security/report
```

### `/enterprise`

```text
/enterprise
/enterprise/api
/enterprise/integrations
/enterprise/white-label
/enterprise/bulk-issuance
/enterprise/security
/enterprise/support
/enterprise/contact
```

### `/pricing`

```text
/pricing
/pricing/issuer
/pricing/api
/pricing/enterprise
/pricing/white-label
```

### `/resources`

```text
/resources
/resources/guides
/resources/tutorials
/resources/examples
/resources/use-cases
/resources/faq
/resources/downloads
/resources/support
```

### `/network`

```text
/network
/network/architecture
/network/nodes
/network/status
/network/version
/network/changelog
```

### `/status`

```text
/status
/status/platform
/status/api
/status/verification
/status/incidents
```

### `/company`

```text
/company
/company/about
/company/contact
/company/partners
/company/news
```

### `/support`

```text
/support
/support/issuer
/support/developer
/support/verification
/support/report-record
/support/contact
```

### `/legal`

```text
/legal
/legal/terms
/legal/privacy
/legal/cookies
/legal/acceptable-use
/legal/api-terms
/legal/issuer-agreement
/legal/security
/legal/disclosures
```

## API sitemap

`api.qrv.network` must not become a second website. It remains the trusted machine/data boundary.

```text
https://api.qrv.network
/
├── /healthz
├── /readyz
├── /version
├── /metrics
└── /api/v1
    ├── /status
    ├── GET /verify/{qrvid}
    ├── GET /registry/{qrvid}
    ├── GET /issuers
    ├── GET /issuers/{issuerId}
    ├── POST /certificates
    ├── GET /certificates/{qrvid}
    ├── PATCH /certificates/{qrvid}
    ├── POST /certificates/{qrvid}/revoke
    ├── POST /contact-cards
    ├── GET /contact-cards/{qrvid}
    ├── PATCH /contact-cards/{qrvid}
    ├── POST /contact-cards/bulk
    ├── GET /contact-cards/{qrvid}/vcard
    ├── /analytics
    ├── /audit
    ├── /webhooks
    └── /keys
```

This API tree is architectural intent. The normative exact API contract must come from the OpenAPI specification. Do not maintain a conflicting hand-written API specification.

## Subdomain consolidation

| Host | Production role |
|---|---|
| `qrv.network` | Canonical human-facing platform |
| `api.qrv.network` | Canonical API/data authority |
| `verify.qrv.network` | Redirect → `qrv.network/verify` |
| `registry.qrv.network` | Redirect → `qrv.network/registry` |
| `issuer.qrv.network` | Redirect → `qrv.network/issuer` |
| `docs.qrv.network` | Redirect → `qrv.network/docs` |
| `developers.qrv.network` | Redirect → `qrv.network/developers` |
| `explorer.qrv.network` | Redirect → `qrv.network/registry` |

Redirects execute before SPA/static handling so legacy hosts cannot become competing origins.

## Production priority

### Tier 1 — release-blocking workflow surfaces

```text
/
/verify
/verify/{qrvid}
/issuer
/issuer/onboarding
/issuer/dashboard
/issuer/records
/registry
/developers
/docs
/products
/pricing
/security
/status
/support
/legal
```

### Tier 2 — complete commercial and developer surface

Complete product, solution, developer, protocol, issuer-management, analytics, API-key, webhook, integration, billing, subscription, and enterprise surfaces.

### Tier 3 — deeper educational/resource material

Deeper guides, tutorials, examples, downloads, network/company content, historical material, and changelogs.

## Readiness/versioning rule

A defined route is not automatically an operational product capability.

A capability may be represented as production only when it is:

```text
implemented
+ integrated
+ documented
+ tested
+ repeatable
```

Route lifecycle:

```text
scaffolded → integrated → tested → production
```

This rule prevents QR-V from accumulating attractive but nonfunctional pages and protects the distinction between architecture and production capability.

## Machine-readable source of truth

`config/routes.manifest.json` is the canonical machine-readable route/tier contract for the public platform. OpenAPI is the normative source of truth for the API endpoint contract.

Validation:

```bash
npm run check:sitemap
npm run validate:prod
```
