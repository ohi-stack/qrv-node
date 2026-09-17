# QR-V™ Production Runtime Release Gate

This release completes Sites frontend runtime convergence inside `qrv-node`.

## Release sequence

1. `npm install`
2. `npm run validate:prod`
3. Deploy `qrv-node` to `qrv.network`
4. Confirm `/healthz`, `/readyz`, and `/version`
5. Confirm `/` renders the compiled Sites frontend
6. Confirm `/verify`, `/issuer`, and `/registry` remain server-owned
7. Confirm `QRV-PROD-CERT-000001` obtains its result through `api.qrv.network`
8. Confirm legacy service hostnames return 308 redirects
9. Run the full issuer lifecycle acceptance gate

Do not mark the release fully operational until both the platform and canonical API/data node pass live acceptance.
