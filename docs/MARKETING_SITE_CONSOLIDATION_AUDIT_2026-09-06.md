# QR-V™ Marketing-Site → qrv-node Consolidation Audit

**Audit date:** 2026-09-06  
**Source repository:** `ohi-stack/qrv-marketing-site`  
**Source main:** `78d3cab2b62165e83011074c72906a94039171c3`  
**Destination repository:** `ohi-stack/qrv-node`  
**Destination main:** `54b2d110dd9c46663257d3132c2b47a6ddb182ac`  
**Migration branch:** `audit/marketing-site-consolidation-2026-09-06`

## 1. Decision

`qrv-node` is the canonical production repository for `qrv.network`.

`qrv-marketing-site` remains an active consolidation source until every material public-content, SEO, visual, build-policy, and provenance asset has been classified and either migrated, translated, replaced with verified equivalence, or deliberately archived.

This audit does **not** authorize replacing the current `qrv-node` production server, verification logic, CI, security controls, acceptance tests, issuer workflows, or deployment contract with the marketing repository implementation.

## 2. Runtime rule

The production topology remains:

```text
qrv.network      = public platform / human workflows
api.qrv.network  = trusted API / registry / data authority
```

The consolidation is a source/content migration into the canonical public-platform repository. It is not an environment or topology change.

## 3. Current repository comparison

### Source-only material confirmed in `qrv-marketing-site`

The following paths are present in the marketing repository and absent at the same paths in current `qrv-node/main`:

```text
COMMERCIALIZATION_BASELINE.md
CONTENT_STRATEGY.md

env.example
index.html
vite.config.js

src/App.jsx
src/config.js
src/main.jsx
src/styles.css

public/robots.txt
public/site.webmanifest
public/sitemap.xml

robots.txt
sitemap.xml

scripts/build.mjs
scripts/check.mjs
scripts/source-only-start.mjs
scripts/verify-sites-source.mjs

docs/deployment-hostinger.md
docs/environment.md
docs/pages.md

sites/qrv-global-verification/README.md
sites/qrv-global-verification/site.manifest.json
```

### Production-only material confirmed in `qrv-node`

The destination repository currently owns production controls that must be preserved:

```text
.github/workflows/live-production-acceptance.yml
.github/workflows/production-ci.yml
.github/workflows/production-readiness.yml

PRODUCTION_COMMAND.md
LICENSE

config/site.manifest.json

docs/CANONICAL_DELIVERY.md
docs/FOUNDING_ISSUER_PILOT_PROGRAM.md
docs/HOSTINGER_DEPLOYMENT.md
docs/PAGES.md
docs/PRODUCTION_ACCEPTANCE_2026-09-05.md
docs/PRODUCTION_CONTENT_MAP.md

scripts/live-acceptance.mjs
src/verification.js
```

## 4. Migration classification

