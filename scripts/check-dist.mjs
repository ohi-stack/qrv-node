import { existsSync, readdirSync } from 'node:fs';

const required = ['dist/index.html'];
for (const file of required) {
  if (!existsSync(file)) throw new Error(`Missing compiled frontend artifact: ${file}`);
}

if (!existsSync('dist/assets')) throw new Error('Missing compiled frontend assets directory: dist/assets');
const assets = readdirSync('dist/assets');
if (!assets.some((name) => name.endsWith('.js'))) throw new Error('Compiled frontend JavaScript asset missing.');
if (!assets.some((name) => name.endsWith('.css'))) throw new Error('Compiled frontend CSS asset missing.');

console.log(`QR-V compiled Sites frontend artifacts validated (${assets.length} assets).`);
