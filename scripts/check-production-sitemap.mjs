import fs from 'node:fs';

const manifestUrl = new URL('../config/routes.manifest.json', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(manifestUrl, 'utf8'));

const fail = (message) => {
  console.error(`[production-sitemap] ${message}`);
  process.exit(1);
};

if (manifest.architecture?.publicPlatform !== 'https://qrv.network') {
  fail('publicPlatform must be https://qrv.network');
}
if (manifest.architecture?.apiAuthority !== 'https://api.qrv.network/api/v1') {
  fail('apiAuthority must be https://api.qrv.network/api/v1');
}
if (manifest.architecture?.singleHumanFacingOrigin !== true) {
  fail('singleHumanFacingOrigin must be true');
}
if (manifest.architecture?.singleWritableRegistry !== true) {
  fail('singleWritableRegistry must be true');
}

const expectedPrimary = ['Products', 'Solutions', 'Developers', 'Documentation', 'Pricing', 'About'];
if (JSON.stringify(manifest.navigation?.primary) !== JSON.stringify(expectedPrimary)) {
  fail(`primary navigation must be: ${expectedPrimary.join(' · ')}`);
}

const requiredActions = [
  ['Verify Record', '/verify'],
  ['Issuer Login', '/issuer/login'],
  ['Get Started', '/issuer/onboarding']
];
for (const [label, path] of requiredActions) {
  if (!manifest.navigation?.actionLinks?.some((action) => action.label === label && action.path === path)) {
    fail(`missing action link ${label} -> ${path}`);
  }
}

const requiredTier1 = [
  '/', '/verify', '/verify/:qrvid', '/issuer', '/issuer/onboarding', '/issuer/dashboard',
  '/issuer/records', '/registry', '/developers', '/docs', '/products', '/pricing',
  '/security', '/status', '/support', '/legal'
];
for (const route of requiredTier1) {
  if (!manifest.tiers?.['1']?.includes(route)) fail(`Tier 1 missing ${route}`);
}

const allRoutes = Object.values(manifest.routeInventory || {}).flat();
const seen = new Set();
for (const route of allRoutes) {
  if (!route.startsWith('/')) fail(`route must begin with /: ${route}`);
  if (route.startsWith('/api/')) fail(`machine API route leaked into public route inventory: ${route}`);
  if (seen.has(route)) fail(`duplicate route in routeInventory: ${route}`);
  seen.add(route);
}

const requiredFamilies = [
  'about', 'verify', 'registry', 'issuer', 'products', 'solutions', 'developers', 'docs',
  'protocol', 'security', 'enterprise', 'pricing', 'resources', 'network', 'status',
  'company', 'support', 'legal'
];
for (const family of requiredFamilies) {
  if (!Array.isArray(manifest.routeInventory?.[family])) fail(`routeInventory missing ${family}`);
}

const requiredLegacy = {
  'verify.qrv.network': '/verify',
  'registry.qrv.network': '/registry',
  'issuer.qrv.network': '/issuer',
  'docs.qrv.network': '/docs',
  'developers.qrv.network': '/developers',
  'explorer.qrv.network': '/registry'
};
for (const [host, target] of Object.entries(requiredLegacy)) {
  if (manifest.legacyRedirects?.[host] !== target) fail(`legacy redirect ${host} must target ${target}`);
}

if (manifest.apiPolicy?.machineOriented !== true) fail('API policy must remain machine-oriented');
if (manifest.apiPolicy?.sourceOfTruth !== 'OpenAPI') fail('OpenAPI must be the API source of truth');
for (const endpoint of ['/healthz', '/readyz', '/version', '/metrics']) {
  if (!manifest.apiPolicy?.operational?.includes(endpoint)) fail(`API operational endpoint missing ${endpoint}`);
}

if (manifest.capabilityRule?.definedRouteDoesNotEqualOperationalCapability !== true) {
  fail('definedRouteDoesNotEqualOperationalCapability must be true');
}
const requirements = manifest.capabilityRule?.productionRequires || [];
for (const requirement of ['implemented', 'integrated', 'documented', 'tested', 'repeatable']) {
  if (!requirements.includes(requirement)) fail(`production capability rule missing ${requirement}`);
}

if (manifest.qrEncodingTemplate !== 'https://qrv.network/verify/{QRVID}') {
  fail('QR encoding template must use canonical qrv.network verification URL');
}

console.log(`[production-sitemap] OK: ${allRoutes.length} unique public route definitions across ${requiredFamilies.length} families; ${requiredTier1.length} Tier 1 routes`);
