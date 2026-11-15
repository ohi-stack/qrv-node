// Read-only QR-V example adapted from the registry SDK and hiring-agent demo.
const qrvid = process.argv[2]?.trim().toUpperCase();
if (!qrvid || !/^QRV-[A-Z0-9][A-Z0-9-]{2,127}$/.test(qrvid)) {
  console.error('Usage: node examples/verify-record.mjs QRV-PROD-CERT-000001');
  process.exit(2);
}

try {
  const origin = process.env.QRV_API_ORIGIN || 'https://api.qrv.network';
  const url = new URL('/api/v1/verify/' + encodeURIComponent(qrvid), origin);
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) throw new Error('Expected a JSON response from the API');
  const result = await response.json();
  const status = result?.status ?? result?.state;
  if (typeof status !== 'string' || !/^[A-Z][A-Z_]{0,63}$/.test(status)) throw new Error('The API did not return a verification status');
  console.log(JSON.stringify({ requestedQrvid: qrvid, httpStatus: response.status, reportedStatus: status }));
  if (!response.ok) process.exitCode = 1;
} catch (error) {
  console.error('Verification lookup failed:', error.message);
  process.exitCode = 1;
}
