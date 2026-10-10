# Changelog

## Unreleased

- Move the Vite production build toolchain into runtime dependencies so Hostinger's production-only install can complete `npm run build`.
- Upgrade the production build toolchain to Vite 8, removing the vulnerable and Vite 6-incompatible `esbuild` dependency reported by Hostinger.
- Pin patched transitive dependency floors for `proxy-addr`, `source-map-js`, and `qs` in response to the Hostinger security scan.
- Require the patched `@grpc/grpc-js` release used by Firebase so the complete production dependency audit is clean.