| Marketing-site asset | Classification | Destination / treatment | Reason |
|---|---|---|---|
| `COMMERCIALIZATION_BASELINE.md` | **MIGRATE** | `docs/marketing/COMMERCIALIZATION_BASELINE.md` | Defines the current certificate-pilot conversion path and claim discipline. |
| `CONTENT_STRATEGY.md` | **MIGRATE + RECONCILE** | `docs/marketing/CONTENT_STRATEGY.md` | Valuable content hierarchy and UX direction; its old statement that marketing-site is the public source of truth must be superseded by this audit. |
| `sites/qrv-global-verification/site.manifest.json` | **PRESERVE AS PROVENANCE** | `docs/provenance/qrv-marketing-site/site.manifest.json` | Records ChatGPT Sites origin, required UI elements, route intent, and historic source boundaries. Preserve verbatim; do not use it as runtime authority. |
| `sites/qrv-global-verification/README.md` | **PRESERVE AS PROVENANCE** | `docs/provenance/qrv-marketing-site/README.md` | Historical site-source and synchronization record. |
| `src/App.jsx` | **PORT, DO NOT COPY AS RUNTIME** | Translate reusable sections/content into canonical `qrv-node` platform pages | Contains useful customer messaging, use cases, pricing presentation, live-demo CTA, and service cards, but assumes a React/Vite runtime and legacy service URLs. |
| `src/styles.css` | **PORT SELECTIVELY** | Translate visual tokens/layout patterns into canonical platform CSS/rendering | Useful visual system; must not introduce a second production runtime merely for styling parity. |
| `src/config.js` | **RECONCILE** | Map applicable values into `qrv-node` configuration | Likely contains old subdomain assumptions; canonical runtime is now `qrv.network` + `api.qrv.network`. |
| `src/main.jsx` | **ARCHIVE/REFERENCE** | No direct runtime migration unless a deliberate frontend compilation architecture is adopted | Vite bootstrap is not required by current Express platform. |
| `index.html` | **ARCHIVE/REFERENCE** | Do not replace Express platform shell directly | Vite entry document is implementation-specific. |
| `vite.config.js` | **ARCHIVE/REFERENCE** | No production use unless explicitly adopting a compiled frontend build | Avoid introducing an unnecessary second runtime/build system during cutover. |
| `public/robots.txt` + root `robots.txt` | **PORT** | Serve canonical `/robots.txt` from `qrv-node` | SEO asset is valuable; duplicate source paths should collapse to one canonical runtime response. |
| `public/sitemap.xml` + root `sitemap.xml` | **PORT + REBUILD** | Generate/serve canonical `/sitemap.xml` from current route manifest | Existing sitemap can contain historical/legacy routes; destination manifest must control final URLs. |
| `public/site.webmanifest` | **PORT** | Canonical platform web manifest | Preserve branding/PWA metadata after route and icon review. |
| `scripts/build.mjs` | **REVIEW/REPLACE** | Keep destination production build/validation as authority | Source script is Vite-oriented and must not weaken destination CI. |
| `scripts/check.mjs` | **PORT ASSERTIONS** | Merge useful content/SEO/source assertions into destination validation | Preserve high-value checks without replacing stronger production gates. |
| `scripts/source-only-start.mjs` | **PRESERVE POLICY, NOT RUNTIME** | Document source-only guard if still relevant | The policy can remain useful; runtime implementation may not be needed after consolidation. |
| `scripts/verify-sites-source.mjs` | **REWRITE FOR NEW AUTHORITY** | New provenance/source audit check under `qrv-node` | Current script hard-codes `qrv-marketing-site` as destination/public source and therefore becomes invalid after consolidation. |
| `docs/deployment-hostinger.md` | **RECONCILE** | Fold unique notes into `docs/HOSTINGER_DEPLOYMENT.md` | Destination deployment runbook remains authoritative. |
| `docs/environment.md` | **RECONCILE** | Fold unique public-platform env notes into canonical env docs | Do not reintroduce legacy multi-service environment contracts. |
| `docs/pages.md` | **RECONCILE** | Compare against `docs/PAGES.md` + `PRODUCTION_CONTENT_MAP.md` | Preserve unique page/content requirements only. |
| `env.example` | **ARCHIVE/REFERENCE** | Do not add a second env template | Destination `.env.example` is canonical. |
| `.env.example` | **COMPARE/RECONCILE** | Destination `.env.example` remains authoritative | Merge only genuinely missing, currently supported values. |
| `README.md` | **COMPARE/RECONCILE** | Destination README remains authoritative | Preserve unique commercialization/source-history material only. |
| `package.json` | **DO NOT REPLACE** | Destination package is canonical | Marketing package describes a different Vite/React implementation. |
| `server.js` | **DO NOT REPLACE** | Destination production server is canonical | Destination server contains broader platform/verification production behavior. |

## 5. Content migration requirements

The following material from `src/App.jsx` must be checked against current destination pages and ported where it is stronger or missing:

