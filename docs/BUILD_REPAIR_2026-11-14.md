# QR-V build repair — 14 November 2026

Status: READY_FOR_REVIEW locally; live API remains blocked.
Owner: ONEGODIAN, LLC release operator.
Repository: ohi-stack/qrv-node.
Branch: integration/repair-build-manifest-20261114.
Baseline: 2d45060 (main at inspection).

## Confirmed defect and repair

The baseline package.json contains a missing comma after test:failclosed and duplicate script keys. npm cannot parse it. Consolidate the scripts without dropping either merge contribution: retain skills and imported-source checks, restore fail-closed testing in validate:prod, and include the existing gRPC dependency check. Commit the generated package-lock.json for repeatable installation.

## Local evidence

Node 24.22.1 / npm 11.9.0:
- npm install --ignore-scripts: passed.
- npm run check: passed.
- npm run validate:prod: passed, including Vite production build, compiled assets, routing, fail-closed verification, and gRPC 1.14.6 resolution.
- npm audit --omit=dev --audit-level=high: zero reported vulnerabilities in this resolved production dependency tree.
- Build warning: main JavaScript bundle exceeds 500 kB; not a build failure.

These results do not certify Hostinger's previously reported 89 findings, live deployment, browser/mobile behavior, or registry lifecycle.

## Separate API hosting blocker

The documented public verification URL returns HTML 404 and the API root redirects to a Next.js login. The canonical ohi-stack/qrv-api repository instead contains an Express server with the verification route. Local qrv-api validation passed; healthz returned JSON 200, and readiness/verification correctly returned JSON 503 without a configured database.

The Hostinger operator must inspect api.qrv.network's connected repository, branch, root directory and framework. Expected source is ohi-stack/qrv-api, root directory '.', Node/Express entry server.js, build npm run build, start npm start. Do not configure it as Next.js. Preserve existing secret values and the canonical database; do not seed or migrate records as part of this repair.

After independently reviewing configuration and deploying the approved API revision, require JSON health/version, database-backed readiness, public verification and authorized lifecycle/audit tests. Hostinger access was unavailable in this session. No DNS, deployment or production records were changed.

## Release gate

Review this repair through integration before promotion. Exact-head CI and independent QA remain required. No merge or live production readiness is asserted.
