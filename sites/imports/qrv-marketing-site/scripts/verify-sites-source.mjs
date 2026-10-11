import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'sites', 'qrv-global-verification');
const manifestPath = path.join(siteRoot, 'site.manifest.json');

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

const required = [
  path.join(root, 'README.md'),
  path.join(root, 'CONTENT_STRATEGY.md'),
  manifestPath,
  path.join(siteRoot, 'README.md')
];

for (const file of required) {
  if (!(await exists(file))) {
    console.error(`Missing required QR-V site source file: ${path.relative(root, file)}`);
    process.exit(1);
  }
}

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const errors = [];

if (manifest.site !== 'qrv-global-verification') errors.push('Unexpected Sites project slug.');
if (manifest.destinationRepository !== 'ohi-stack/qrv-marketing-site') errors.push('Destination repository must be ohi-stack/qrv-marketing-site.');
if (manifest.publicDomain !== 'https://qrv.network') errors.push('Public domain must be https://qrv.network.');
if (manifest.runtimeBoundaries?.publicSiteSource !== 'ohi-stack/qrv-marketing-site') errors.push('Public site source boundary is not canonical.');

const mustHaveRoutes = ['/', '/verify', '/issuer', '/registry', '/developers', '/docs', '/pricing', '/status'];
for (const route of mustHaveRoutes) {
  if (!manifest.canonicalPublicRoutes?.includes(route)) errors.push(`Missing canonical route ${route}.`);
}

if (errors.length) {
  for (const error of errors) console.error(`QR-V Sites source check failed: ${error}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  site: manifest.site,
  destinationRepository: manifest.destinationRepository,
  publicDomain: manifest.publicDomain,
  routeCount: manifest.canonicalPublicRoutes.length
}, null, 2));
