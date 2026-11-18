import { ensureQrvSchema, getQrvDatabase } from "@/db/qrv";

type Inquiry = {
  organization?: unknown;
  contactName?: unknown;
  email?: unknown;
  useCase?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return Response.json({ ok: false, error: "JSON_REQUIRED" }, { status: 415 });
  }

  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > 20_000) return Response.json({ ok: false, error: "REQUEST_TOO_LARGE" }, { status: 413 });

  let payload: Inquiry;
  try {
    payload = await request.json() as Inquiry;
  } catch {
    return Response.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  if (clean(payload.website, 120)) return Response.json({ ok: true, received: true });

  const organization = clean(payload.organization, 140);
  const contactName = clean(payload.contactName, 120);
  const email = clean(payload.email, 180).toLowerCase();
  const useCase = clean(payload.useCase, 100);
  const message = clean(payload.message, 2500);
  const consent = payload.consent === true;
  if (!organization || !contactName || !useCase || message.length < 20 || !consent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "VALIDATION_FAILED" }, { status: 400 });
  }

  try {
    await ensureQrvSchema();
    const db = getQrvDatabase();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await db.prepare("SELECT COUNT(*) AS count FROM issuer_inquiries WHERE email = ? AND created_at >= ?")
      .bind(email, since)
      .first<{ count: number }>();
    if ((recent?.count ?? 0) >= 5) return Response.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });

    const id = `QRV-INQ-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    await db.prepare(`INSERT INTO issuer_inquiries
      (id, organization, contact_name, email, use_case, message, consent, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW', ?)`)
      .bind(id, organization, contactName, email, useCase, message, 1, new Date().toISOString())
      .run();
    return Response.json({ ok: true, inquiryId: id, received: true }, { status: 201 });
  } catch {
    return Response.json({ ok: false, error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }
}
