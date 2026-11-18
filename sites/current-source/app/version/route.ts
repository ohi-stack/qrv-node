const publicHeaders = { "Cache-Control": "no-store" };

export function GET() {
  return Response.json({
    service: "qrv-network-site",
    version: process.env.APP_VERSION || "sites-source",
    architecture: "two-node-consolidated",
    apiAuthority: "api.qrv.network",
  }, { headers: publicHeaders });
}
