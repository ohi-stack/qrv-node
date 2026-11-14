import { fetchCanonicalRoot } from "@/app/lib/canonical-api";

const publicHeaders = { "Cache-Control": "no-store" };
const dependencyTimeoutMs = 3000;

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), dependencyTimeoutMs);
  try {
    const upstream = await fetchCanonicalRoot("readyz", { signal: controller.signal });
    const payload = await upstream.json().catch(() => ({}));
    const ready = upstream.ok && payload.ready === true;
    return Response.json({
      ready,
      service: "qrv-network-site",
      dependency: "api.qrv.network",
      dependencyStatus: upstream.status,
    }, { status: ready ? 200 : 503, headers: publicHeaders });
  } catch {
    return Response.json({
      ready: false,
      service: "qrv-network-site",
      dependency: "api.qrv.network",
      dependencyStatus: "unreachable",
    }, { status: 503, headers: publicHeaders });
  } finally {
    clearTimeout(timeout);
  }
}
