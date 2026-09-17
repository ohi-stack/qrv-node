import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const port = Number(process.env.QRV_TEST_PORT || 39091);
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ['server.js'], {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: String(port),
    QRV_PLATFORM_ORIGIN: base,
    QRV_API_BASE_URL: 'http://127.0.0.1:9/api/v1'
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';
child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

async function waitForServer() {
  for (let i = 0; i < 50; i += 1) {
    if (child.exitCode !== null) throw new Error(`Server exited early (${child.exitCode}).\n${stdout}\n${stderr}`);
    try {
      const response = await fetch(`${base}/healthz`);
      if (response.ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error(`Server did not become ready.\n${stdout}\n${stderr}`);
}

async function assertHtml(path, expected, forbidden = null) {
  const response = await fetch(`${base}${path}`, { headers: { accept: 'text/html' }, redirect: 'manual' });
  const body = await response.text();
  if (!body.includes(expected)) throw new Error(`${path} missing expected marker: ${expected}`);
  if (forbidden && body.includes(forbidden)) throw new Error(`${path} unexpectedly contained marker: ${forbidden}`);
  return { status: response.status, contentType: response.headers.get('content-type') || '' };
}

async function assertJson(path) {
  const response = await fetch(`${base}${path}`, { headers: { accept: 'application/json' }, redirect: 'manual' });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) throw new Error(`${path} must remain JSON, got ${contentType}`);
  await response.json();
  return { status: response.status, contentType };
}

try {
  await waitForServer();

  await assertHtml('/', 'id="root"', 'Verify a QR-V record');
  await assertHtml('/protocol', 'id="root"');
  await assertHtml('/products/certificate-verification', 'id="root"');

  await assertHtml('/verify', 'Verify a QR-V record', 'id="root"');
  await assertHtml('/registry', 'Public Registry Lookup', 'id="root"');
  await assertHtml('/issuer', 'QR-V Issuer Portal', 'id="root"');

  await assertJson('/healthz');
  await assertJson('/version');

  const directQrvid = await fetch(`${base}/QRV-TEST-CERT-000001`, { redirect: 'manual' });
  if (directQrvid.status !== 308 || directQrvid.headers.get('location') !== '/verify/QRV-TEST-CERT-000001') {
    throw new Error('Direct QRVID compatibility redirect was intercepted by SPA fallback.');
  }

  console.log('QR-V SPA routing contract passed.');
} finally {
  child.kill('SIGTERM');
}
