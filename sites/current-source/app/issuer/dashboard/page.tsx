import type { Metadata } from "next";
import { requireChatGPTUser } from "../../chatgpt-auth";
import IssuerDashboard from "./workspace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issuer Dashboard",
  description: "Authenticated QR-V issuer workspace for records, verification activity, and controlled operations.",
  robots: { index: false, follow: false },
};

export default async function IssuerDashboardPage() {
  const user = await requireChatGPTUser("/issuer/dashboard");
  return <IssuerDashboard name={user.displayName} email={user.email} />;
}
