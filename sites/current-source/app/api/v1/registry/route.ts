import { fetchCanonicalApi } from "@/app/lib/canonical-api";

const publicHeaders = { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    const search = query.get("q")?.trim().slice(0, 80) ?? "";
    const upstream = await fetchCanonicalApi(`registry${search ? `?q=${encodeURIComponent(search)}` : ""}`);
    const payload = await upstream.json().catch(() => ({ ok: false, status: "REGISTRY_SEARCH_UNAVAILABLE", records: [] }));
    return Response.json(payload, { status: upstream.status, headers: publicHeaders });
  } catch {
    return Response.json({ ok: false, status: "REGISTRY_SEARCH_UNAVAILABLE", records: [] }, { status: 503, headers: publicHeaders });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...publicHeaders, "Access-Control-Allow-Methods": "GET, OPTIONS" } });
}
