const trim = (value) => String(value || '').replace(/\/+$/, '');

export const QRV_CONFIG = {
  appBaseUrl: trim(import.meta.env.VITE_APP_BASE_URL || 'https://qrv.network'),
  verifyBaseUrl: trim(import.meta.env.VITE_QRV_VERIFY_BASE_URL || 'https://qrv.network/verify'),
  issuerBaseUrl: trim(import.meta.env.VITE_QRV_ISSUER_BASE_URL || 'https://qrv.network/issuer'),
  registryBaseUrl: trim(import.meta.env.VITE_QRV_REGISTRY_BASE_URL || 'https://qrv.network/registry'),
  docsBaseUrl: trim(import.meta.env.VITE_QRV_DOCS_BASE_URL || 'https://qrv.network/docs'),
  developersBaseUrl: trim(import.meta.env.VITE_QRV_DEVELOPERS_BASE_URL || 'https://qrv.network/developers'),
  statusBaseUrl: trim(import.meta.env.VITE_QRV_STATUS_BASE_URL || 'https://qrv.network/status'),
  apiBaseUrl: trim(import.meta.env.VITE_QRV_API_BASE_URL || 'https://api.qrv.network/api/v1'),
  demoQrvid: import.meta.env.VITE_QRV_DEMO_QRVID || 'QRV-PROD-CERT-000001'
};

export const verifyUrl = (qrvid = QRV_CONFIG.demoQrvid) => `${QRV_CONFIG.verifyBaseUrl}/${encodeURIComponent(qrvid)}`;
