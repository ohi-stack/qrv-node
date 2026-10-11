import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

const upstream = createServer((req, res) => {
  const send = (status, body) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body));
  };
  if (req.url === '/readyz') return send(200, { ok: true, ready: true });
  if (req.url.includes('LOGIN') || req.url === '/api/v1/status') {
    res.writeHead(302, { location: '/login' });
    return res.end();
  }
  if (req.url.includes('NOTFOUND')) return send(404, { state: 'NOT_FOUND' });
  if (req.url.includes('GOOD')) return send(200, { state: 'VERIFIED', record: { issuer: 'Test issuer', recordType: 'certificate' } });
  if (req.url.startsWith('/api/v1/verify/')) return send(500, { state: 'VERIFIED', record: { issuer: 'Forged success' } });
  return send(404, { state: 'NOT_FOUND' });
});

let child;
try {
  const upstreamPort = await listen(upstream);
  const probe = createServer();
  const nodePort = await listen(probe);
  await new Promise((resolve) => probe.close(resolve));
  child = spawn(process.execPath, ['server.js'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: String(nodePort),
      QRV_API_BASE_URL: `http://127.0.0.1:${upstreamPort}/api/v1`,
      QRV_PLATFORM_ORIGIN: `http://127.0.0.1:${nodePort}`
    },
    stdio: 'pipe'
  });
  let processLog = '';
  child.stderr.on('data', (chunk) => { processLog += chunk.toString(); });

  const base = `http://127.0.0.1:${nodePort}`;
  let started = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw new Error(`Platform terminated: ${processLog}`);
    try {
      const response = await fetch(base + '/healthz');
      if (response.ok) { started = true; break; }
    } catch { /* startup pending */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(started, true, `Platform never started: ${processLog}`);

  const forged = await fetch(base + '/verify/QRV-FAIL-000001');
  assert.equal(forged.status, 503, 'HTTP 500 from API must never be displayed as VERIFIED');
  assert.doesNotMatch(await forged.text(), /<h1>VERIFIED<\/h1>/);

  const login = await fetch(base + '/verify/QRV-LOGIN-000001');
  assert.equal(login.status, 503, 'API login redirect is not a verification response');

  const missing = await fetch(base + '/verify/QRV-NOTFOUND-000001');
  assert.equal(missing.status, 404, 'Canonical NOT_FOUND should remain explicit');

  const good = await fetch(base + '/verify/QRV-GOOD-000001');
  assert.equal(good.status, 200);
  assert.match(await good.text(), /<h1>VERIFIED<\/h1>/);

  const proxied = await fetch(base + '/api/v1/status', { redirect: 'manual' });
  assert.equal(proxied.status, 503, 'Login HTML cannot become an API success');
  assert.match(proxied.headers.get('content-type') || '', /json/);

  console.log('QR-V fail-closed verification / API redirect regression checks passed.');
} finally {
  if (child && child.exitCode === null) {
    child.kill('SIGTERM');
    await Promise.race([once(child, 'exit'), new Promise((resolve) => setTimeout(resolve, 1000))]);
  }
  await new Promise((resolve) => upstream.close(resolve));
}
