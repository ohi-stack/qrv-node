import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'skills/qrv/manifest.json');
const errors = [];
const expected = Array.from({ length: 12 }, (_, i) => `QRV-${String(i + 1).padStart(2, '0')}`);
let manifest;
try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
catch (error) { console.error(`Cannot read production skill manifest: ${error.message}`); process.exit(1); }

if (manifest.schemaVersion !== '1.0') errors.push('manifest schemaVersion must equal 1.0');
if (manifest.status !== 'SPECIFIED_NOT_PRODUCTION_ACCEPTED') errors.push('manifest must not claim production acceptance');
if (manifest.authority?.api !== 'api.qrv.network') errors.push('canonical API authority mismatch');
if (manifest.authority?.platform !== 'qrv.network') errors.push('canonical platform mismatch');
if (!Array.isArray(manifest.skills) || manifest.skills.length !== 12) errors.push('expected exactly 12 skills');

const seenIds = new Set(), seenSlugs = new Set(), seenPaths = new Set();
for (const item of manifest.skills || []) {
  if (seenIds.has(item.id)) errors.push(`duplicate ID: ${item.id}`);
  if (seenSlugs.has(item.slug)) errors.push(`duplicate slug: ${item.slug}`);
  if (seenPaths.has(item.path)) errors.push(`duplicate path: ${item.path}`);
  seenIds.add(item.id); seenSlugs.add(item.slug); seenPaths.add(item.path);
  if (!expected.includes(item.id)) errors.push(`unexpected skill ID: ${item.id}`);
  if (!/^(P0|P1|P2)$/.test(item.priority || '')) errors.push(`invalid priority: ${item.id}`);
  if (!/^ohi-stack\/(qrv-node|qrv-api)$/.test(item.primaryRepo || '')) errors.push(`invalid primary repo: ${item.id}`);
  if (!/^\.agents\/skills\/qrv-[a-z0-9-]+\/SKILL\.md$/.test(item.path || '')) errors.push(`unsafe skill path: ${item.id}`);
  const full = path.resolve(root, item.path || '');
  if (!full.startsWith(path.resolve(root, '.agents/skills') + path.sep)) { errors.push(`skill path escapes root: ${item.id}`); continue; }
  if (!fs.existsSync(full)) { errors.push(`missing skill: ${item.path}`); continue; }
  const txt = fs.readFileSync(full, 'utf8');
  if (!txt.startsWith(`---\nname: ${item.slug}\n`)) errors.push(`frontmatter name mismatch: ${item.id}`);
  for (const marker of ['## Trigger', '## Normative authority and trust boundary', '## Required inputs', '## Procedure', '## Verification and evidence', '## Definition of done', '## Escalation / approval', '## Response contract']) {
    if (!txt.includes(marker)) errors.push(`${item.id} missing ${marker}`);
  }
  if (!txt.includes('QRVP-1') || !txt.includes('QVS-1.0') || !txt.includes('api.qrv.network') || !txt.includes('PostgreSQL')) errors.push(`${item.id} missing authority or standard`);
  if (!txt.includes('COMPLETE only when')) errors.push(`${item.id} missing no-false-completion rule`);
}
for (const id of expected) if (!seenIds.has(id)) errors.push(`missing skill ID: ${id}`);
if (errors.length) { for (const error of errors) console.error(`FAIL ${error}`); process.exit(1); }
console.log(`PASS QR-V skill contract: ${manifest.skills.length} skills, unique IDs and slugs, required sections, two-node boundaries`);
