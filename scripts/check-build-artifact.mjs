import { existsSync } from 'node:fs';

const requiredArtifacts = [
  'dist/index.html',
  'dist/robots.txt',
  'dist/sitemap.xml',
  'dist/site.webmanifest'
];

const missing = requiredArtifacts.filter((path) => !existsSync(path));
if (missing.length > 0) {
  throw new Error(`Missing production build artifact(s): ${missing.join(', ')}. Run npm run build before starting qrv-node.`);
}

console.log('QR-V production build artifact check passed.');
