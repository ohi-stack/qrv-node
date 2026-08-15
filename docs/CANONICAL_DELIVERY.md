# QR-V Canonical Delivery Contract

## Purpose

`qrv.network` must resolve to one public platform implementation on every device, network path, cache edge, and user agent.

The canonical production source is:

```text
Repository: ohi-stack/qrv-node
Hostname: qrv.network
Role: public QR-V platform node
```

`qrv-marketing-site` and the former subdomain applications are source/reference modules only. They must not be mapped as independent production origins for the root domain.

## Required production topology

```text
qrv.network
  -> ohi-stack/qrv-node

api.qrv.network
  -> ohi-stack/qrv-api
```

No second application may independently answer for `qrv.network`.

## Legacy hostname policy

Legacy QR-V hostnames may remain in DNS only as compatibility aliases/redirects to the canonical platform routes:

```text
verify.qrv.network      -> qrv.network/verify
issuer.qrv.network      -> qrv.network/issuer
registry.qrv.network    -> qrv.network/registry
explorer.qrv.network    -> qrv.network/explorer
docs.qrv.network        -> qrv.network/docs
developers.qrv.network  -> qrv.network/developers
status.qrv.network      -> qrv.network/status
store.qrv.network       -> qrv.network/store
```

Use HTTP 308 redirects for these compatibility mappings.

## Root homepage acceptance contract

Both desktop and mobile requests to `https://qrv.network/` must return the same canonical platform build.

Canonical marker:

```text
QR-V™ NETWORK
```

The following legacy homepage text must not be returned by any production edge:

```text
Verify Records. Confirm Authenticity. Instantly.
```

The live acceptance command checks both a desktop Safari user agent and an iPhone Safari user agent:

```bash
npm run acceptance:live
```

A release fails if either user agent receives the stale homepage, a different origin, an invalid response type, or a server failure.

## Cache policy

HTML deployment changes must not depend on long-lived browser or CDN caching. The deployment layer should revalidate root HTML after every release. Fingerprinted static assets may use long-lived immutable caching.

Recommended HTML response policy:

```text
Cache-Control: no-cache, max-age=0, must-revalidate
Vary: Accept-Encoding
```

A CDN/cache purge is required after changing the application mapped to `qrv.network`.

## DNS and Hostinger requirements

Before release:

1. Confirm one active apex origin for `qrv.network`.
2. Remove obsolete A/AAAA/CNAME/application bindings that point to old QR-V frontends.
3. Confirm IPv4 and IPv6 routes terminate at the same canonical application.
4. Map `qrv.network` to `ohi-stack/qrv-node/main`.
5. Purge Hostinger/CDN caches.
6. Run `npm run acceptance:live` from a clean network path.
7. Verify the desktop and mobile root probes both pass.

## Release rule

Do not declare the QR-V platform release complete while desktop and mobile clients can receive different homepage builds.
