# Verified Contact Card browser routes

The QR-V browser platform exposes Verified Contact Cards without adding another production hostname.

```text
GET  /products/verified-contact-card
GET  /verify/{qrvid}
GET  /vcard/{qrvid}.vcf
GET  /qr/{qrvid}.png
GET  /qr/{qrvid}.svg

GET  /issuer/vcards/new
POST /issuer/vcards/new
GET  /issuer/vcards/{qrvid}/edit
POST /issuer/vcards/{qrvid}/edit
GET  /issuer/vcards/{qrvid}/analytics
```

The platform never signs records or connects to PostgreSQL. It forwards authenticated issuer operations to `api.qrv.network`, renders only API-disclosed fields, and proxies VCF downloads so the public browser URL remains under `qrv.network`.

QR downloads use high error correction and support validated six-digit hexadecimal `dark` and `light` query parameters. Invalid color values fall back to QR-V's high-contrast defaults.
