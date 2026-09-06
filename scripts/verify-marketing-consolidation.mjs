import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'docs/MARKETING_SITE_CONSOLIDATION_AUDIT_2026-09-06.md',
  'docs/marketing/COMMERCIALIZATION_BASELINE.md',
  'docs/marketing/CONTENT_STRATEGY.md',
  'docs/provenance/qrv-marketing-site/README.md',
  'docs/provenance/qrv-marketing-site/site.manifest.json',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/site.webmanifest',
  'config/site.manifest.json'
];

const errors = [];

for (const relativePath of requiredFiles) {
  try {
    await fs.access(path.join(root, relativePath));
  } catch {
    errors.push(`Missing required consolidation file: ${relativePath}`);
  }
}

if (!errors.length) {
  const canonical = JSON.parse(await fs.readFile(path.join(root, 'config/site.manifest.json'), 'utf8'));
  const provenance = JSON.parse(await fs.readFile(path.join(root, 'docs/provenance/qrv-marketing-site/site.manifest.json'), 'utf8'));
  const robots = await fs.readFile(path.join(root, 'public/robots.txt'), 'utf8');
  const sitemap = await fs.readFile(path.join(root, 'public/sitemap.xml'), 'utf8');
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'public/site.webmanifest'), 'utf8'));

  if (canonical.domain !== 'https://qrv.network') errors.push('Canonical platform domain must be https://qrv.network.');
  if (canonical.canonicalServices?.api !== 'https://api.qrv.network') errors.push('Canonical API service must be https://api.qrv.network.');
  if (provenance.sourceType !== 'ChatGPT Sites') errors.push('Sites provenance sourceType changed unexpectedly.');
  if (provenance.destinationRepository !== 'ohi-stack/qrv-marketing-site') errors.push('Historical provenance destinationRepository must remain unchanged.');
  if (!robots.includes('Sitemap: https://qrv.network/sitemap.xml')) errors.push('robots.txt must reference canonical sitemap.');
  if (!manifest.name?.includes('QR-V')) errors.push('Web manifest must preserve QR-V identity.');

  const excludedPrefixes = ['/issuer/', '/admin', '/billing', '/health', '/readyz', '/version'];
  for (const prefix of excludedPrefixes) {
    if (sitemap.includes(`<loc>https://qrv.network${prefix}`)) errors.push(`Private/operational route must not be indexed: ${prefix}`);
  }

  for (const route of canonical.publicRoutes || []) {
    if (route.includes(':') || route.startsWith('/issuer/')) continue;
    const url = route === '/' ? 'https://qrv.network/' : `https://qrv.network${route}`;
    const deliberatelyNonIndexed = ['/billing', '/wallet', '/admin'];
    if (!deliberatelyNonIndexed.includes(route) && !sitemap.includes(`<loc>${url}</loc>`)) {
      errors.push(`Canonical public route missing from sitemap: ${route}`);
    }
  }
}

if (errors.length) {
  console.error('QR-V marketing consolidation validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  canonicalRepository: 'ohi-stack/qrv-node',
  sourceRepository: 'ohi-stack/qrv-marketing-site',
  publicDomain: 'https://qrv.network',
  apiDomain: 'https://api.qrv.network',
  phase: 'audit-preservation-seo'
}, null, 2));
