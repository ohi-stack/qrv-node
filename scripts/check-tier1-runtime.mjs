import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const routerPath = path.join(root, 'src', 'web', 'SiteRouter.jsx');
const mainPath = path.join(root, 'src', 'web', 'main.jsx');
const manifestPath = path.join(root, 'config', 'routes.manifest.json');

const router = fs.readFileSync(routerPath, 'utf8');
const main = fs.readFileSync(mainPath, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const errors = [];
const requireText = (source, term, label) => {
  if (!source.includes(term)) errors.push(`${label}: missing ${term}`);
};

for (const label of manifest.navigation.primary) requireText(router, `label: '${label}'`, 'canonical navigation');
for (const action of manifest.navigation.actionLinks) {
  requireText(router, `>${action.label}<`, 'canonical action');
  requireText(router, `href="${action.path}"`, 'canonical action path');
}

const spaTierOne = ['/products', '/developers', '/docs', '/pricing', '/security', '/support', '/legal'];
for (const route of spaTierOne) requireText(router, `'${route}':`, `Tier 1 page ${route}`);

requireText(router, "pathname === '/'", 'homepage routing');
requireText(router, 'defined page or route does not make a QR-V capability operational', 'capability claim guard');
requireText(main, "import SiteRouter from './SiteRouter.jsx'", 'frontend entrypoint');
requireText(main, '<SiteRouter />', 'frontend entrypoint');

if (errors.length) {
  console.error('Tier 1 runtime contract failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Tier 1 runtime contract OK: ${spaTierOne.length} SPA-owned Tier 1 surfaces + canonical navigation/actions.`);
