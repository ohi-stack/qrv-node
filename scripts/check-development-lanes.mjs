import { readFileSync, existsSync } from 'node:fs';

const configPath = 'config/development-lanes.json';
if (!existsSync(configPath)) throw new Error('Missing development lane configuration.');

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const vite = readFileSync('vite.config.js', 'utf8');
const agents = readFileSync('AGENTS.md', 'utf8');

const requiredLanes = ['chatgpt-sites', 'google-ai-studio', 'integration'];
for (const laneName of requiredLanes) {
  const lane = config.lanes?.[laneName];
  if (!lane) throw new Error(`Missing development lane: ${laneName}`);
  if (!lane.branch || !Number.isInteger(lane.webPort) || !Number.isInteger(lane.nodePort)) {
    throw new Error(`Incomplete development lane configuration: ${laneName}`);
  }
}

const branches = requiredLanes.map((name) => config.lanes[name].branch);
if (new Set(branches).size !== branches.length) throw new Error('Development lane branches must be unique.');
if (branches.includes(config.productionBranch)) throw new Error('A development lane cannot use the production branch.');

const ports = requiredLanes.flatMap((name) => [config.lanes[name].webPort, config.lanes[name].nodePort]);
if (new Set(ports).size !== ports.length) throw new Error('Development lane ports must be unique.');

for (const prefix of ['/verify', '/issuer', '/registry', '/api', '/healthz', '/readyz', '/version', '/qr', '/status']) {
  if (!config.protectedRoutePrefixes.includes(prefix)) throw new Error(`Missing protected route prefix: ${prefix}`);
}

for (const script of ['dev:chatgpt', 'dev:aistudio', 'dev:integration', 'check:lanes']) {
  if (!pkg.scripts?.[script]) throw new Error(`Missing package script: ${script}`);
}

if (!vite.includes('QRV_NODE_TARGET') || !vite.includes("'/verify'") || !vite.includes("'/issuer'") || !vite.includes("'/registry'")) {
  throw new Error('Vite development proxy does not preserve the Express operational boundary.');
}

for (const phrase of ['work/chatgpt-sites', 'work/google-ai-studio', 'integration/multi-builder']) {
  if (!agents.includes(phrase)) throw new Error(`AGENTS.md missing lane contract: ${phrase}`);
}

console.log('QR-V multi-builder development lane contract passed.');
