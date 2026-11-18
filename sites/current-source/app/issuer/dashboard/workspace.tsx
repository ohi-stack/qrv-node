"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { chatGPTSignOutPath } from "../../chatgpt-auth-client";

type NetworkState = "CHECKING" | "OPERATIONAL" | "PARTIAL" | "UNAVAILABLE";

type StatusPayload = {
  status?: string;
  ok?: boolean;
  services?: Array<{ name?: string; status?: string }>;
};

const issuerTools = [
  { index: "01", label: "Records", description: "Review issuer-owned records, identifiers, and current lifecycle state.", href: "/contact", action: "Request activation" },
  { index: "02", label: "Issue record", description: "Create a governed record after issuer scope and credentials are approved.", href: "/contact", action: "Start onboarding" },
  { index: "03", label: "Revocations", description: "Withdraw a record with a public-safe reason and preserved audit trail.", href: "/docs", action: "Read the workflow" },
  { index: "04", label: "Analytics", description: "Track verification volume, lifecycle outcomes, and record health over time.", href: "/contact", action: "Connect data" },
  { index: "05", label: "API keys", description: "Manage server-side integrations and keep mutation credentials out of the browser.", href: "/developers", action: "Review API model" },
  { index: "06", label: "Team and billing", description: "Plan roles, organization access, subscriptions, and operating contacts.", href: "/pricing", action: "Review plans" },
];

function statusLabel(state: NetworkState) {
  if (state === "OPERATIONAL") return "Operational";
  if (state === "PARTIAL") return "Partially available";
  if (state === "UNAVAILABLE") return "Unavailable";
  return "Checking";
}

