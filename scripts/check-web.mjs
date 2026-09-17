import { readFileSync, existsSync } from 'node:fs';

const required = [
  'src/web/index.html',
  'src/web/main.jsx',
  'src/web/App.jsx',
  'src/web/config.js',
  'src/web/styles.css',
  'src/web/public/qrv-logo.svg',
  'src/web/public/robots.txt',
  'src/web/public/sitemap.xml',
  'src/web/public/site.webmanifest',
  'vite.config.js'
];

for (const path of required) {
  if (!existsSync(path)) throw new Error(`Missing consolidated web asset: ${path}`);
}

const app = readFileSync('src/web/App.jsx', 'utf8');
const config = readFileSync('src/web/config.js', 'utf8');
const css = readFileSync('src/web/styles.css', 'utf8');
const index = readFileSync('src/web/index.html', 'utf8');
const logo = readFileSync('src/web/public/qrv-logo.svg', 'utf8');
const robots = readFileSync('src/web/public/robots.txt', 'utf8');
const sitemap = readFileSync('src/web/public/sitemap.xml', 'utf8');

const requiredAppTerms = [
  'Turn every',
  'scan into proof.',
  'GLOBAL VERIFICATION NETWORK',
  'LIVE PUBLIC RECORD',
  'PUBLIC LAUNCH',
  'QR-V Issuer Portal',
  'Verified certificates first.',
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

for (const token of ['--cyan:#2dd7ea', '--green:#43eca7', '--panel:#071c2b', '--grid:rgba(46,211,232,.085)']) {
  if (!css.includes(token)) throw new Error(`Sites visual token missing: ${token}`);
}

for (const behavior of ['@keyframes pulse', '@keyframes beamDrift', '@keyframes scanCard', '@media(max-width:760px)', 'prefers-reduced-motion']) {
  if (!css.includes(behavior)) throw new Error(`Sites responsive/animation contract missing: ${behavior}`);
}

if (!logo.includes('QR-V Global Verification Network') || !logo.includes('data:image/jpeg;base64,')) {
  throw new Error('QR-V Sites logo asset is missing or does not preserve the captured logo treatment.');
}

if (!index.includes('rel="manifest"') || !index.includes('https://qrv.network/')) {
  throw new Error('Frontend index is missing canonical/manifest metadata.');
}

if (!robots.includes('Disallow: /issuer/dashboard') || !robots.includes('Sitemap: https://qrv.network/sitemap.xml')) {
  throw new Error('Robots policy is missing protected issuer routes or canonical sitemap.');
}

for (const route of ['/verify', '/issuer', '/registry', '/developers', '/docs', '/pricing', '/status']) {
  if (!sitemap.includes(`https://qrv.network${route}`)) throw new Error(`Sitemap missing route: ${route}`);
}

console.log('QR-V Sites visual convergence check passed.');
