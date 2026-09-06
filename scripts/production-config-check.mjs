const required = ['QRV_PLATFORM_ORIGIN', 'QRV_API_BASE_URL'];
const secrets = ['QRV_PLATFORM_API_KEY', 'SESSION_SECRET', 'ISSUER_ACCESS_CODE'];
const forbidden = ['DATABASE_URL', 'SUPABASE_SECRET_KEY', 'QRV_SIGNING_PRIVATE_KEY', 'QRV_WEBHOOK_SECRET'];
const errors = [];
const warnings = [];

for (const name of required) {
  if (!process.env[name]) errors.push(`${name} is required`);
}

if (process.env.QRV_PLATFORM_ORIGIN && process.env.QRV_PLATFORM_ORIGIN.replace(/\/$/, '') !== 'https://qrv.network') {
  errors.push('QRV_PLATFORM_ORIGIN must be https://qrv.network in production');
}
if (process.env.QRV_API_BASE_URL && process.env.QRV_API_BASE_URL.replace(/\/$/, '') !== 'https://api.qrv.network/api/v1') {
  errors.push('QRV_API_BASE_URL must be https://api.qrv.network/api/v1 in production');
}
for (const name of forbidden) {
  if (process.env[name]) errors.push(`${name} must not be configured on qrv-node`);
}
for (const name of secrets) {
  if (!process.env[name]) warnings.push(`${name} is not configured; issuer write/session capabilities must remain fail-closed`);
}
if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
  errors.push('SESSION_SECRET must be at least 32 characters');
}
if (process.env.QRV_PLATFORM_API_KEY && process.env.QRV_PLATFORM_API_KEY.length < 32) {
  errors.push('QRV_PLATFORM_API_KEY must be at least 32 characters');
}

const result = {
  service: 'qrv-platform',
  architecture: 'two-node-consolidated',
  platform: 'https://qrv.network',
  api: 'https://api.qrv.network/api/v1',
  ok: errors.length === 0,
  errors,
  warnings
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
