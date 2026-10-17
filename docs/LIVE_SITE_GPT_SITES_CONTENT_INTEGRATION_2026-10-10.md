# QR-V™ Live-Site Content and GPT Sites Integration Contract
Date: 2026-10-10
Status: implementation source; not production acceptance evidence

## Source authority
Canonical live-site repository: ohi-stack/qrv-node (React/Vite frontend in src/web, Express route owner).
Source/reference: ohi-stack/qrv-marketing-site and GPT Sites development assets, preserving provenance.
Trusted API: ohi-stack/qrv-api, deployed at api.qrv.network.
Do not replace Express server.js, auth/session code, route ownership, or production config with marketing-site copies. Merge source content and styles semantically; verify asset licensing and provenance.

## Public positioning
QR-V™ is registry-backed verification infrastructure built around QRVP-1 and QVS-1.0, not merely a QR-code generator.
Primary proposition: a QR code provides an entry point; an authoritative registry record determines issuer, integrity, disclosure, and lifecycle state.
Avoid “fraud-proof”, “government certified”, “legally binding”, “fully operational” and unsupported adoption/valuation claims.
Use clear labels for live, planned, pilot and documentation-only functionality.

## Canonical navigation
Products, Solutions, Developers, Documentation, Pricing, About.
Primary actions: Verify Record, Issuer Login, Get Started.
Wallet is a first-class holder destination, distinct from issuer privileges.
Accessible mobile navigation, semantic headings, contrast, keyboard support and consistent page metadata.

## Page content matrix
| Route | Message / functionality | Primary CTA |
| --- | --- | --- |
| / | QR-V network introduction, explain issuer→registry→verification lifecycle | Verify Record; Become an Issuer |
| /about | Network mission, ONEGODIAN, LLC commercial stewardship, scope and limitations | How It Works |
| /how-it-works | Scan/QRVID→resolve→issuer/integrity/status→deterministic result | Verify Record |
| /products | Certificates first; memberships, documents, products, assets, property, identity and financial records described with accurate release labels | Explore Certificates |
| /products/certificate-verification | Issuance, canonical record, QR link, revocation and third-party verification | Apply as Issuer |
| /solutions | Education, business, membership, product and enterprise use cases; avoid implying official authority | Request Demo |
| /verify | Manual QRVID lookup and QR scanning; no simulated VERIFIED status | Verify |
| /verify/:qrvid | Only API-authoritative status; fail closed on unavailable/invalid states | Verify Again |
| /registry | Public permitted registry records and issuer information only | Search Registry |
| /issuer | Issuer Portal explanation and onboarding; distinguish active from gated functions | Issuer Login |
| /issuer/dashboard | Real authenticated issuer records and lifecycle operations | Issue Record |
| /wallet | Holder receives, stores permitted references, shares and re-verifies | Open Wallet |
| /wallet/records/:qrvid | Recheck current state, share canonical URL; removing wallet reference never revokes record | Verify Again |
| /developers | REST/OpenAPI, SDKs, service accounts and agent fail-closed verification semantics | View API |
| /docs | QRVP-1, QVS-1.0, architecture, registry, issuer, security, deployment | Read Standard |
| /protocol | Protocol responsibilities and identifier/resolution model | Read QRVP-1 |
| /standards | QVS-1.0 status semantics and evidence discipline | Read QVS-1.0 |
| /security | SHA-256, Ed25519 key lifecycle requirements, privacy, revocation, disclosure, reporting | Security Details |
| /pricing | Only confirmed current plans and checkout links; paid entitlement must be verified before provisioning | Choose Plan |
| /enterprise | Integration, bulk issuance, white-label, custom deployment, proposals | Request Proposal |
| /status | Live readiness only from health/readiness evidence, never static success badges | View Status |
| /support | Verification help, issuer support and reporting | Contact Support |
| /legal | Terms, privacy, acceptable use and issuer responsibilities | Review Terms |

## Content blocks from project discussion
1. Hero: “Verify Before You Trust™” with the explanation “A QR code can tell you where to go. QR-V is designed to help verify the record behind it.”
2. Four verification questions: who issued it, is its integrity valid, what is its current status, what data is permitted for disclosure?
3. Lifecycle: ISSUE → CANONICALIZE → HASH/SIGN → REGISTER → QR → VERIFY → REVOKE → REVERIFY. Treat steps as intended until proven by deployed acceptance evidence.
4. Issuer Portal is the primary paid application; Verified Certificates are the initial commercial product.
5. Wallet is holder-facing; possession is not ownership, and the Wallet is not an independent registry or trust authority.
6. Human and machine integration use the same API-authoritative verification states. Software agents MUST NOT accept unknown, unavailable or non-VERIFIED states as verified.
7. Founding Issuer Pilot Program: ONEGODIAN, LLC and Algonquian Real Estate as internal pilots; first unrelated organization is an external pilot. Do not claim records/customers exist absent evidence.
8. Marketing campaigns: Verify Before You Trust; Make Every Certificate Verifiable; Founding Issuer; Protect the Product; Verification API for Developers; From Issued to Verified.
9. Product taxonomy: certificate, membership, document, product, identity, asset, property, financial records, Verified Contact Card, API and white-label. Label incomplete products.
10. Pricing: do not infer rates from old marketing copies. Reconcile any Stripe product/payment links with live catalog, entitlement implementation, and legal terms before publication.

## GPT Sites reconciliation
- Inspect qrv-marketing-site/src, public, index.html, vite.config, manifest, sitemap, robots and original Sites provenance.
- Compare file hashes and semantic content against qrv-node/src/web, public, docs, config and sites.
- Import only missing or superior public content, layout and accessible assets. Preserve existing Express-owned routes, sessions, API compatibility, health, readiness and version endpoints.
- Ensure the React build is served by qrv-node and no frontend secret leaks via VITE_*.
- Remove hardcoded sample VERIFIED badges, fake metrics, and unsupported “production ready” statements.
- Use canonical internal links at qrv.network; only api.qrv.network is a separate trusted runtime.
- Legacy verify/issuer/registry/wallet/docs/developers/explorer subdomains are compatibility entry points, activated only after destination acceptance.

## Release acceptance
- npm install/build/tests/validate:prod as supported by actual package scripts
- automated route and asset parity checks for public pages
- real API-backed VERIFIED→REVOKED same-record regression
- negative states: EXPIRED, NOT_FOUND, invalid signature/hash, unavailable, privacy restrictions, unauthorized/cross-issuer
- issuer and wallet auth isolation; CSRF/IDOR protection
- mobile/tablet/desktop accessibility and link checks
- canonical metadata, robots, sitemap, 404/503 handling
- API readiness and database/backup restore evidence
- GitHub Actions green, reviewed PR, deployment evidence, rollback plan
- never label the live site production accepted based on content-only work
