# QR-V™ Production Runtime Release Gate

This release completes Sites frontend runtime convergence inside `qrv-node`.

## Release sequence

1. Review security issue #49 and verify the committed npm lockfile / patched transitive dependency tree.
2. `npm ci && npm audit --omit=dev --audit-level=high && npm run validate:prod`
3. Confirm `api.qrv.network` is routed to `ohi-stack/qrv-api` and answers JSON health/readiness/version without an HTML login redirect; restore DB readiness before deployment.
4. Deploy `qrv-node` to `qrv.network`
5. Confirm `/healthz`, `/readyz`, and `/version`
6. Confirm `/` renders the compiled Sites frontend
7. Confirm `/verify`, `/issuer`, and `/registry` remain server-owned
8. Confirm `QRV-PROD-CERT-000001` obtains its result through `api.qrv.network`
9. Check 308 legacy service hostnames only for aliases required by previously issued QR codes; set `QRV_REQUIRE_LEGACY_REDIRECT=1` to enforce the legacy verification hostname.
10. Run the full issuer lifecycle, cross-issuer authorization, privacy, signing-status and webhook-entitlement acceptance gates

Do not mark the release fully operational until both the platform and canonical API/data node pass live acceptance.
