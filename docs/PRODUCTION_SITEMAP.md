# QR-V™ Global Verification Network — Production Sitemap

**Baseline:** 2026-09-17  
**Canonical public platform:** https://qrv.network  
**Canonical trusted API/data plane:** https://api.qrv.network

## Architecture rule

qrv.network is the canonical human/customer/issuer/developer platform. api.qrv.network is the only separately operated machine-oriented trust/data boundary. Legacy QR-V subdomains are compatibility redirects, not competing applications.

## Main navigation

Products · Solutions · Developers · Documentation · Pricing · About

Primary actions: Verify Record · Issuer Login · Get Started

## Public route families

- `/`
- `/about/*`: what-is-qr-v, how-it-works, network-architecture, trust-model, security, standards, contact
- `/verify/*`: `/verify/{qrvid}`, scan, manual, verification-states, how-verification-works, help
- `/registry/*`: search, `/{qrvid}`, issuers, `/issuers/{issuerId}`, record-types, status, about
- `/issuer/*`: login, register, onboarding, dashboard, records, certificates, contact-cards, analytics, audit-log, team, api-keys, webhooks, integrations, billing, subscription, settings, security, support
- `/products/*`: certificate-verification, document-verification, identity-verification, membership-verification, product-authentication, asset-registration, property-records, financial-records, verified-contact-card, api, enterprise, white-label
- `/solutions/*`: education, government, business, identity, membership, certificates, documents, products, property, financial-records, assets, agents
- `/developers/*`: get-started, quickstart, authentication, api-keys, verification, issuance, revocation, registry, webhooks, errors, rate-limits, security, SDKs, agents, examples
- `/docs/*`: overview, protocol, verification, registry, issuers, developers, api-reference, deployment, examples, changelog
- `/protocol/*`: qr-vp-1, qvs-1, identifier-specification, verification-model, cryptography, issuer-model, registry-model, lifecycle, versioning
- `/security/*`: overview, cryptography, ed25519, sha-256, key-management, privacy, responsible-disclosure, report
- `/enterprise/*`: api, integrations, white-label, bulk-issuance, security, support, contact
- `/pricing/*`: issuer, api, enterprise, white-label
- `/resources/*`: guides, tutorials, examples, use-cases, faq, downloads, support
- `/network/*`: architecture, nodes, status, version, changelog
- `/status/*`: platform, api, verification, incidents
- `/company/*`: about, contact, partners, news
- `/support/*`: issuer, developer, verification, report-record, contact
- `/legal/*`: terms, privacy, cookies, acceptable-use, api-terms, issuer-agreement, security, disclosures

## Issuer record routes

`/issuer/records/new`  
`/issuer/records/{qrvid}`  
`/issuer/records/{qrvid}/edit`  
`/issuer/records/{qrvid}/qr`  
`/issuer/records/{qrvid}/certificate`  
`/issuer/records/{qrvid}/history`  
`/issuer/records/{qrvid}/revoke`

Certificate routes include new, templates, bulk and import. Contact-card routes include new, `/{qrvid}` and bulk.

## API boundary

api.qrv.network is not a second website. Normative endpoint inventory must be generated from OpenAPI.

Operational endpoints: `/healthz`, `/readyz`, `/version`, `/metrics`.

API v1 capability families: status, verify, registry, issuers, certificates, contact-cards, analytics, audit, webhooks and keys.

## Compatibility redirects

| Host | Canonical destination |
|---|---|
| verify.qrv.network | qrv.network/verify |
| registry.qrv.network | qrv.network/registry |
| issuer.qrv.network | qrv.network/issuer |
| docs.qrv.network | qrv.network/docs |
| developers.qrv.network | qrv.network/developers |
| explorer.qrv.network | qrv.network/registry or /explorer |

## Production tiers

**Tier 1:** /, /verify, /verify/{qrvid}, /issuer, /issuer/onboarding, /issuer/dashboard, /issuer/records, /registry, /developers, /docs, /products, /pricing, /security, /status, /support, /legal.

**Tier 2:** complete product, solution, developer, protocol, issuer-management, analytics, API-key, webhook and enterprise surfaces.

**Tier 3:** deeper guides, tutorials, examples, downloads, educational resources and historical/changelog material.

## Readiness rule

A route may exist before its capability is operational. Product capabilities must only be represented as operational when the workflow is implemented, integrated, documented, tested and repeatable. Route lifecycle: **scaffolded → integrated → tested → production**.

New QR-V codes must encode `https://qrv.network/verify/{QRVID}`.
