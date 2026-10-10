import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const home = read('src/web/App.jsx');
const trust = read('src/web/components/TrustArchitecture.jsx');
const css = read('src/web/styles.css');
const manifest = JSON.parse(read('sites/qrv-global-verification/site.manifest.json'));
const errors = [];

const requireText = (content, text, label) => {
  if (!content.includes(text)) errors.push(label + ': missing ' + text);
};

requireText(home, "import TrustArchitecture from './components/TrustArchitecture.jsx'", 'homepage import');
requireText(home, '<TrustArchitecture />', 'homepage trust section');
requireText(home, 'PRODUCTION ACTIVATION', 'production claim guard');
requireText(home, 'Illustrative QR pattern; not a scannable verification code', 'QR illustration disclosure');
requireText(home, 'response.ok ?', 'verification fail-closed guard');
if (home.includes('PUBLIC LAUNCH') || home.includes('<StatusPill>TLS 1.3</StatusPill>')) {
  errors.push('unsupported production/TLS badge present');
}
for (const title of [
  'Unified cryptographic security',
  'Selective privacy',
  'Open standards',
  'Seamless interoperability'
]) requireText(trust, title, 'trust requirement');
for (const phrase of [
  'api.qrv.network', 'QRVP-1', 'QVS-1.0',
  'not evidence that a specific connector is live',
  'does not independently establish legal title',
  'A QR-V Wallet saves references'
]) requireText(trust, phrase, 'risk boundary');
requireText(css, '.trust-architecture-section', 'responsive section styling');
requireText(css, '@media(max-width:850px)', 'mobile layout');
if (manifest.conversationContentRevision !== '2026-10-10') {
  errors.push('Sites manifest must reference the conversation revision');
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('QR-V trust, privacy, open standards, integration and public-claim copy checks passed.');
