# QR-V™ Site Source Import — 2026-10-11

## Source and destination

- Available GitHub source: `ohi-stack/qrv-marketing-site@b0660af958a1a3ba3be0df036e671a25ed4d5647`.
- Source tree: `b0660af958a1a3ba3be0df036e671a25ed4d5647` (30 tracked UTF-8 files).
- Site project slug: `qrv-global-verification`.
- Upstream metadata: Sites version **12**, revision `b551e69d9a797d18376315a8353e7521c07b175f`.
- Destination: `ohi-stack/qrv-node`, review branch `sync/qrv-site-source-20261011`.
- Reference snapshot: `sites/imports/qrv-marketing-site/`.
- Integrity inventory: `sites/imports/qrv-marketing-site/SOURCE_IMPORT_MANIFEST.json`.

## What was copied

All 30 files in the source GitHub repository's tracked tree, preserving relative paths and recording their original Git blob SHA-1 hashes. This includes the previous site React/Vite implementation, components, styles, static/SEO assets, pages/content strategy, commercialization baseline, Sites provenance/manifest, source preview runtime, configuration examples and check/build scripts.

**Important:** This is a source import, NOT a replacement deployment. Original former-runtime `server.js`, `package.json`, `vite.config.js`, `.env.example` and scripts are retained only under the reference-only archive. They must never be executed or configured as an independent `qrv.network` application.

## Canonical runtime remains intact

```text
qrv.network                → ohi-stack/qrv-node: Express + React/Vite src/web
api.qrv.network/api/v1      → ohi-stack/qrv-api: PostgreSQL, verification, signing, issuer authority
```

No active `server.js`, `src/web/`, authentication, issuer, QR, verification route, signed record behavior or privileged API integration was replaced. The existing public frontend is more advanced than the older marketing-site code. Do not copy legacy entrypoints into the active application without a reviewed feature-by-feature diff.

## Site-version discrepancy and remaining gap

The existing `qrv-node` Site provenance record identifies **version 11** as the actively converged UI. The source repository's manifest identifies **version 12**. The latter is preserved in `upstreamSourceEvidence` without asserting that the compiled runtime already implements every version-12 Sites-editor change.

The current GitHub connection does not provide a direct latest version-12 editor export. An independent UI export/visual comparison is still needed before declaring full parity with the live Sites editor.

## Verification

Run:

```bash
npm run check:site-import
npm run validate:prod
npm audit --omit=dev --audit-level=high
```

The source integrity script checks every archived file's byte length and Git blob hash against `SOURCE_IMPORT_MANIFEST.json`.

Before merging/deploying, also verify exact-head GitHub CI, mobile/desktop parity, public SEO/robot/sitemap coverage, and the live authenticated real-record issue → PostgreSQL → QR → VERIFIED → revoke → REVOKED → audit lifecycle. `qrv-node` production acceptance last recorded failure on 2026-10-11, including API-host HTML responses rather than expected JSON; this source import does not remediate that blocker.

Do not archive or retire `qrv-marketing-site` until all source, visual, production and compatibility evidence is accepted.
