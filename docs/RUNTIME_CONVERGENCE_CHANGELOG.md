# QR-V™ Runtime Convergence Changelog

## 2026-09-17

- Serve the compiled Sites frontend from `qrv-node`.
- Preserve Express ownership of verification, issuer, registry, health, readiness, version, QR generation, status, explorer, and API compatibility routes.
- Require compiled frontend artifacts in production startup.
- Serve hashed Vite assets with immutable caching.
- Preserve legacy subdomain 308 redirects before SPA/static handling.
- Add compiled artifact validation.
- Add executable local routing-contract validation.
- Update production validation to build and test the integrated runtime.
