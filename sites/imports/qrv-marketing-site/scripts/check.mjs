import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'index.html',
  'server.js',
  'package.json',
  'vite.config.js',
  'env.example',
  'src/App.jsx',
  'src/main.jsx',
  'src/config.js',
  'src/styles.css',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/site.webmanifest',
  'docs/environment.md',
  'docs/deployment-hostinger.md',
  'docs/pages.md',
  'scripts/source-only-start.mjs'
];

for (const file of requiredFiles) {
  if (!existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

execFileSync(process.execPath, ['--check', 'server.js'], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', 'vite.config.js'], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', 'src/config.js'], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', 'scripts/source-only-start.mjs'], { stdio: 'inherit' });

const checks = [
  ['server.js', 'QR-V™'],
  ['server.js', '/health'],
  ['server.js', '/readyz'],
  ['server.js', '/version'],
  ['server.js', '0.0.0.0'],
  ['server.js', 'sourceOnly'],
  ['src/App.jsx', 'Global Verification Network'],
  ['src/App.jsx', 'registry-based verification'],
  ['src/App.jsx', 'Verify Demo Record'],
  ['src/config.js', 'https://qrv.network/verify'],
  ['src/config.js', 'https://qrv.network/issuer'],
  ['src/config.js', 'https://qrv.network/registry'],
  ['src/config.js', 'https://api.qrv.network/api/v1'],
  ['public/sitemap.xml', 'https://qrv.network/status'],
  ['package.json', 'scripts/source-only-start.mjs'],
  ['scripts/source-only-start.mjs', 'QRV_ALLOW_SOURCE_PREVIEW'],
  ['scripts/source-only-start.mjs', 'ohi-stack/qrv-node'],
  ['scripts/source-only-start.mjs', 'ohi-stack/qrv-api']
];

for (const [file, snippet] of checks) {
  const content = readFileSync(file, 'utf8');
  if (!content.includes(snippet)) throw new Error(`${file} is missing required snippet: ${snippet}`);
}

for (const file of ['src/config.js', '.env.example', 'env.example']) {
  const content = readFileSync(file, 'utf8');
  for (const legacyOrigin of [
    'https://verify.qrv.network',
    'https://issuer.qrv.network',
    'https://registry.qrv.network',
    'https://docs.qrv.network',
    'https://developers.qrv.network',
    'https://store.qrv.network'
  ]) {
    if (content.includes(legacyOrigin)) {
      throw new Error(`${file} still uses legacy canonical origin: ${legacyOrigin}`);
    }
  }
}

console.log('QR-V marketing source two-node and source-only readiness check passed.');
