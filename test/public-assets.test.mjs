import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import { after, before, test } from 'node:test';

const qrvid = 'QRV-CERT-RUNTIME-0001';
let apiServer;
let platformProcess;
let platformBase;

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function waitUntilReady(url, process) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (process.exitCode !== null) throw new Error(`qrv-node exited before becoming ready (${process.exitCode})`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Timed out waiting for qrv-node');
}

before(async () => {
  const apiPort = await freePort();
  apiServer = http.createServer((request, response) => {
    response.setHeader('content-type', 'application/json');
    if (request.url === `/api/v1/verify/${qrvid}`) {
      response.end(JSON.stringify({ state: 'VERIFIED', record: { qrvid, issuer: 'Runtime Test Issuer', recordType: 'certificate' } }));
      return;
    }
    if (request.url?.startsWith('/api/v1/records')) {
      response.end(JSON.stringify({ records: [] }));
      return;
    }
    response.statusCode = 404;
    response.end(JSON.stringify({ state: 'NOT_FOUND' }));
  });
  await new Promise((resolve, reject) => apiServer.listen(apiPort, '127.0.0.1', resolve).once('error', reject));

  const platformPort = await freePort();
  platformBase = `http://127.0.0.1:${platformPort}`;
  platformProcess = spawn(process.execPath, ['server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(platformPort),
      QRV_PLATFORM_ORIGIN: platformBase,
      QRV_API_BASE_URL: `http://127.0.0.1:${apiPort}/api/v1`,
      QRV_PLATFORM_API_KEY: 'runtime-test-key',
      SESSION_SECRET: 'runtime-test-session-secret-at-least-32-bytes',
      ISSUER_ACCESS_CODE: 'runtime-test-access-code'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  await waitUntilReady(`${platformBase}/healthz`, platformProcess);
});

after(async () => {
  if (platformProcess && platformProcess.exitCode === null) {
    platformProcess.kill('SIGTERM');
    await new Promise((resolve) => platformProcess.once('exit', resolve));
  }
  if (apiServer) await new Promise((resolve) => apiServer.close(resolve));
});

for (const [route, file, expectedType] of [
  ['/robots.txt', 'robots.txt', 'text/plain'],
  ['/sitemap.xml', 'sitemap.xml', 'application/xml'],
  ['/site.webmanifest', 'site.webmanifest', 'application/manifest+json']
]) {
  test(`${route} is served from the built deployment artifact`, async () => {
    const expected = await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
    const response = await fetch(`${platformBase}${route}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type') || '', new RegExp(`^${expectedType.replace('+', '\\+')}`));
    assert.equal(response.headers.get('cache-control'), 'public, max-age=3600');
    assert.equal(await response.text(), expected);
  });
}

test('verification entry and deterministic result routes remain active', async () => {
  const entry = await fetch(`${platformBase}/verify`);
  assert.equal(entry.status, 200);
  assert.match(await entry.text(), /Verify a QR-V record/);

  const result = await fetch(`${platformBase}/verify/${qrvid}`);
  assert.equal(result.status, 200);
  const resultBody = await result.text();
  assert.match(resultBody, new RegExp(qrvid));
  assert.match(resultBody, /VERIFIED/);
});

test('issuer entry and protected dashboard routes remain active', async () => {
  const entry = await fetch(`${platformBase}/issuer`);
  assert.equal(entry.status, 200);
  assert.match(await entry.text(), /QR-V Issuer Portal/);

  const dashboard = await fetch(`${platformBase}/issuer/dashboard`, { redirect: 'manual' });
  assert.equal(dashboard.status, 303);
  assert.equal(dashboard.headers.get('location'), '/issuer');
});