function NetworkWidget() {
  const [state, setState] = useState<NetworkState>("CHECKING");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/status", { cache: "no-store", headers: { accept: "application/json" } })
      .then(async response => ({ response, payload: await response.json().catch(() => ({})) as StatusPayload }))
      .then(({ response, payload }) => {
        if (cancelled) return;
        const overall = String(payload.status || "").toUpperCase();
        const services = (Array.isArray(payload.services) ? payload.services : []).map(service => String(service.status || "").toUpperCase());
        if (!response.ok || overall.includes("UNAVAILABLE")) {
          setState("UNAVAILABLE");
        } else if (services.some(value => value.includes("PENDING")) || overall.includes("PENDING")) {
          setState("PARTIAL");
        } else if (payload.ok || overall.includes("OPERATIONAL") || overall === "OK") {
          setState("OPERATIONAL");
        } else {
          setState("PARTIAL");
        }
      })
      .catch(() => {
        if (!cancelled) setState("UNAVAILABLE");
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <article className="issuer-widget issuer-network-widget">
      <div className="issuer-widget-heading"><span className={`issuer-status-dot issuer-status-${state.toLowerCase()}`} /><span>Network health</span><b>{statusLabel(state)}</b></div>
      <strong>{state === "OPERATIONAL" ? "Public services are responding." : "Canonical status is disclosed live."}</strong>
      <p>qrv.network is the public platform; api.qrv.network remains the trusted API, registry, cryptography, and audit authority.</p>
      <Link href="/status">Open network status →</Link>
    </article>
  );
}

function VerificationChart() {
  return (
    <div className="issuer-chart-wrap">
      <div className="issuer-chart-meta"><span>Last 30 days</span><strong>Live issuer data not connected</strong></div>
      <div className="issuer-chart" role="img" aria-label="Verification activity chart awaiting issuer data">
        <svg viewBox="0 0 640 190" preserveAspectRatio="none" aria-hidden="true">
          {[28, 66, 104, 142].map(y => <line key={y} x1="0" x2="640" y1={y} y2={y} />)}
          {[0, 106, 213, 320, 426, 533, 640].map(x => <line key={x} x1={x} x2={x} y1="0" y2="160" />)}
          <path d="M0 160H640" className="issuer-chart-baseline" />
        </svg>
        <div className="issuer-chart-empty"><strong>No issuer event data yet</strong><span>Connect an approved issuer account to populate verification activity.</span></div>
      </div>
      <div className="issuer-chart-axis"><span>30d ago</span><span>15d ago</span><span>Today</span></div>
    </div>
  );
}

function LifecycleWidget() {
  const steps = [
    ["01", "Authorize", "Issuer identity and record scope"],
    ["02", "Issue", "Canonical record creation"],
    ["03", "Verify", "Public status and integrity"],
    ["04", "Revoke", "Controlled lifecycle change"],
  ];
  return (
    <article className="issuer-panel issuer-lifecycle-panel">
      <div className="issuer-panel-heading"><div><p className="issuer-eyebrow">Governed lifecycle</p><h2>Issue → verify → revoke</h2></div><Link href="/how-it-works">View model ↗</Link></div>
      <div className="issuer-lifecycle">{steps.map(([index, title, description]) => <div key={index}><b>{index}</b><strong>{title}</strong><span>{description}</span></div>)}</div>
    </article>
  );
}

export default function IssuerDashboard({ name, email }: { name: string; email: string }) {
  return (
    <div className="issuer-app">
      <aside className="issuer-sidebar">
        <Link href="/" className="issuer-brand">QR-V<span>Global Verification Network</span></Link>
        <p className="issuer-sidebar-eyebrow">ISSUER CONTROL</p>
        <nav aria-label="Issuer dashboard navigation">
          <Link className="active" aria-current="page" href="/issuer/dashboard">Overview</Link>
          <Link href="/issuer">Issuer access</Link>
          <Link href="/verify">Public verifier</Link>
          <Link href="/registry">Public registry</Link>
          <Link href="/developers">API and integrations</Link>
          <Link href="/docs">Documentation</Link>
          <Link href="/status">Network status</Link>
        </nav>
        <div className="issuer-account"><strong>{name}</strong><span>{email}</span><span className="issuer-account-state">ChatGPT identity verified</span><a target="_top" href={chatGPTSignOutPath()}>Sign out</a></div>
      </aside>

      <main className="issuer-main">
        <header className="issuer-topbar"><span>QR-V network / issuer dashboard</span><Link href="/">Back to website ↗</Link></header>
        <section className="issuer-heading">
          <div><p className="issuer-eyebrow">Issuer workspace</p><h1>Control the record lifecycle.</h1><p>Monitor issuer operations, verification activity, record health, and access readiness from one governed workspace.</p></div>
          <div className="issuer-heading-actions"><Link className="issuer-button issuer-button-primary" href="/contact">Request issuer activation</Link><Link className="issuer-button issuer-button-quiet" href="/verify">Verify a record</Link></div>
        </section>

        <section className="issuer-notice" aria-label="Issuer authorization status"><span>!</span><div><strong>Issuer authorization is separate from ChatGPT sign-in.</strong><p>This dashboard shell is ready for canonical issuer metrics. Issuance, revocation, API keys, and registry mutations require approved issuer credentials and server-side authorization.</p></div><Link href="/contact">Request access →</Link></section>

        <section className="issuer-kpis" aria-label="Issuer summary widgets">
          <article className="issuer-kpi"><span>Records issued</span><strong>—</strong><small>Awaiting issuer API connection</small></article>
          <article className="issuer-kpi"><span>Active records</span><strong>—</strong><small>Canonical registry data</small></article>
          <article className="issuer-kpi"><span>Verification rate</span><strong>—</strong><small>Event stream not connected</small></article>
          <article className="issuer-kpi"><span>Revocations</span><strong>—</strong><small>Lifecycle data unavailable</small></article>
        </section>

        <section className="issuer-network-row" aria-label="Network status widget"><NetworkWidget /></section>

        <section className="issuer-dashboard-grid">
          <article className="issuer-panel issuer-chart-panel"><div className="issuer-panel-heading"><div><p className="issuer-eyebrow">Performance</p><h2>Verification activity</h2></div><span className="issuer-panel-tag">Awaiting data</span></div><VerificationChart /></article>
          <article className="issuer-panel issuer-health-panel"><div className="issuer-panel-heading"><div><p className="issuer-eyebrow">Record health</p><h2>Lifecycle state</h2></div><Link href="/docs">Definitions ↗</Link></div><div className="issuer-health-list">{[["Verified", "Publicly accepted", "verified"], ["Active", "Within validity window", "active"], ["Expiring", "Needs review", "expiring"], ["Revoked", "No longer accepted", "revoked"]].map(([label, description, tone]) => <div key={label}><div><strong>{label}</strong><span>—</span></div><small>{description}</small><div className="issuer-health-bar"><i className={`issuer-health-${tone}`} /></div></div>)}</div></article>
        </section>

        <LifecycleWidget />

        <section className="issuer-panel issuer-activity-panel"><div className="issuer-panel-heading"><div><p className="issuer-eyebrow">Operational feed</p><h2>Recent issuer activity</h2></div><button className="issuer-button issuer-button-quiet" type="button" disabled>Refresh</button></div><div className="issuer-empty"><span className="issuer-empty-mark">⌁</span><strong>No issuer activity loaded</strong><p>Connect an approved issuer account to see issued records, verification events, revocations, and audit entries here.</p><Link href="/contact">Connect issuer account →</Link></div></section>

        <section className="issuer-tools-section"><div className="issuer-section-heading"><div><p className="issuer-eyebrow">Issuer tools</p><h2>Everything needed to operate responsibly.</h2></div><p>Each tool stays behind the issuer authorization boundary and writes only through the canonical API and registry authority.</p></div><div className="issuer-tools-grid">{issuerTools.map(tool => <article className="issuer-tool" key={tool.index}><b>{tool.index}</b><h3>{tool.label}</h3><p>{tool.description}</p><Link href={tool.href}>{tool.action} ↗</Link></article>)}</div></section>

        <section className="issuer-security-panel"><div><p className="issuer-eyebrow">Security boundary</p><h2>Public verification stays open. Issuer mutations stay controlled.</h2></div><div className="issuer-security-list"><span><b>Identity</b> ChatGPT user identity is not issuer authority.</span><span><b>Authority</b> Organization, issuer, role, and permissions are checked server-side.</span><span><b>Secrets</b> Signing keys, API credentials, and registry writes stay off the public frontend.</span></div></section>
      </main>
    </div>
  );
}
