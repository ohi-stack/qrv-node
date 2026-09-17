import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../config/development-lanes.json', import.meta.url), 'utf8'));
const laneName = process.argv[2];
const lane = config.lanes[laneName];

if (!lane) {
  console.error(`Unknown development lane: ${laneName || '(missing)'}`);
  console.error(`Available lanes: ${Object.keys(config.lanes).join(', ')}`);
  process.exit(1);
}

const webHost = process.env.QRV_DEV_WEB_HOST || '127.0.0.1';
const nodeHost = process.env.QRV_DEV_NODE_HOST || '127.0.0.1';
const webOrigin = `http://${webHost}:${lane.webPort}`;
const nodeOrigin = `http://${nodeHost}:${lane.nodePort}`;
const apiBase = process.env.QRV_DEV_API_BASE_URL || 'http://127.0.0.1:3999/api/v1';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const server = spawn(process.execPath, ['--watch', 'server.js'], {
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: String(lane.nodePort),
    QRV_DEV_LANE: laneName,
    QRV_PLATFORM_ORIGIN: webOrigin,
    QRV_API_BASE_URL: apiBase
  },
  stdio: 'inherit'
});

const web = spawn(npm, ['run', 'dev:web', '--', '--host', '0.0.0.0', '--port', String(lane.webPort)], {
  env: {
    ...process.env,
    QRV_DEV_LANE: laneName,
    QRV_NODE_TARGET: nodeOrigin,
    VITE_APP_BASE_URL: webOrigin,
    VITE_QRV_API_BASE_URL: `${nodeOrigin}/api/v1`,
    VITE_QRV_VERIFY_BASE_URL: `${webOrigin}/verify`,
    VITE_QRV_REGISTRY_BASE_URL: `${webOrigin}/registry`,
    VITE_QRV_ISSUER_BASE_URL: `${webOrigin}/issuer`,
    VITE_QRV_DOCS_BASE_URL: `${webOrigin}/docs`,
    VITE_QRV_DEVELOPERS_BASE_URL: `${webOrigin}/developers`,
    VITE_QRV_STATUS_BASE_URL: `${webOrigin}/status`
  },
  stdio: 'inherit'
});

console.log(`QR-V development lane: ${laneName}`);
console.log(`Frontend: ${webOrigin}`);
console.log(`Express:  ${nodeOrigin}`);
console.log(`API:      ${apiBase}`);
console.log('Production secrets are not required and should not be supplied to this lane.');

let shuttingDown = false;
function stop(signal = 'SIGTERM') {
  if (shuttingDown) return;
  shuttingDown = true;
  server.kill(signal);
  web.kill(signal);
  setTimeout(() => process.exit(0), 150).unref();
}

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

for (const child of [server, web]) {
  child.on('exit', (code) => {
    if (!shuttingDown && code && code !== 0) {
      console.error(`A lane process exited with code ${code}.`);
      stop();
    }
  });
}
