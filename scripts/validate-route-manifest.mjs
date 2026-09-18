import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync(new URL('../config/routes.manifest.json', import.meta.url), 'utf8'));
const allowed = new Set(['LIVE','IMPLEMENTED BUT NOT DEPLOYED','PARTIALLY IMPLEMENTED','DEVELOPMENT','PLANNED','BLOCKED','DEPRECATED']);
const routes = [ ...(manifest.root?.routes || []) ];
for (const group of Object.values(manifest.groups || {})) routes.push(...(group.routes || []));

const duplicates = routes.filter((route, index) => routes.indexOf(route) !== index);
if (duplicates.length) throw new Error('Duplicate canonical routes: ' + [...new Set(duplicates)].join(', '));
if (!routes.includes('/verify/{qrvid}')) throw new Error('Canonical verification route is missing.');
if (!routes.includes('/issuer/dashboard')) throw new Error('Issuer dashboard route is missing.');
if (manifest.canonicalOrigin !== 'https://qrv.network') throw new Error('Canonical platform origin must be https://qrv.network');
if (manifest.apiOrigin !== 'https://api.qrv.network') throw new Error('Canonical API origin must be https://api.qrv.network');
if (!Array.isArray(manifest.statusVocabulary) || manifest.statusVocabulary.some(v => !allowed.has(v))) throw new Error('Invalid status vocabulary.');
if ((manifest.navigation?.primary || []).map(x=>x.label).join('|') !== 'Products|Solutions|Developers|Documentation|Pricing|About') throw new Error('Primary navigation contract drifted.');
console.log(JSON.stringify({ok:true,routeCount:routes.length,tier1:manifest.tier1Required.length,redirects:Object.keys(manifest.compatibilityRedirects||{}).length},null,2));
