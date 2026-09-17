import { readFileSync, existsSync } from 'node:fs';

const required = [
  'src/web/index.html',
  'src/web/main.jsx',
  'src/web/App.jsx',
  'src/web/config.js',
  'src/web/styles.css',
  'vite.config.js',
  'server.js',
  'scripts/check-dist.mjs'
];

for (const path of required) {
  if (!existsSync(path)) throw new Error(`Missing consolidated web asset: ${path}`);
}

const app = readFileSync('src/web/App.jsx', 'utf8');
const config = readFileSync('src/web/config.js', 'utf8');
const css = readFileSync('src/web/styles.css', 'utf8');
const server = readFileSync('server.js', 'utf8');

const requiredAppTerms = [
  'A verification layer for QR-based systems.',
  'QR-V Issuer Portal',
  'Verified Certificates',
  '/verify',
  '/issuer',
  '/registry',
  '/developers',
  '/docs',
  '/status'
];

for (const term of requiredAppTerms) {
  if (!app.includes(term)) throw new Error(`Frontend contract missing: ${term}`);
}

if (!config.includes('https://api.qrv.network/api/v1')) {
  throw new Error('Frontend must target the canonical api.qrv.network backend.');
}

for (const legacyOrigin of [
  'https://verify.qrv.network',
  'https://issuer.qrv.network',
  'https://registry.qrv.network',
  'https://docs.qrv.network',
  'https://developers.qrv.network'
]) {
  if (app.includes(legacyOrigin) || config.includes(legacyOrigin)) {
    throw new Error(`Legacy production origin present in consolidated frontend: ${legacyOrigin}`);
  }
}

for (const token of ['--gold:#f2d06b', '--cyan:#55c7ff', '--panel:#101936']) {
  if (!css.includes(token)) throw new Error(`Sites visual token missing: ${token}`);
}

for (const protectedPrefix of [
  "'/verify'",
  "'/issuer'",
  "'/registry'",
  "'/api/v1'",
  "'/healthz'",
  "'/readyz'",
  "'/version'"
]) {
  if (!server.includes(protectedPrefix)) {
    throw new Error(`SPA exclusion missing from runtime: ${protectedPrefix}`);
  }
}

for (const runtimeTerm of [
  "express.static(WEB_DIST_DIR",
  'shouldServeSpa(req)',
  "res.sendFile(WEB_INDEX)",
  'Compiled Sites frontend missing'
]) {
  if (!server.includes(runtimeTerm)) throw new Error(`Compiled frontend runtime contract missing: ${runtimeTerm}`);
}

console.log('QR-V consolidated Sites frontend and SPA routing checks passed.');
