const publicHeaders = { "Cache-Control": "no-store" };

export function GET() {
  return Response.json({
    ok: true,
    service: "qrv-network-site",
    architecture: "two-node-consolidated",
  }, { headers: publicHeaders });
}
