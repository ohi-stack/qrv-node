export const dynamic = 'force-dynamic';
import { requireChatGPTUser } from '../chatgpt-auth';
import { dashboardIdentity } from '../lib/dashboard-auth';
import Dashboard from './workspace';
export const metadata = { title: 'User Dashboard', robots: { index: false, follow: false } };
export default async function Page() {
  const user = await requireChatGPTUser('/dashboard');
  const { isAdmin } = await dashboardIdentity();
  return <Dashboard name={user.displayName} email={user.email} isAdmin={isAdmin} />;
}
