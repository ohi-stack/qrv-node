# GPT Sites frontend source import — 2026-10-11

Source: `ohi-stack/qrv-marketing-site` main
Target: `ohi-stack/qrv-node` main-derived integration branch.

The four original GPT Sites frontend source files were copied byte-for-byte as UTF-8 source into `src/web/legacy-sites/`:

- `App.jsx` (source blob 41259414dba3cb9eb14c0db747da7167249659fb)
- `config.js`
- `main.jsx`
- `styles.css` (source blob 5562d31acf13777fac97b891565c1cacc34c5443)

These files are **reference-only** and are not wired into the production Vite entrypoint. The existing `src/web/App.jsx` and `src/web/styles.css` are significantly larger and use a newer dark-grid design, Firebase auth, and dashboard components. Replacing them wholesale would be a regression.

Integration follow-up: compare page sections and copy; selectively port only missing useful marketing sections into `src/web/App.jsx`; adapt legacy navigation to canonical `qrv.network` routes, not legacy subdomains; do not import old authentication, routing, or fake verification UI; run tests/build, production acceptance, and review before deployment.

Do not claim this import alone updates the live website or completes customer workflows.
