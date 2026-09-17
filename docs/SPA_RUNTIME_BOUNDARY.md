# QR-V™ SPA Runtime Boundary

The compiled Sites frontend is a presentation layer inside `qrv-node`, not a replacement for trusted server behavior.

## SPA-owned public presentation

Ordinary HTML GET/HEAD requests may fall back to `dist/index.html` when they are not reserved by the operational route set.

This supports customer-facing deep links across the canonical `qrv.network` sitemap, including public About, Products, Solutions, Developers, Documentation, Protocol, Security, Enterprise, Pricing, Resources, Network, Company, Support, and Legal paths.

## Express-owned routes

The following remain outside SPA fallback:

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
/robots.txt
/sitemap.xml
/site.webmanifest
```

The root compatibility form `/{QRVID}` is also Express-owned so it can preserve its 308 redirect to `/verify/{QRVID}`.

## Trust rule

The SPA may request verification information, but it must never independently decide or persist authoritative verification state. Canonical verification and registry authority remain behind `api.qrv.network`.
