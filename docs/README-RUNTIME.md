# Operator Note — Sites Runtime Convergence

The QR-V customer-facing frontend is built with Vite and served by the canonical `qrv-node` Express application.

Production must run the build step before start:

```bash
npm run build
npm start
```

`NODE_ENV=production` startup fails if `dist/index.html` is absent.

Operational route exclusions are enforced in `server.js` and regression-tested by `scripts/test-spa-routing.mjs`.
