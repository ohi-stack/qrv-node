const allowPreview = process.env.QRV_ALLOW_SOURCE_PREVIEW === '1';

if (!allowPreview) {
  console.error('[QR-V] qrv-marketing-site is a source-only repository.');
  console.error('[QR-V] Production runtime ownership is locked to:');
  console.error('  qrv.network      -> ohi-stack/qrv-node');
  console.error('  api.qrv.network  -> ohi-stack/qrv-api');
  console.error('[QR-V] Use `npm run dev` for local source preview, or set QRV_ALLOW_SOURCE_PREVIEW=1 only in a non-production preview environment.');
  process.exit(1);
}

await import('../server.js');
