# QR-V™ Full Production Sitemap

**Status:** Authoritative production information architecture  
**Effective:** 2026-09-17  
**Runtime model:** `qrv.network` + `api.qrv.network`

## Architecture rule

`qrv.network` is the canonical human-facing platform. `api.qrv.network` is the only separately operated trusted API/data-plane hostname. Legacy QR-V subdomains are branded entry points and HTTP 308 compatibility redirects, not independent applications.

New QR-V codes MUST resolve to:

```text
https://qrv.network/verify/{QRVID}
```

## Public header

Primary navigation:

```text
Products · Solutions · Developers · Documentation · Pricing · About
```

Prominent actions:

```text
Verify Record · Issuer Login · Get Started
```

Do not expose the full sitemap in the primary header. Use mega menus, contextual navigation, dashboards, and the footer.

## Canonical route families

### /
- /

### /about
- /about/what-is-qr-v
- /about/how-it-works
- /about/network-architecture
- /about/trust-model
- /about/security
- /about/standards
- /about/contact

### /verify
- /verify/{qrvid}
- /verify/scan
- /verify/manual
- /verify/verification-states
- /verify/how-verification-works
- /verify/help

### /registry
- /registry/search
- /registry/{qrvid}
- /registry/issuers
- /registry/issuers/{issuerId}
- /registry/record-types
- /registry/status
- /registry/about

### /issuer
- /issuer/login
- /issuer/register
- /issuer/onboarding
- /issuer/dashboard
- /issuer/records
- /issuer/records/new
- /issuer/records/{qrvid}
- /issuer/records/{qrvid}/edit
- /issuer/records/{qrvid}/qr
- /issuer/records/{qrvid}/certificate
- /issuer/records/{qrvid}/history
- /issuer/records/{qrvid}/revoke
- /issuer/certificates
- /issuer/certificates/new
- /issuer/certificates/templates
- /issuer/certificates/bulk
- /issuer/certificates/import
- /issuer/contact-cards
- /issuer/contact-cards/new
- /issuer/contact-cards/{qrvid}
- /issuer/contact-cards/bulk
- /issuer/analytics
- /issuer/audit-log
- /issuer/team
- /issuer/api-keys
- /issuer/webhooks
- /issuer/integrations
- /issuer/billing
- /issuer/subscription
- /issuer/settings
- /issuer/security
- /issuer/support

### /products
- /products/certificate-verification
- /products/document-verification
- /products/identity-verification
- /products/membership-verification
- /products/product-authentication
- /products/asset-registration
- /products/property-records
- /products/financial-records
- /products/verified-contact-card
- /products/api
- /products/enterprise
- /products/white-label

### /solutions
- /solutions/education
- /solutions/government
- /solutions/business
- /solutions/identity
- /solutions/membership
- /solutions/certificates
- /solutions/documents
- /solutions/products
- /solutions/property
- /solutions/financial-records
- /solutions/assets
- /solutions/agents

### /developers
- /developers/get-started
- /developers/quickstart
- /developers/authentication
- /developers/api-keys
- /developers/verification
- /developers/issuance
- /developers/revocation
- /developers/registry
- /developers/webhooks
- /developers/errors
- /developers/rate-limits
- /developers/security
- /developers/sdks/javascript
- /developers/sdks/typescript
- /developers/sdks/node
- /developers/sdks/rest
- /developers/agents/overview
- /developers/agents/verification
- /developers/agents/examples
- /developers/agents/security
- /developers/examples/verify
- /developers/examples/issue
- /developers/examples/revoke
- /developers/examples/webhooks

### /docs
- /docs/overview
- /docs/overview/what-is-qr-v
- /docs/overview/core-concepts
- /docs/overview/product-scope
- /docs/overview/architecture
- /docs/protocol
- /docs/protocol/qr-vp-1
- /docs/protocol/identifiers
- /docs/protocol/records
- /docs/protocol/resolution
- /docs/protocol/hashing
- /docs/protocol/signatures
- /docs/protocol/revocation
- /docs/verification
- /docs/verification/qvs-1
- /docs/verification/workflow
- /docs/verification/states
- /docs/verification/integrity
- /docs/verification/fail-closed
- /docs/registry
- /docs/registry/architecture
- /docs/registry/records
- /docs/registry/issuers
- /docs/registry/lifecycle
- /docs/registry/audit
- /docs/issuers
- /docs/issuers/getting-started
- /docs/issuers/onboarding
- /docs/issuers/issuance
- /docs/issuers/revocation
- /docs/issuers/key-management
- /docs/issuers/security
- /docs/developers
- /docs/api-reference
- /docs/deployment
- /docs/examples
- /docs/changelog

