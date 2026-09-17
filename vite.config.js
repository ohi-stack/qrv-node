import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const nodeTarget = process.env.QRV_NODE_TARGET || 'http://127.0.0.1:3000';
const proxiedOperationalRoutes = [
  '/api',
  '/verify',
  '/issuer',
  '/registry',
  '/healthz',
  '/health',
  '/readyz',
  '/version',
  '/metrics',
  '/qr',
  '/explorer',
  '/status',
  '/robots.txt',
  '/sitemap.xml',
  '/site.webmanifest'
];

const proxy = Object.fromEntries(
  proxiedOperationalRoutes.map((route) => [
    route,
    {
      target: nodeTarget,
      changeOrigin: false,
      secure: false
    }
  ])
);

export default defineConfig({
  root: 'src/web',
  plugins: [react()],
  server: {
    proxy
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    sourcemap: false
  }
});
