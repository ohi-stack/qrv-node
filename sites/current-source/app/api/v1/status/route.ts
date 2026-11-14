import { fetchCanonicalApi } from "@/app/lib/canonical-api";

const publicHeaders = { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" };

export async function GET() {
  const checkedAt = new Date().toISOString();
  try {
    const upstream = await fetchCanonicalApi("status");
    const payload = await upstream.json().catch(() => ({ ok: false, status: "SERVICE_UNAVAILABLE" }));
    return Response.json({ ...payload, checkedAt }, { status: upstream.status, headers: publicHeaders });
  } catch {
    return Response.json({ ok: false, checkedAt, status: "CANONICAL_API_UNAVAILABLE", services: [
      { name: "Public platform", endpoint: "qrv.network", status: "OPERATIONAL" },
      { name: "Canonical API/data authority", endpoint: "api.qrv.network", status: "ACTIVATION_PENDING" },
    ] }, { status: 503, headers: publicHeaders });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...publicHeaders, "Access-Control-Allow-Methods": "GET, OPTIONS" } });
}
