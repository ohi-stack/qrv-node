# QRV.network Public Content Environment

`qrv-marketing-site` is a design/content source repository. The canonical production runtime for `qrv.network` is `ohi-stack/qrv-node`; the canonical backend is `ohi-stack/qrv-api`.

## Public URL contract

```env
APP_BASE_URL=https://qrv.network
VERIFY_BASE_URL=https://qrv.network/verify
ISSUER_BASE_URL=https://qrv.network/issuer
REGISTRY_BASE_URL=https://qrv.network/registry
DOCS_BASE_URL=https://qrv.network/docs
DEVELOPERS_BASE_URL=https://qrv.network/developers
STATUS_BASE_URL=https://qrv.network/status
API_BASE_URL=https://api.qrv.network/api/v1
```

## Frontend variables

Only public values may be exposed through Vite:

```env
VITE_APP_BASE_URL=https://qrv.network
VITE_QRV_VERIFY_BASE_URL=https://qrv.network/verify
VITE_QRV_ISSUER_BASE_URL=https://qrv.network/issuer
VITE_QRV_API_BASE_URL=https://api.qrv.network/api/v1
VITE_QRV_REGISTRY_BASE_URL=https://qrv.network/registry
VITE_QRV_DOCS_BASE_URL=https://qrv.network/docs
VITE_QRV_DEVELOPERS_BASE_URL=https://qrv.network/developers
VITE_QRV_STATUS_BASE_URL=https://qrv.network/status
VITE_QRV_DEMO_QRVID=QRV-PROD-CERT-000001
```

## Security rule

Never place database credentials, Supabase secret/server keys, JWT signing secrets, unrestricted QR-V API keys, webhook secrets, Ed25519 private keys, or payment-provider secrets in this repository or browser bundle.

Privileged configuration belongs only to `api.qrv.network` / `ohi-stack/qrv-api`. Server-session configuration for the human-facing platform belongs only to `qrv.network` / `ohi-stack/qrv-node`.

## Legacy domains

Historical service hostnames may remain as HTTP 308 compatibility aliases, but they must not be used as canonical defaults in new content or environment configuration.