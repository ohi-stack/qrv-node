# QR-V public site design

The browser platform implements the public design established by the QR-V Global Verification Network Sites project (Version 5) while preserving the production two-node architecture.

## Brand system

- Official QR-V Global Verification Network logo and favicon
- White institutional header over dark navy infrastructure surfaces
- Cyan verification signals, green operational states, grid and network-line cues
- Sticky header, accessible mega navigation, mobile accordion navigation, and back-to-top control
- Product, pricing, developer, institutional-trust, issuer, and live-verification surfaces

## Canonical topology

The visual network rail intentionally uses routes on `qrv.network` plus the single API origin:

```text
qrv.network
├── /verify/{qrvid}
├── /registry/{qrvid}
├── /issuer/*
├── /docs
└── /developers

api.qrv.network
└── /api/v1/*
```

Legacy subdomains remain redirect-only compatibility endpoints and must not be presented as independent production applications.

## Static assets

Assets are served from `/assets` with one-day browser caching. The document shell uses a self-only Content Security Policy and includes no third-party runtime dependencies, fonts, scripts, pixels, or trackers.

## Verification

Run:

```bash
npm run check
```

The platform tests assert the brand shell, navigation groups, institutional-trust/product content, canonical two-node labels, and absence of legacy application hostnames from the home page.
