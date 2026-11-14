import { fetchCanonicalApi } from "@/app/lib/canonical-api";

const publicHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-store",
};

export async function GET(_: Request, { params }: { params: Promise<{ qrvid: string }> }) {
  const { qrvid: raw } = await params;
  const qrvid = decodeURIComponent(raw).trim().toUpperCase();
  if (!/^QRV-[A-Z0-9][A-Z0-9-]{2,127}$/.test(qrvid)) {
    return Response.json({
      ok: false,
      status: "INVALID_IDENTIFIER",
      qrvid,
      error: { code: "INVALID_QRVID", message: "QRVID format is invalid" },
    }, { status: 422, headers: publicHeaders });
  }

  try {
    const upstream = await fetchCanonicalApi(`verify/${encodeURIComponent(qrvid)}`);
    const payload = await upstream.json().catch(() => ({ ok: false, status: "SERVICE_UNAVAILABLE", qrvid }));
    return Response.json(payload, { status: upstream.status, headers: publicHeaders });
  } catch {
    return Response.json({ ok: false, status: "SERVICE_UNAVAILABLE", qrvid }, { status: 503, headers: publicHeaders });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...publicHeaders, "Access-Control-Allow-Methods": "GET, OPTIONS" } });
}
