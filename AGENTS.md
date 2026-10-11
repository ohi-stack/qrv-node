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

## October 2026 production evidence gates

Read `docs/PRODUCTION_CONSOLIDATION_2026-10-11.md` and `docs/PRODUCTION_BLOCKERS_2026-10-11.md` before promotion.

- Never seed demo verification histories or generate pseudo-random analytics as if they were live traffic.
- Browser-authenticated Firebase users are not automatically authorized issuers.
- `qrv-node` pilot access code is not production multi-tenant identity; require API-side issuer scope and cross-tenant negative tests.
- `api.qrv.network` must return canonical JSON from `ohi-stack/qrv-api`. Login page HTML or edge 404 fails acceptance.
- No client-side, WordPress or Firestore write may masquerade as a canonical registry/audit event.
- No Ed25519 operational claim before signed-record negative tests and independent key lifecycle evidence.
- Keep public verification payloads minimal; the trusted API must enforce per-record privacy.
- A PR or local code edit is not a live deployment and should not be recorded as such.