- outcome-first hero positioning;
- live demo CTA and `QRV-PROD-CERT-000001` proof path;
- protocol-first / registry-backed / public-trust cards;
- Issue → Anchor → Scan → Verify explanation;
- certificates, memberships, product authentication, documents, assets, and developer integration use cases;
- Verified Certificates commercial wedge;
- issuer onboarding CTA;
- security and deterministic-state explanations;
- enterprise service-boundary presentation.

**Mandatory correction during port:** legacy direct service links must not become canonical runtime URLs. Browser-facing routes belong under `qrv.network`; `api.qrv.network` remains the trusted backend.

## 6. SEO migration requirements

Before marketing-site retirement, `qrv-node` must provide and validate:

```text
/robots.txt
/sitemap.xml
/site.webmanifest
```

The sitemap must be generated from or checked against the canonical destination route manifest. Health, readiness, private issuer/admin routes, and compatibility-only legacy origins must not be treated as primary indexable marketing URLs.

## 7. Provenance requirements

The original Sites manifest explicitly records `sourceType: ChatGPT Sites`, project slug `qrv-global-verification`, required visual elements, canonical route intent, and the historical split between public-site source, platform runtime, and API/registry.

That record must be preserved verbatim as provenance. A new canonical manifest may supersede its runtime-boundary fields, but the historical file must not be silently rewritten.

## 8. Migration phases

### Phase A — Audit and preservation

- [x] Capture exact source and destination main SHAs.
- [x] Compare full recursive trees.
- [x] Classify material unique source assets.
- [x] Establish dedicated migration branch.
- [ ] Preserve marketing/commercial source documents in destination.
- [ ] Preserve Sites provenance files in destination.

### Phase B — Content and visual convergence

- [ ] Diff `src/App.jsx` content against canonical platform pages.
- [ ] Port missing/stronger customer-facing content.
- [ ] Port visual system without replacing production verification behavior.
- [ ] Verify desktop/mobile parity and accessibility.

### Phase C — SEO and public metadata

- [ ] Implement canonical robots response.
- [ ] Implement canonical sitemap response.
- [ ] Add/reconcile web manifest.
- [ ] Add SEO validation to production CI/checks.

### Phase D — Documentation and build-policy convergence

- [ ] Reconcile Hostinger deployment docs.
- [ ] Reconcile environment docs.
- [ ] Reconcile page inventories.
- [ ] Rewrite Sites/source validation around `qrv-node` as canonical destination.
- [ ] Ensure destination CI/acceptance remains authoritative.

### Phase E — Retirement gate

- [ ] Re-run recursive tree/content audit.
- [ ] Confirm no material production/content/SEO/provenance asset remains unique and required in marketing-site.
- [ ] Pass destination build/CI/security/acceptance.
- [ ] Verify live `qrv.network` content, SEO metadata, verification workflow, and issuer workflow.
- [ ] Mark `qrv-marketing-site` read-only/archive/reference only.

## 9. Hard non-regression rules

The migration must not:

1. replace the canonical production `qrv-node/server.js` wholesale;
2. remove `src/verification.js` or weaken deterministic/fail-closed verification;
3. remove or bypass production CI/readiness/live acceptance workflows;
4. restore legacy service subdomains as independent canonical browser applications;
5. expose API keys, database credentials, signing secrets, or other trusted-backend configuration;
6. present demo/sample status as proof of live production readiness;
7. introduce Vite/React as a second runtime without an explicit architecture decision and production acceptance plan.

## 10. Definition of Done

The consolidation is complete only when:

```text
all material marketing assets classified
→ all KEEP/MIGRATE assets present in qrv-node
→ all PORT assets translated with verified parity
→ SEO endpoints served and validated
→ Sites provenance preserved
→ canonical route/content manifests agree
→ qrv-node production CI remains green
→ qrv-node live acceptance remains green
→ no required material remains uniquely dependent on qrv-marketing-site
```

Until then:

```text
qrv-marketing-site = ACTIVE CONSOLIDATION SOURCE
qrv-node           = CANONICAL PRODUCTION TARGET
```
