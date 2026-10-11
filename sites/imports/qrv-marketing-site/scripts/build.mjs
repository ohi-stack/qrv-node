import { execFileSync } from 'node:child_process';

execFileSync(process.execPath, ['scripts/check.mjs'], { stdio: 'inherit' });
execFileSync('npx', ['vite', 'build'], { stdio: 'inherit' });
console.log('QR-V marketing site build passed.');
