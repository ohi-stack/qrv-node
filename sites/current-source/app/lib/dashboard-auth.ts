import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../chatgpt-auth';
export async function dashboardIdentity() {
  const user = await getChatGPTUser();
  const configured = (env as unknown as { QRV_ADMIN_EMAILS?: string }).QRV_ADMIN_EMAILS || process.env.QRV_ADMIN_EMAILS || '';
  const admins = configured.split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  return { user, isAdmin: !!user && admins.includes(user.email.toLowerCase()) };
}
