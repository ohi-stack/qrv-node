# QRV.network Hostinger Deployment Ownership

## Canonical production deployment

The QR-V production platform uses two runtime repositories only:

```text
qrv.network       → ohi-stack/qrv-node
api.qrv.network   → ohi-stack/qrv-api
```

`qrv-marketing-site` is a public content/design source and must not be deployed as a competing runtime unless the architecture is deliberately changed in `qrv-infra` first.

## Platform deployment

```text
Domain: qrv.network
Repository: ohi-stack/qrv-node
Branch: main
Runtime: Node.js 20+
Install: npm install
Start: npm start
Port: process.env.PORT
Bind: 0.0.0.0
```

Required platform checks:

```text
https://qrv.network/
https://qrv.network/verify
https://qrv.network/issuer
https://qrv.network/registry
https://qrv.network/docs
https://qrv.network/developers
https://qrv.network/pricing
https://qrv.network/status
https://qrv.network/healthz
https://qrv.network/readyz
https://qrv.network/version
```

## API deployment

```text
Domain: api.qrv.network
Repository: ohi-stack/qrv-api
Branch: main
Runtime: Node.js 20+
Install: npm install
Migration: npm run migrate
Start: npm start
Port: process.env.PORT
Bind: 0.0.0.0
```

Required API checks:

```text
https://api.qrv.network/healthz
https://api.qrv.network/readyz
https://api.qrv.network/version
https://api.qrv.network/api/v1/verify/{QRVID}
```

## Canonical routing

```text
qrv.network/verify/{QRVID}
        ↓
api.qrv.network/api/v1/verify/{QRVID}
        ↓
canonical PostgreSQL registry
```

Human-facing verification, issuer, registry, explorer, docs, developers, pricing, and status pages remain under `qrv.network`. Privileged data access and lifecycle mutation remain under `api.qrv.network`.

## Legacy compatibility

Historical service hostnames should resolve only as compatibility aliases and issue permanent 308 redirects through the platform node. Do not deploy separate verifier, issuer, registry, docs, explorer, developer, or status applications after cutover.

## Production rule

The public platform must not hold database credentials, signing private keys, webhook secrets, payment-provider secrets, or unrestricted administrative API credentials.