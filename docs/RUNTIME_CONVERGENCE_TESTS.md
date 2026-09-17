# Runtime Convergence Tests

`npm run validate:prod` must prove the following before merge:

- frontend source contract passes;
- compiled Vite output exists;
- the production server starts with compiled assets;
- public routes use the Sites SPA shell;
- verification/issuer/registry remain Express-owned;
- API compatibility routes never fall through to HTML;
- health/version remain JSON;
- direct QRVID redirects remain intact;
- legacy subdomain redirects occur before SPA handling.
