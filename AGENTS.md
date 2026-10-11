# QR-V™ Multi-Builder Agent Contract

This repository is the canonical human-facing QR-V™ production platform for `qrv.network`.

## Production architecture

```text
qrv.network                     ohi-stack/qrv-node
    ↓ server-to-server
api.qrv.network/api/v1          ohi-stack/qrv-api
    ↓
canonical QR-V registry
```

The browser application must never become a second registry authority.

## Builder lanes

Use only the assigned non-production branch:

- ChatGPT Sites: `work/chatgpt-sites`
- Google AI Studio: `work/google-ai-studio`
- Integration: `integration/multi-builder`
- Production: `main`

Do not write directly to `main` from a builder workspace.

## ChatGPT Sites primary responsibility

Prefer ChatGPT Sites for:

- customer-facing React/UI work;
- visual design and responsive behavior;
- page composition and navigation;
- product/solution/documentation presentation;
- accessibility and conversion-oriented UX;
- SEO-facing presentation assets.

## Google AI Studio primary responsibility

Prefer Google AI Studio for:

- isolated full-stack experiments;
- Gemini-assisted features;
- server-side integration prototypes;
- workflow and developer-tool prototypes;
- interactive data experiences;
- experiments that benefit from its Node/npm runtime.

Gemini features must remain optional until explicitly promoted through integration and production acceptance.

## Protected runtime boundary

The following routes remain Express/API controlled and must not be silently replaced by an SPA or experimental runtime:

```text
/verify/*
/issuer/*
/registry/*
/api/*
/healthz
/health
/readyz
/version
/metrics
/qr/*
/explorer/*
/status
```

Treat `server.js`, `src/verification.js`, production workflows, and live acceptance scripts as protected runtime files. Changes are permitted only through the integration lane with full validation.

## Security rules

Never commit or expose:

- `DATABASE_URL`;
- database-admin credentials;
- signing private keys;
- unrestricted QR-V API keys;
- production session secrets;
- production issuer access codes;
- webhook secrets;
- Stripe secrets;
- Gemini API keys.

AI Studio secrets belong in its server-side secret store during experimentation. Production secrets belong only in the approved production runtime.

## Protocol rules

Preserve QRVP-1 and QVS-1.0 behavior. QR images are locators, not authority. Verification authority remains the canonical registry through `api.qrv.network`.

New QR codes resolve to:

```text
https://qrv.network/verify/{QRVID}
```

## Required validation

Before a builder change is promoted:

```bash
npm install
npm run check:lanes
npm run validate:prod
```

The promotion path is:

```text
builder work branch
      ↓
integration/multi-builder
      ↓
main
      ↓
production deployment and live acceptance
```

## QR-V production skill dispatch (2026-10-11)

Use the [12 Codex/ACC engineering skills](skills/qrv/README.md) from `.agents/skills/`. Choose the smallest appropriate skill for the issue and record the exact repository, branch, SHA, owner, evidence, blocker and next action. The [release-gate matrix](docs/PRODUCTION_SKILLS_AND_RELEASE_GATES.md) is mandatory for any production claim.

Current live failure evidence: [October 11 triage](docs/PRODUCTION_ACCEPTANCE_FAILURE_2026-10-11.md). Treat `api.qrv.network` HTML on API routes as a blocking topology/contract mismatch; preserve fail-closed 503 on `qrv.network/readyz`. Security issue #49 blocks production acceptance. Do not permit skills or builders to mark COMPLETE without real PostgreSQL VERIFIED → REVOKED and audit evidence.

Run `npm run check:skills`, `npm run validate:prod`, and `npm audit --omit=dev --audit-level=high` before asking for review. Never auto-merge or deploy; require independent QA and human release approval.
