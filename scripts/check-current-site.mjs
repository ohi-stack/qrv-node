import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root = 'sites/current-source/';
const manifest = JSON.parse(readFileSync(root + 'SOURCE_MANIFEST.json', 'utf8'));
const paths = new Set();
for (const file of manifest.files) {
  assert(!file.path.startsWith('/') && !file.path.split('/').includes('..') && !paths.has(file.path));
  paths.add(file.path);
  const data = readFileSync(root + file.path);
  assert.equal(data.length, file.size, file.path);
  assert.equal(createHash('sha256').update(data).digest('hex'), file.sha256, file.path);
}
for (const file of ['app/admin/workspace.tsx', 'app/admin/analytics.ts', 'app/issuer/dashboard/workspace.tsx', 'app/signin/page.tsx', 'app/api/dashboard/admin/route.ts', 'package-lock.json']) assert(paths.has(file), file);
console.log(`Verified ${paths.size} source files from ${manifest.sourceCommit}; saved version ${manifest.latestSavedVersion}, source ahead: ${manifest.sourceAheadOfSavedVersion}`);
