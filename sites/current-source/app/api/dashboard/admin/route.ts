import { dashboardIdentity } from '@/app/lib/dashboard-auth';
import { getQrvDatabase } from '@/db/qrv';
const headers = { 'Cache-Control': 'private, no-store' };
export async function GET() {
  const { user, isAdmin } = await dashboardIdentity();
  if (!isAdmin) return Response.json({ error: 'Access denied' }, { status: user ? 403 : 401, headers });
  try {
    const result = await getQrvDatabase().prepare('SELECT id, organization, contact_name, email, use_case, message, status, created_at FROM issuer_inquiries ORDER BY created_at DESC LIMIT 200').all();
    return Response.json({ inquiries: result.results }, { headers });
  } catch { return Response.json({ error: 'Inquiry storage is unavailable. Please retry.' }, { status: 503, headers }); }
}
export async function PATCH(request: Request) {
  const { user, isAdmin } = await dashboardIdentity();
  if (!isAdmin) return Response.json({ error: 'Access denied' }, { status: user ? 403 : 401, headers });
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Invalid origin' }, { status: 403, headers });
  try {
    const { id, status } = await request.json();
    if (typeof id !== 'string' || id.length > 100 || !['NEW', 'IN_REVIEW', 'CLOSED'].includes(status)) return Response.json({ error: 'Invalid update' }, { status: 400, headers });
    const result = await getQrvDatabase().prepare('UPDATE issuer_inquiries SET status = ? WHERE id = ?').bind(status, id).run();
    return Response.json({ ok: !!result.meta.changes }, { status: result.meta.changes ? 200 : 404, headers });
  } catch { return Response.json({ error: 'The update could not be saved.' }, { status: 503, headers }); }
}
