export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { requireChatGPTUser } from '../chatgpt-auth';
import { dashboardIdentity } from '../lib/dashboard-auth';
import AdminWorkspace from './workspace';
export const metadata = { title: 'Admin Dashboard', robots: { index: false, follow: false } };
export default async function Page() {
  const user = await requireChatGPTUser('/admin');
  const { isAdmin } = await dashboardIdentity();
  if (!isAdmin) return <main className="dash-denied"><h1>Administrator access required</h1><p>Your account does not have access to this workspace.</p><Link href="/dashboard">Return to your dashboard</Link></main>;
  return <AdminWorkspace name={user.displayName} email={user.email} />;
}
