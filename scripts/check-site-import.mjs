// Verifies the reference import matches the source Git tree, without executing archived code.
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve('sites/imports/qrv-marketing-site');
const manifest = JSON.parse(readFileSync(path.join(root, 'SOURCE_IMPORT_MANIFEST.json'), 'utf8'));
if (manifest.sourceRepository !== 'ohi-stack/qrv-marketing-site') throw new Error('Unexpected source repository');
if (manifest.trackedSourceFileCount !== manifest.files.length) throw new Error('Source inventory count mismatch');
const visited = new Set();
for (const entry of manifest.files) {
  if (entry.path.startsWith('/') || entry.path.split('/').includes('..') || visited.has(entry.path)) {
    throw new Error('Unsafe or duplicate import path: ' + entry.path);
  }
  visited.add(entry.path);
  const file = path.join(root, entry.path);
  if (!statSync(file).isFile()) throw new Error('Not a source file: ' + entry.path);
  const bytes = readFileSync(file);
  if (bytes.length !== entry.size) throw new Error('Source length mismatch: ' + entry.path);
  const gitBlob = createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
  if (gitBlob !== entry.sha) throw new Error('Source hash mismatch: ' + entry.path);
}
console.log('QR-V site import verified: ' + manifest.files.length + ' files, source ' + manifest.sourceCommit);
