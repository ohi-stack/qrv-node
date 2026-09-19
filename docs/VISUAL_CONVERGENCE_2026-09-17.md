# QR-V™ Visual Convergence — 2026-09-17

## Objective

Converge the customer-facing ChatGPT Sites visual system into the canonical `qrv-node` production runtime without weakening the QRVP-1/QVS-1.0 trust boundary.

## Canonical visual system

The production frontend under `src/web/` is authoritative. It retains:

- QR-V logo/header and responsive six-group navigation;
- dark navy grid surfaces with cyan/green action accents;
- live public-record verification card;
- deterministic verification-status presentation;
- public verification form;
- product/use-case cards;
- issuer-console preview;
- developer/API section;
- production status surface;
- responsive mobile navigation;
- reduced-motion accessibility support.

## Production-content corrections

This convergence also aligns the visual layer with the current platform contract:

- browser-facing product routes remain on `qrv.network`;
- developer examples use the canonical `https://api.qrv.network/api/v1` backend;
- Ed25519 is shown as pending until the signing lifecycle gate is complete;
- the UI does not imply TLS-version proof it does not independently measure;
- pricing display uses the current working issuer catalog rather than obsolete $49/$299 values;
- Company navigation uses canonical contact/support/terms routes;
- “global” remains network branding and is not presented as proof of global adoption.

## Runtime boundary

Do not move `/verify/*`, `/issuer/*`, `/registry/*`, `/status`, `/healthz`, `/readyz`, `/version`, QR generation, or API compatibility behavior into SPA-only client logic. The Express production server remains authoritative for those routes.

## Acceptance

Run:

```bash
npm ci
npm run validate:prod
```

Then verify the compiled frontend, mobile navigation, public record card, API failure states, issuer workflow, sitemap/robots/manifest, and production routing exclusions before merge.
