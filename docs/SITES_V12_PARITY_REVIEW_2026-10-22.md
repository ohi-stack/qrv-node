# QR-V Sites v12 ↔ qrv-node source/visual parity review

**Review date:** 2026-10-22  
**Source:** `ohi-stack/qrv-marketing-site@b0660af958a1a3ba3be0df036e671a25ed4d5647` imported in this PR.  
**Destination:** `ohi-stack/qrv-node/src/web`.  
**Relevant PR:** #59.  
**Disposition:** **SOURCE-LEVEL COMPARISON COMPLETE; RENDERED v12 VISUAL PARITY NOT VERIFIED.**

## Evidence limit

The source GitHub manifest records Sites **version 12**, version ID `appgprj_6a6bc4a21f848191913b5d346d0ae466~appgver_e0e2264f7fe8819191d116965e67a985`, and nominal editor source commit `b551e69d9a797d18376315a8353e7521c07b175f`. The latter is **not a repository commit accessible within the available source repository**. The available GitHub snapshot contains `src/App.jsx` and `src/styles.css` but provides no independently verified v12 editor export or reference screenshot. The destination site's active manifest records **version 11**; its `upstreamSourceEvidence` preserves the version-12 reference without falsely claiming rendered parity.

A repository manifest version is not proof of matching screenshots, responsive behavior, or live delivery.

## Source-level comparison

| Area | Archived site source | Active qrv-node web source | Assessment |
|---|---|---|---|
| Brand and hero | QR-V brand, QR verification hero | QR-V official SVG treatment, large verification hero, darker grid | Same intended identity; pixel parity unknown |
| Primary navigation | Six section anchors including protocol, how, use cases, pricing, developers, security | Six mega-menu groups, responsive navigation, direct canonical routes | Target is materially richer; exact v12 header unverified |
| Responsive behavior | One CSS breakpoint at 900px | Breakpoints at 1120, 760, 480px plus reduced-motion rules | Target has stronger responsiveness, device testing pending |
| Colors | Cyan #55c7ff, green #22c55e, gold #f2d06b | Cyan #2dd7ea, green #43eca7, navy grid tokens | Color values differ; do not assume exact v12 parity |
| Verification CTA | Present | Present, with form and fail-closed live record treatment | Source contract represented; live lifecycle separately gated |
| Issuer CTA | Present | Present, issuer preview explicitly marked illustrative | Source contract represented; auth production not asserted |
| Product/use cases | Certificates, membership, products, docs, assets, developer integrations | Certificates, IDs, documents, products, property/assets, event credentials | Core use cases represented |
| API and security | Source lists trust/service roles | Target contains API-backed record card, sign-in and verification states | Implementation beyond source; not equivalent to acceptance |
| Analytics/activity | No comparable chart/history modules | LiveActivityGraph and RecentVerificationHistory present | Added functionality, not proof of real production events |
| Reduced motion | No explicit reduced-motion rule found | Reduced-motion CSS present | Improved accessibility, browser verification pending |
| Source provenance | v12 metadata and source repo history | Metadata and full 30-file archive with hash check | Archived source integrity proven |

## Sitemap and information architecture finding

The source GitHub `public/sitemap.xml` contains 17 URLs. The active Vite `src/web/public/sitemap.xml` contains 19 URLs, with overlapping content but different sets.

Source-only URL families include `/how-it-works`, `/use-cases`, `/contact`, `/terms`, and `/privacy`. Active-Vite-only families include `/products`, `/solutions`, `/enterprise`, `/resources`, `/company`, `/support`, and `/legal`. The top-level `public/sitemap.xml` retains several of the older paths.

**Action required:** reconcile the SEO publication surface against `config/routes.manifest.json` and real canonical HTTP 200 content before changing sitemaps. Do not put placeholder or private pages into a production sitemap. This difference is not evidence of a visual regression, but it is a pending content/SEO parity issue.

## Rendered parity gate — NOT COMPLETE

To mark true version-12 visual parity, compare the exact exported v12 editor revision or screenshots to an independently rendered exact-head `qrv-node` build at:

- Desktop 1440×900 (header, mega-menus, hero, cards, footers, CTAs)
- Tablet 768×1024 (navigation switching and grid layout)
- Mobile 390×844 and 320×568 (no horizontal overflow, working menu and dialogs)
- Reduced-motion and 200% zoom
- Verification states VERIFIED / REVOKED / EXPIRED / NOT_FOUND / API UNAVAILABLE, including no falsely verified status
- SEO title, canonical, robots, manifest and published sitemap

Capture side-by-side reference and target screenshots, revision identifiers, viewport sizes, differences, and final approver. **These rendered comparisons have not been performed from the unavailable v12 editor artifact.**

## Merge criteria

1. Exact-head Firebase/Firestore dependency audit and tree test pass without `npm audit fix --force`.
2. Exact-head platform CI, readiness and multi-builder checks pass.
3. v12 reference export and desktop/mobile screenshot parity evidence are attached, or product owner explicitly accepts documented visual differences in a controlled change request.
4. Live release still requires independent API JSON, real persisted record lifecycle, authorization, signing/revocation and rollback proof.

**Current review decision: NO VISUAL PARITY SIGN-OFF / KEEP PR #59 DRAFT.**