### /protocol
- /protocol/qr-vp-1
- /protocol/qvs-1
- /protocol/identifier-specification
- /protocol/verification-model
- /protocol/cryptography
- /protocol/issuer-model
- /protocol/registry-model
- /protocol/lifecycle
- /protocol/versioning

### /security
- /security/overview
- /security/cryptography
- /security/ed25519
- /security/sha-256
- /security/key-management
- /security/privacy
- /security/responsible-disclosure
- /security/report

### /enterprise
- /enterprise/api
- /enterprise/integrations
- /enterprise/white-label
- /enterprise/bulk-issuance
- /enterprise/security
- /enterprise/support
- /enterprise/contact

### /pricing
- /pricing/issuer
- /pricing/api
- /pricing/enterprise
- /pricing/white-label

### /resources
- /resources/guides
- /resources/tutorials
- /resources/examples
- /resources/use-cases
- /resources/faq
- /resources/downloads
- /resources/support

### /network
- /network/architecture
- /network/nodes
- /network/status
- /network/version
- /network/changelog

### /status
- /status/platform
- /status/api
- /status/verification
- /status/incidents

### /company
- /company/about
- /company/contact
- /company/partners
- /company/news

### /support
- /support/issuer
- /support/developer
- /support/verification
- /support/report-record
- /support/contact

### /legal
- /legal/terms
- /legal/privacy
- /legal/cookies
- /legal/acceptable-use
- /legal/api-terms
- /legal/issuer-agreement
- /legal/security
- /legal/disclosures

## API/data-plane rule

The API is machine-oriented. Its exact public contract MUST be generated from the normative OpenAPI specification rather than maintained as a second independent sitemap.

Expected operational roots include:

```text
https://api.qrv.network/
https://api.qrv.network/healthz
https://api.qrv.network/readyz
https://api.qrv.network/version
https://api.qrv.network/metrics
https://api.qrv.network/api/v1/...
```

The generalized QR-V record lifecycle is foundational. Product-specific resources such as certificates and contact cards are typed resources over that lifecycle, not separate verification authorities.

## Compatibility redirects

```text
verify.qrv.network/*      -> 308 qrv.network/verify/*
registry.qrv.network/*    -> 308 qrv.network/registry/*
issuer.qrv.network/*      -> 308 qrv.network/issuer/*
docs.qrv.network/*        -> 308 qrv.network/docs/*
developers.qrv.network/*  -> 308 qrv.network/developers/*
explorer.qrv.network/*    -> 308 qrv.network/explorer/*
```

Redirects MUST preserve paths and query strings where applicable. Existing printed QR codes must continue to resolve.

## Implementation tiers

### Tier 1 — production v1

Functional and acceptance-tested before launch:

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

Tier 1 routes must not be attractive placeholders. Their required workflows must be implemented, documented, tested, and repeatable.

### Tier 2 — operational expansion

Complete product/solution pages, developer tooling, protocol surfaces, issuer certificates/contact cards, analytics, audit log, teams, API keys, webhooks, integrations, billing/subscriptions, and enterprise workflows.

### Tier 3 — depth and education

Guides, tutorials, examples, downloads, deeper resources, educational material, long-tail documentation, and supporting content.

## Production capability rule

A route MUST NOT be represented as an operational QR-V product capability until its workflow is implemented, documented, tested, secure, and repeatable. Unimplemented routes should be omitted from production navigation or clearly marked as documentation/planned capability.

## Release-critical workflow

```text
Discover QR-V
-> Get Started
-> Issuer registration/onboarding
-> Issuer dashboard
-> Create record
-> canonical API persists record
-> QRVID + QR generated
-> qrv.network/verify/{QRVID}
-> VERIFIED
-> revoke or expire
-> same URL returns REVOKED or EXPIRED
-> audit history remains available
```
