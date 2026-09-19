"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "./Link.jsx";
import { Footer, Header, QRMark } from "./qrv-app";
import { formatNewsDate, getNewsPost, newsCategories, newsPosts } from "./news-data";

const DEMO_ID = "QRV-PROD-CERT-000001";

type RecordStatus = "VERIFIED" | "REVOKED" | "EXPIRED" | "NOT_FOUND" | "INVALID_SIGNATURE" | "INVALID_IDENTIFIER" | "SERVICE_UNAVAILABLE";

type VerificationRecord = {
  status: RecordStatus;
  qrvid: string;
  issuer?: string;
  issuerCode?: string;
  subject?: string;
  title?: string;
  issuedAt?: string;
  expiresAt?: string;
  resolvedAt?: string;
  reason?: string;
  integrity?: {
    hashAlgorithm: string;
    hashValid: boolean;
    signatureState: "PENDING_ED25519" | "VALID" | "INVALID";
    signatureValid: boolean | null;
  };
};

function displayDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(date);
}

function PageShell({ children }: { children: ReactNode }) {
  return <div className="site-shell"><Header /><main>{children}</main><Footer /></div>;
}

function SubHero({ eyebrow, title, text, actions }: { eyebrow: string; title: string; text: string; actions?: ReactNode }) {
  return (
    <section className="subhero">
      <div className="network-pattern" aria-hidden="true" />
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        {actions && <div className="hero-actions">{actions}</div>}
      </div>
    </section>
  );
}

function Breadcrumb({ current }: { current: string }) {
  return <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><b>{current}</b></div>;
}

function VerificationResult({ record, loading }: { record: VerificationRecord | null; loading: boolean }) {
  if (loading) return <article className="result-panel loading" aria-live="polite"><div className="result-header"><span className="result-symbol">…</span><div><span className="field-label">Verification request</span><h2>Resolving registry record</h2><p>Checking the live public registry and integrity state.</p></div></div></article>;
  if (!record) return null;
  const positive = record.status === "VERIFIED";
  const tone = record.status.toLowerCase().replace("_", "-");
  const statusCopy: Record<RecordStatus, { title: string; note: string }> = {
    VERIFIED: { title: "Record verified", note: "The registry record is active and its stored integrity checks are valid." },
    REVOKED: { title: "Record revoked", note: "The issuing organization withdrew this record. It should no longer be accepted as active." },
    EXPIRED: { title: "Record expired", note: "The record was issued legitimately but its defined validity period has ended." },
    NOT_FOUND: { title: "No record found", note: "Confirm the QRVID and try again. A missing record should not be treated as verified." },
    INVALID_SIGNATURE: { title: "Integrity validation failed", note: "The record signature did not validate. Do not rely on this record." },
    INVALID_IDENTIFIER: { title: "Invalid identifier", note: "Enter a QRVID in the published QR-V identifier format and try again." },
    SERVICE_UNAVAILABLE: { title: "Verification unavailable", note: "The registry could not complete this request. Do not treat the record as verified; try again shortly." },
  };
  return (
    <article className={`result-panel ${tone}`} aria-live="polite">
      <div className="result-header">
        <span className="result-symbol">{positive ? "✓" : record.status === "EXPIRED" ? "!" : "×"}</span>
        <div><span className="field-label">Verification result</span><h2>{statusCopy[record.status].title}</h2><p>{statusCopy[record.status].note}</p></div>
        <strong>{record.status.replace("_", " ")}</strong>
      </div>
      {record.status !== "NOT_FOUND" && (
        <>
          <div className="result-record">
            <QRMark />
            <dl>
              <div><dt>QRVID</dt><dd className="mono">{record.qrvid}</dd></div>
              {record.issuer && <div><dt>Issuer</dt><dd>{record.issuer}</dd></div>}
              {record.issuerCode && <div><dt>Issuer code</dt><dd className="mono">{record.issuerCode}</dd></div>}
              {record.subject && <div><dt>Recipient</dt><dd>{record.subject}</dd></div>}
              {record.title && <div><dt>Record title</dt><dd>{record.title}</dd></div>}
              {record.issuedAt && <div><dt>Issued</dt><dd>{displayDate(record.issuedAt)}</dd></div>}
              {record.expiresAt && <div><dt>Expiration</dt><dd>{displayDate(record.expiresAt)}</dd></div>}
              {record.reason && <div><dt>Public reason</dt><dd>{record.reason}</dd></div>}
            </dl>
          </div>
          <div className="integrity-grid">
            <div><span>{record.integrity?.hashValid ? "✓" : "×"}</span><small>Record hash</small><strong>{record.integrity?.hashValid ? "Valid" : "Not accepted"}</strong></div>
            <div><span>{record.integrity?.signatureValid === false ? "×" : record.integrity?.signatureValid ? "✓" : "—"}</span><small>Issuer signature</small><strong>{record.integrity?.signatureValid === false ? "Invalid" : record.integrity?.signatureValid ? "Valid" : "Ed25519 pending"}</strong></div>
            <div><span>{positive ? "✓" : "—"}</span><small>Registry state</small><strong>{record.status}</strong></div>
          </div>
        </>
      )}
      <div className="result-foot"><span>{record.resolvedAt ? `Resolved ${displayDate(record.resolvedAt)}` : "No public registry record matched this identifier."}</span><span>Protocol QRVP-1 · Standard QVS-1.0</span></div>
    </article>
  );
}

function VerifyPage({ path, initialQueryId }: { path: string; initialQueryId?: string }) {
  const pathId = path.startsWith("verify/") ? decodeURIComponent(path.slice(7)) : "";
  const startingId = pathId || initialQueryId || DEMO_ID;
  const [queryId, setQueryId] = useState(startingId);
  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  async function resolveRecord(value: string) {
    const normalized = value.trim().toUpperCase();
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/verify/${encodeURIComponent(normalized)}`, { cache: "no-store" });
      const data = await response.json() as VerificationRecord;
      setRecord({ ...data, qrvid: data.qrvid || normalized });
    } catch {
      setRecord({ status: "SERVICE_UNAVAILABLE", qrvid: normalized });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void resolveRecord(startingId); }, 0);
    return () => window.clearTimeout(timer);
  }, [startingId]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = queryId.trim().toUpperCase();
    window.history.replaceState({}, "", `/verify/${encodeURIComponent(normalized)}`);
    void resolveRecord(normalized);
  }

  function runPublicTest(id: string) {
    setQueryId(id);
    window.history.replaceState({}, "", `/verify/${encodeURIComponent(id)}`);
    void resolveRecord(id);
  }

  return (
    <PageShell>
      <SubHero eyebrow="Live public verifier" title="Verify a QR‑V record." text="Enter the QRVID printed beneath the code. QR‑V resolves the live public registry, checks stored integrity and returns the record’s current status." />
      <section className="subpage-content verify-page">
        <Breadcrumb current="Verify a record" />
        <form className="verification-form" onSubmit={submit}>
          <label htmlFor="verification-id">QR‑V identifier</label>
          <div><input id="verification-id" value={queryId} onChange={(event) => setQueryId(event.target.value)} spellCheck={false} autoCapitalize="characters" required /><button className="button" disabled={loading}>{loading ? "Checking…" : "Verify record"}</button></div>
          <p>Public test records: <button type="button" onClick={() => runPublicTest(DEMO_ID)}>Verified</button> · <button type="button" onClick={() => runPublicTest("QRV-PROD-CERT-000002")}>Revoked</button> · <button type="button" onClick={() => runPublicTest("QRV-PROD-CERT-000003")}>Expired</button> · <button type="button" onClick={() => runPublicTest("QRV-TEST-CERT-BADSIG")}>Invalid signature</button></p>
        </form>
        <VerificationResult record={record} loading={loading} />
        <div className="privacy-note"><strong>Public-safe verification</strong><p>Only fields authorized for public disclosure are returned. Do not place private personal data directly inside a QR image.</p></div>
      </section>
    </PageShell>
  );
}

const protocolSteps = [
  ["Identifier", "QRV-{ENV}-{TYPE}-{SEQUENCE}", "A deterministic identifier that states environment, record class and sequence."],
  ["Resolver", "HTTPS + qrv://", "Routes the reference to the authorized verification endpoint and registry namespace."],
  ["Registry", "Canonical record", "Stores issuer, subject, state, timestamps, privacy, hash and signature references."],
  ["Integrity", "SHA-256 active · Ed25519 pending", "Canonical JSON hashing is active. Ed25519 signing and validation remain a required production gate."],
  ["Status", "Deterministic response", "Returns VERIFIED, REVOKED, EXPIRED, NOT_FOUND, INVALID_SIGNATURE or another defined state."],
];

function ProtocolPage() {
  return (
    <PageShell>
      <SubHero eyebrow="QRVP-1 protocol" title="The trust layer behind every QR‑V scan." text="QRVP-1 defines how identifiers, resolvers, registries, issuers, signatures, privacy controls, revocation and verification responses work together." actions={<><Link className="button" href="/docs">Read documentation</Link><Link className="button button-outline" href="/developers">Developer access</Link></>} />
      <section className="subpage-content">
        <Breadcrumb current="QR-V Protocol" />
        <div className="content-heading"><p className="eyebrow">Protocol model</p><h2>From physical mark to canonical truth.</h2><p>QR‑V does not treat the QR image as proof. It treats the image as an entry point into a controlled verification process.</p></div>
        <div className="protocol-flow">{["QR code","QRVID","Resolver","Verification API","Registry","Integrity result"].map((item, i) => <div key={item}><span>{String(i+1).padStart(2,"0")}</span><strong>{item}</strong>{i < 5 && <i>→</i>}</div>)}</div>
        <div className="protocol-list">{protocolSteps.map(([title, code, text]) => <article key={title}><span>{title}</span><code>{code}</code><p>{text}</p></article>)}</div>
        <div className="standards-band"><div><span>Primary protocol</span><strong>QRVP-1</strong></div><div><span>Verification standard</span><strong>QVS-1.0</strong></div><div><span>Initial record class</span><strong>CERT</strong></div><div><span>Production namespace</span><strong>qrv.network</strong></div></div>
      </section>
    </PageShell>
  );
}

function HowPage() {
  const steps = [
    ["1", "Issue", "An approved issuer creates a record under its authorized organization account."],
    ["2", "Canonicalize", "The system normalizes the record into the protocol’s stable data structure."],
    ["3", "Protect", "The canonical record is hashed with SHA-256. Ed25519 signing remains the next production gate."],
    ["4", "Register", "The canonical record, integrity references and audit event are stored."],
    ["5", "Generate", "A QR image is generated containing the public verification URL—not private data."],
    ["6", "Verify", "A scan resolves issuer authority, current state, expiration and stored hash integrity."],
    ["7", "Revoke", "An authorized issuer can withdraw a record and preserve the lifecycle audit trail."],
  ];
  return (
    <PageShell>
      <SubHero eyebrow="Lifecycle" title="Issue → scan → verify → revoke." text="The platform is designed around one dependable lifecycle: create an authoritative record, make it scannable, resolve it publicly and preserve every material change." />
      <section className="subpage-content">
        <Breadcrumb current="How it works" />
        <div className="timeline">{steps.map(([n,title,text]) => <article key={n}><span>{n}</span><div><h2>{title}</h2><p>{text}</p></div></article>)}</div>
        <div className="callout"><p className="eyebrow light">Core implementation rule</p><h2>Do not expand until issuance → VERIFIED → revocation → REVOKED works reliably.</h2></div>
      </section>
    </PageShell>
  );
}

type RegistryRecord = { qrvid: string; title: string; issuer: string; issuerCode: string; status: string; updatedAt: string };

function RegistryPage() {
  const [term, setTerm] = useState("");
  const [records, setRecords] = useState<RegistryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<"checking" | "available" | "unavailable">("checking");

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/v1/registry?q=${encodeURIComponent(term)}`, { cache: "no-store", signal: controller.signal });
          if (!response.ok) {
            setRecords([]);
            setAvailability("unavailable");
            return;
          }
          const data = await response.json() as { records?: RegistryRecord[] };
          setRecords(data.records ?? []);
          setAvailability("available");
        } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setRecords([]);
          setAvailability("unavailable");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 180);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [term]);

  const issuerCount = new Set(records.map(record => record.issuerCode)).size;
  return (
    <PageShell>
      <SubHero eyebrow="Live public registry" title="Search canonical public records." text="The registry returns public QR‑V records, identified issuers and each record’s current verification state." />
      <section className="subpage-content">
        <Breadcrumb current="Registry" />
        <div className="registry-search"><label htmlFor="registry-search">Search by QRVID, title or issuer</label><input id="registry-search" value={term} onChange={e => setTerm(e.target.value)} placeholder="Search the public registry" /></div>
        <div className="registry-table">
          <div><span>QRVID</span><span>Record</span><span>Issuer</span><span>Status</span></div>
          {loading && <div className="registry-state"><span>Checking the live registry…</span></div>}
          {!loading && records.map(record => <Link href={`/verify/${record.qrvid}`} key={record.qrvid}><b>{record.qrvid}</b><span>{record.title}</span><span>{record.issuer}</span><i className={record.status.toLowerCase()}>{record.status.replace("_", " ")}</i></Link>)}
          {!loading && availability === "unavailable" && <div className="registry-state"><strong>Canonical registry search is not available.</strong><span>The public API/data authority has not exposed registry search for this release. Verify a QRVID directly while this capability is activated.</span></div>}
          {!loading && availability === "available" && records.length === 0 && <div className="registry-state"><span>No public records match this search.</span></div>}
        </div>
        <div className="registry-stats"><div><strong>{availability === "available" ? records.length : "—"}</strong><span>Records returned</span></div><div><strong>{availability === "available" ? issuerCount : "—"}</strong><span>Issuers represented</span></div><div><strong>Public</strong><span>Disclosure mode</span></div><div><strong>QRVP-1</strong><span>Protocol baseline</span></div></div>
      </section>
    </PageShell>
  );
}

function UseCasesPage() {
  const cases = [
    ["CERT","Verified certificates","Diplomas, course completion, licenses, compliance certificates, awards and professional credentials.",["Education","Training","Licensing"]],
    ["ID","Membership and identity","Organization-issued membership standing and public-safe credential status.",["Associations","Communities","Programs"]],
    ["DOC","Documents","Registry references for agreements, notices, policies, certifications and controlled documents.",["Legal records","Compliance","Policies"]],
    ["PROD","Product authenticity","Origin, warranty, authenticity and chain-of-custody verification at the point of scan.",["Manufacturing","Retail","Luxury goods"]],
    ["ASSET","Property and assets","Structured references for accountable property, equipment and asset records.",["Real estate","Equipment","Inventory"]],
    ["EVENT","Event credentials","Time-bound credentials, tickets, participation records and attendance certificates.",["Events","Conferences","Programs"]],
  ];
  return (
    <PageShell>
      <SubHero eyebrow="Product use cases" title="One protocol. Multiple record classes." text="QR‑V begins with verified certificates because they exercise the complete lifecycle. The same infrastructure can support additional authorized record classes." />
      <section className="subpage-content">
        <Breadcrumb current="Use cases" />
        <div className="case-list">{cases.map(([code,title,text,tags]) => <article id={(code as string).toLowerCase()} key={code as string}><span>{code as string}</span><div><h2>{title as string}</h2><p>{text as string}</p><div>{(tags as string[]).map(tag => <i key={tag}>{tag}</i>)}</div></div><Link href="/contact">Discuss implementation →</Link></article>)}</div>
      </section>
    </PageShell>
  );
}

function DevelopersPage() {
  const endpoints = [
    ["GET","https://api.qrv.network/healthz","Check the canonical API service"],
    ["GET","https://api.qrv.network/api/v1/status","Check the canonical registry authority"],
    ["GET","https://api.qrv.network/api/v1/verify/:qrvid","Verify a public record"],
    ["GET","https://qrv.network/api/v1/verify/:qrvid","Compatibility proxy for browser integrations"],
    ["POST","/api/v1/contact","Submit an issuer implementation inquiry"],
  ];
  return (
    <PageShell>
      <SubHero eyebrow="Developer portal" title="Build against a deterministic verification contract." text="The public launch API exposes live verification and service-status endpoints. Registry search, protected issuance and revocation remain activation-gated capabilities until their canonical routes and acceptance evidence are live." actions={<Link className="button" href="/docs">Read implementation docs</Link>} />
      <section className="subpage-content developer-page">
        <Breadcrumb current="Developers" />
        <div className="developer-layout">
          <div><div className="content-heading"><p className="eyebrow">Quick start</p><h2>Verify through the canonical API authority.</h2></div><pre className="large-code"><code><span>curl</span>{` https://api.qrv.network/api/v1/verify/${DEMO_ID}\n\n{\n  "ok": true,\n  "status": `}<b>&quot;VERIFIED&quot;</b>{`,\n  "qrvid": "${DEMO_ID}",\n  "integrity": {\n    "hashValid": true,\n    "signatureValid": null,\n    "signatureState": "PENDING_ED25519"\n  }\n}`}</code></pre></div>
          <aside><strong>Standards baseline</strong><dl><div><dt>Protocol</dt><dd>QRVP-1</dd></div><div><dt>Standard</dt><dd>QVS-1.0</dd></div><div><dt>Hash</dt><dd>SHA-256 active</dd></div><div><dt>Signature</dt><dd>Ed25519 activation pending</dd></div><div><dt>API style</dt><dd>REST / JSON</dd></div></dl></aside>
        </div>
        <div className="endpoint-table"><div><span>Method</span><span>Endpoint</span><span>Purpose</span></div>{endpoints.map(([method,url,purpose]) => <div key={url}><b className={method.toLowerCase()}>{method}</b><code>{url}</code><span>{purpose}</span></div>)}</div>
      </section>
    </PageShell>
  );
}

function IssuerPage() {
  const previewRecords = [
    ["QRV-…-000001", "Safety Certificate", "Verified"],
    ["QRV-…-000142", "Member Credential", "Verified"],
    ["QRV-…-000889", "Compliance Award", "Expired"],
  ];
  return (
    <PageShell>
      <SubHero eyebrow="Issuer access" title="Prepare to control the complete record lifecycle." text="The issuer program is structured for approved organizations to issue certificates, manage records, generate QR assets, control team access and revoke records under documented authority." actions={<><Link className="button" href="/contact">Request issuer access</Link><Link className="button button-outline" href="/pricing">Compare plans</Link></>} />
      <section className="subpage-content">
        <Breadcrumb current="Issuer access" />
        <div className="issuer-dashboard-full">
          <div className="console-sidebar"><strong>QR‑V</strong>{["Overview","Records","Issue record","Certificates","QR codes","Revocations","Analytics","API keys","Team","Billing","Settings"].map((x,i)=><span className={i===0?"active":""} key={x}>{x}</span>)}</div>
          <div className="console-main"><div className="console-title"><div><small>Illustrative issuer workspace</small><h2>Issuer overview</h2></div><Link className="button" href="/contact">Request access</Link></div><div className="console-metrics"><div><span>Records issued</span><strong>1,284</strong><small>Sample data</small></div><div><span>Active records</span><strong>1,231</strong><small>Sample data</small></div><div><span>Verifications</span><strong>8,421</strong><small>Sample data</small></div><div><span>Revoked</span><strong>12</strong><small>Sample data</small></div></div><div className="console-activity"><div><strong>Illustrative records</strong><Link href="/registry">View live registry</Link></div>{previewRecords.map(row=><div key={row[0]}><code>{row[0]}</code><span>{row[1]}</span><i className={row[2].toLowerCase()}>{row[2]}</i></div>)}</div></div>
        </div>
        <div className="feature-grid">{[["Issue","Guided certificate and record creation with validation and preview."],["Generate","QRVID, QR image and downloadable certificate assets."],["Manage","Records, expirations, privacy levels and issuer-owned metadata."],["Revoke","Controlled revocation with public-safe reason and audit trail."],["Analyze","Verification volume, top records, trends and lifecycle metrics."],["Control","Role-based team access, API keys and organization settings."]].map(([t,p])=><article key={t}><span>✓</span><h3>{t}</h3><p>{p}</p></article>)}</div>
        <div className="pilot-notice"><div><p className="eyebrow">Issuer onboarding</p><h2>Start with an approved pilot.</h2><p>Issuer authority must be reviewed before an organization can create public records. Pilot onboarding establishes identity, record scope, operating contacts and implementation requirements.</p></div><Link className="button" href="/contact">Request pilot review</Link></div>
      </section>
    </PageShell>
  );
}

const stripeCheckout = {
  "Starter Issuer": "https://buy.stripe.com/14A8wI3pH8dubfBd0g0sU03",
  "Growth Issuer": "https://buy.stripe.com/3cI9AM0dv1P6bfB7FW0sU04",
  "Professional Issuer": "https://buy.stripe.com/eVqcMYbWdctKabx8K00sU05",
  "Developer API Plan": "https://buy.stripe.com/14AbIU0dv1P6cjF2lC0sU06",
  "Business API Plan": "https://buy.stripe.com/4gM8wI2lDbpG2J57FW0sU07",
  "QR-V Certificate Verification System": "https://buy.stripe.com/fZufZa2lD2Ta97td0g0sU02",
  "QR-V Membership & ID Verification": "https://buy.stripe.com/6oU6oAe4l9hy2J52lC0sU08",
  "QR-V Product Authenticity Suite": "https://buy.stripe.com/00wcMY5xP3XefvRaS80sU09",
} as const;

function PricingTable({
  headers = ["Product / Service", "Price", "Includes / Limit"],
  rows,
}: {
  headers?: string[];
  rows: string[][];
}) {
  return (
    <div className="pricing-table-wrap">
      <table className="pricing-table">
        <thead><tr>{headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map(row => {
            const checkout = stripeCheckout[row[0] as keyof typeof stripeCheckout];
            return (
              <tr key={`${row[0]}-${row[1]}`}>
                <th scope="row">{row[0]}</th>
                {row.slice(1).map((cell, index) => (
                  <td key={`${row[0]}-${index}`}>
                    {cell}
                    {index === 0 && checkout && <a className="stripe-link" href={checkout} target="_blank" rel="noreferrer">Secure checkout <span aria-hidden="true">↗</span></a>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const digitalProducts = [
  ["QRV-001", "Verified Certificate Generator Kit", "$49"],
  ["QRV-002", "Fraud-Proof Invoice Verification System", "$39"],
  ["QRV-003", "QR-Verified Membership Card System", "$39"],
  ["QRV-004", "QR-Verified Product Authentication Kit", "$49"],
  ["QRV-005", "QR-V Identity Verification Toolkit", "$59"],
  ["QRV-006", "QR-V Explorer Verification UI", "$79"],
  ["QRV-007", "QR-V Registry Integration Guide", "$49"],
  ["QRV-008", "QR-V Verification Business Kit", "$129"],
  ["QRV-009", "Verified Diploma Template Pack", "$29"],
  ["QRV-010", "Verified Certificate Template Pack", "$29"],
  ["QRV-011", "Verified Event Ticket Templates", "$24"],
  ["QRV-012", "Verified Membership Card Templates", "$24"],
  ["QRV-013", "Verified Asset Ownership Certificate", "$29"],
  ["QRV-014", "Verified Business License Template", "$29"],
  ["QRV-015", "Verified Product Authenticity Labels", "$24"],
  ["QRV-016", "QR-V Developer Starter Kit", "$99"],
  ["QRV-017", "Verification API Starter Pack", "$79"],
  ["QRV-018", "QR-V Registry SQL Database Schema", "$59"],
  ["QRV-019", "Node.js Verification Server Template", "$89"],
  ["QRV-020", "Verification Microservice Architecture", "$129"],
  ["QRV-021", "Global Registry Infrastructure Blueprint", "$149"],
  ["QRV-022", "Distributed Verification Network Design", "$199"],
  ["QRV-023", "The Innovation Blueprint", "$79"],
  ["QRV-024", "Protocol Design Masterclass", "$149"],
  ["QRV-025", "How to Invent Internet Protocols", "$149"],
  ["QRV-026", "Building Global Infrastructure Platforms", "$179"],
  ["QRV-027", "Distributed Systems for Founders", "$179"],
  ["QRV-028", "The Architecture of Global Platforms", "$199"],
  ["QRV-029", "Innovation Strategy for Entrepreneurs", "$99"],
  ["QRV-030", "Local Business Growth OS", "$79"],
  ["QRV-031", "Digital Product Empire Guide", "$99"],
  ["QRV-032", "The Platform Business Model", "$119"],
  ["QRV-033", "Startup Infrastructure Blueprint", "$149"],
  ["QRV-034", "How to Build a Protocol Company", "$199"],
  ["QRV-035", "Online Revenue System Blueprint", "$99"],
  ["QRV-036", "The QR-V Protocol Explained", "$39"],
  ["QRV-037", "The Future of Verification Infrastructure", "$39"],
  ["QRV-038", "Trust Systems for the Internet", "$39"],
  ["QRV-039", "The End of Fake Documents", "$29"],
  ["QRV-040", "Verification Networks & Digital Trust", "$39"],
  ["QRV-041", "Verification Business Startup Kit", "$199"],
  ["QRV-042", "QR-V Developer Bundle", "$249"],
  ["QRV-043", "Global Verification Infrastructure Pack", "$399"],
  ["QRV-044", "Digital Product Business Bundle", "$179"],
  ["QRV-045", "Innovation Mastery Course Bundle", "$299"],
];

function PricingPage() {
  const publicPlans = [
    { name: "Free Demo / Pilot", price: "$0", period: "controlled pilot", description: "Validate one governed verification workflow before production rollout.", features: ["Canonical demo registry", "Guided scope review", "Limited records", "No production SLA"], cta: "Request pilot" },
    { name: "Starter", price: "$49", period: "month", description: "A practical issuer portal entry point for a growing organization.", features: ["1,000 records", "Certificate issuance", "QR generation", "Basic analytics"], cta: "Request Starter" },
    { name: "Professional", price: "$299", period: "month", description: "Higher-volume issuer operations with integration access.", features: ["25,000 records", "Team controls", "API access", "Priority support"], cta: "Request Professional", recommended: true },
    { name: "Enterprise", price: "Custom", period: "written agreement", description: "Institutional scale, unlimited records and advanced controls.", features: ["Unlimited records", "API access", "Custom implementation", "SLA options"], cta: "Contact sales" },
  ];

  return (
    <PageShell>
      <SubHero
        eyebrow="QR-V pricing"
        title="One public offer. Multiple paths to scale."
        text="Begin with the clear issuer-plan hierarchy, then use the detailed inventory for certificates, enterprise issuance, implementation, APIs, white-label portals and digital products."
        actions={<><a className="button" href="#public-plans">Compare public plans</a><Link className="button button-outline" href="/contact">Plan an implementation</Link></>}
      />
      <section className="subpage-content pricing-page">
        <Breadcrumb current="Pricing" />

        <nav className="pricing-jump" aria-label="Pricing sections">
          <a href="#public-plans">Public plans</a><a href="#certificate-plans">Certificates</a><a href="#issuer-plans">B2B issuers</a><a href="#services">Services</a><a href="#flagship-offers">Flagship offers</a><a href="#digital-products">Store products</a>
        </nav>

        <section className="pricing-section" id="public-plans">
          <div className="pricing-section-heading"><div><p className="eyebrow">Recommended public hierarchy</p><h2>Simple at first glance.</h2></div><p>These are the primary public choices for qrv.network. Higher-value and specialized pricing remains available below for qualified implementation conversations.</p></div>
          <div className="full-price-grid">
            {publicPlans.map(plan => (
              <article className={plan.recommended ? "recommended" : ""} key={plan.name}>
                {plan.recommended && <em>Recommended</em>}
                <span>{plan.name}</span><strong>{plan.price}<small> / {plan.period}</small></strong><p>{plan.description}</p>
                <ul>{plan.features.map(feature => <li key={feature}>✓ {feature}</li>)}</ul>
                <Link className={plan.recommended ? "button" : "button button-outline"} href="/contact">{plan.cta}</Link>
              </article>
            ))}
          </div>
          <div className="commercial-lanes" aria-label="Additional pricing entry points">
            <div><span>Implementation</span><strong>$5,000+</strong><small>Configuration, import, training and go-live</small></div>
            <div><span>White label</span><strong>$7,500+</strong><small>Branded verification portal setup</small></div>
            <div><span>API access</span><strong>$99/month+</strong><small>Developer keys, SDKs and integrations</small></div>
            <div><span>Store products</span><strong>$24–$399</strong><small>Kits, templates, guides and bundles</small></div>
          </div>
        </section>

        <section className="pricing-section" id="certificate-plans">
          <div className="pricing-section-heading"><div><p className="eyebrow">Certificate platform</p><h2>Verified certificates.</h2></div><p>The strongest first product for diplomas, training certificates, professional licenses, membership credentials and event certifications—each linked to a QR‑V verification code.</p></div>
          <PricingTable rows={[
            ["QR-V Verified Certificates — Starter", "$29/month", "500 certificates"],
            ["QR-V Verified Certificates — Professional", "$99/month", "5,000 certificates"],
            ["QR-V Verified Certificates — Enterprise", "$499/month", "Unlimited certificates"],
          ]} />
        </section>

        <section className="pricing-section" id="issuer-plans">
          <div className="pricing-section-heading"><div><p className="eyebrow">High-value B2B</p><h2>Issuer infrastructure.</h2></div><p>For organizations that need issuer control, public verification, audit trails, revocation and compliance-ready proof workflows.</p></div>
          <PricingTable rows={[
            ["Starter Issuer", "$199/month", "Up to 1,000 active records"],
            ["Growth Issuer", "$499/month", "Up to 10,000 records"],
            ["Professional Issuer", "$1,500/month", "Up to 100,000 records"],
            ["Enterprise / Network Issuer", "$5,000+/month", "Multi-issuer support, dedicated node options and advanced controls"],
          ]} />
        </section>

        <section className="pricing-section" id="services">
          <div className="pricing-section-heading"><div><p className="eyebrow">Implementation and services</p><h2>Launch, integrate and brand.</h2></div><p>Issuer setup can include branded verification, registry schema configuration, record import, issuer profiles, staff training and go-live support.</p></div>
          <div className="pricing-stack">
            <div><h3>Setup, onboarding and launch</h3><PricingTable rows={[["Starter Implementation", "$5,000", "Core launch and onboarding"],["Professional Implementation", "$12,500", "Expanded configuration and integration"],["Enterprise Implementation", "$25,000", "Institutional implementation baseline"]]} /></div>
            <div><h3>Usage-based verification</h3><PricingTable rows={[["Verification overage fee", "$0.01–$0.05 per verification", "Applied as verification volume scales"],["Enterprise high-volume usage", "Minimum monthly commit", "Contracted volume and service terms"]]} /></div>
            <div><h3>White-label verification portals</h3><PricingTable rows={[["White-label setup", "$7,500–$20,000", "Branded verification portal deployment"],["White-label monthly", "$500–$2,500/month", "Hosted operations and portal support"]]} /></div>
            <div><h3>API and SDK licensing</h3><PricingTable rows={[["Developer API Plan", "$99/month", "Developer keys, SDK access and webhooks"],["Business API Plan", "$499/month", "Bulk endpoints and registry integration tools"],["Enterprise API", "Custom · $12,000/year minimum", "Enterprise controls and contracted access"]]} /></div>
          </div>
          <div className="pricing-callout"><strong>White-label example</strong><span>verify.clientdomain.com <i>powered by QR‑V</i></span><p>Branded certificate validation and product authenticity portals remain anchored to the QR‑V verification infrastructure.</p></div>
        </section>

        <section className="pricing-section">
          <div className="pricing-section-heading"><div><p className="eyebrow">Vertical solutions</p><h2>Packages by use case.</h2></div><p>The initial verticals are certificates and diplomas, membership IDs, product authentication, financial instruments, and property or asset records.</p></div>
          <PricingTable rows={[
            ["Education Package", "$7,500–$30,000", "Certificates, diplomas and institutional verification"],
            ["Membership / Association Package", "$5,000–$20,000", "Membership IDs and standing verification"],
            ["Product Authentication Package", "$15,000–$50,000", "Authenticity, origin and product verification"],
            ["Financial Verification Package", "$20,000–$75,000", "Controlled financial proof workflows"],
          ]} />
        </section>

        <section className="pricing-section" id="flagship-offers">
          <div className="pricing-section-heading"><div><p className="eyebrow">First three offers</p><h2>Flagship launch systems.</h2></div><p>Certificates provide the fastest first sale; membership and product authenticity extend the same governed verification model.</p></div>
          <div className="flagship-grid">
            {[
              ["01", "QR-V Certificate Verification System", "$5,000 setup + $499/month", "Launch certificate issuance, QR‑V codes and public validation."],
              ["02", "QR-V Membership & ID Verification", "$7,500 setup + $499–$1,500/month", "Verify membership standing and organization-issued IDs."],
              ["03", "QR-V Product Authenticity Suite", "$15,000 setup + usage fees + enterprise minimum", "Create an authenticity workflow from product label to registry result."],
            ].map(([number, title, price, text]) => (
              <article key={title}><span>{number}</span><h3>{title}</h3><strong>{price}</strong><p>{text}</p><a className="button" href={stripeCheckout[title as keyof typeof stripeCheckout]} target="_blank" rel="noreferrer">Start with Stripe <span aria-hidden="true">↗</span></a></article>
            ))}
          </div>
        </section>

        <section className="pricing-section" id="digital-products">
          <div className="pricing-section-heading"><div><p className="eyebrow">QR-V store</p><h2>Digital product inventory.</h2></div><p>Forty-five fixed-price kits, templates, guides, technical resources, courses and bundles from the current product catalog.</p></div>
          <PricingTable headers={["SKU", "Product", "Price"]} rows={digitalProducts} />
          <div className="store-action"><div><strong>Store range: $24–$399</strong><p>Catalog pricing is displayed for planning. Product checkout and delivery must use an activated product listing.</p></div><Link className="button button-outline" href="/store">Visit the QR-V store</Link></div>
        </section>

        <section className="pricing-footnote" aria-label="Pricing terms">
          <strong>Pricing baseline</strong>
          <p>Prices are stated in U.S. dollars. Multiple pricing models are supported and are not automatically cumulative. Enterprise, usage-based, white-label, implementation and vertical packages are subject to scope, authority review, written agreement and applicable taxes. Stripe checkout is shown only for configured fixed-price offers.</p>
          <Link className="text-link" href="/contact">Discuss the correct pricing model <span>→</span></Link>
        </section>
      </section>
    </PageShell>
  );
}

const docSections = [
  ["Overview",["What is QR-V?","Core concepts","Product scope"]],
  ["Protocol",["Identifier format","Verification flow","Record states"]],
  ["Architecture",["Service topology","Data flow","Trust boundaries"]],
  ["Registry",["Data model","Issuer model","Audit log"]],
  ["Developers",["Getting started","Authentication","API reference"]],
  ["Security",["Threat model","Key management","Privacy modes"]],
];

function DocsPage() {
  return (
    <PageShell>
      <SubHero eyebrow="Documentation" title="Standards and implementation guidance." text="The QR‑V documentation is organized as a technical reference for protocol implementers, issuer organizations, developers, auditors and verification users." />
      <section className="docs-layout">
        <aside><strong>QR‑V Documentation</strong>{docSections.map(([section,items])=><div key={section as string}><span>{section as string}</span>{(items as string[]).map(item=><Link href={`#${item.toLowerCase().replaceAll(" ","-").replace("?","")}`} key={item}>{item}</Link>)}</div>)}</aside>
        <article>
          <Breadcrumb current="Documentation" />
          <p className="eyebrow">Overview</p><h1 id="what-is-qr-v">What is QR‑V?</h1><p className="lead">QR‑V™ is registry-backed verification infrastructure. It turns a QR code from a simple pointer into a resolvable reference backed by an authorized issuer, canonical record, deterministic status and integrity checks.</p>
          <div className="doc-callout"><strong>Verification question</strong><p>Does this scan resolve to the authentic, current, issuer-authorized registry record?</p></div>
          <h2 id="core-concepts">Core concepts</h2><div className="doc-definitions">{protocolSteps.slice(0,4).map(([t,c,p])=><div key={t}><dt>{t}</dt><dd><code>{c}</code><p>{p}</p></dd></div>)}</div>
          <h2 id="identifier-format">Identifier format</h2><pre className="large-code"><code>QRV-{"{"}ENV{"}"}-{"{"}TYPE{"}"}-{"{"}SEQUENCE{"}"}{"\n"}QRV-PROD-CERT-000001{"\n"}https://qrv.network/verify/QRV-PROD-CERT-000001</code></pre>
          <h2 id="record-states">Verification states</h2><div className="state-pills">{["VERIFIED","REVOKED","EXPIRED","NOT_FOUND","INVALID_SIGNATURE","SUSPENDED_ISSUER","ERROR"].map(x=><span key={x}>{x}</span>)}</div>
          <h2 id="getting-started">Getting started</h2><ol className="doc-steps"><li>Verify the canonical public launch record.</li><li>Review QRVP-1 identifiers and response states.</li><li>Define your issuer and record authorization model.</li><li>Request pilot access for protected issuance capabilities.</li></ol>
        </article>
      </section>
    </PageShell>
  );
}

function StatusPage() {
  const [status, setStatus] = useState<{ ok: boolean; status?: string; checkedAt?: string; services: Array<{ name: string; endpoint: string; status: string; publicRecords?: number }> }>({ ok: false, services: [] });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/status", { cache: "no-store" })
      .then(response => response.json())
      .then(data => {
        if (!active) return;
        const services = Array.isArray(data.services) && data.services.length ? data.services : [
          { name: "Public platform", endpoint: "qrv.network", status: "OPERATIONAL" },
          { name: "Canonical API/data authority", endpoint: "api.qrv.network/api/v1", status: data.ok ? "OPERATIONAL" : "ACTIVATION_PENDING" },
          { name: "Lifecycle acceptance", endpoint: "ISSUE → VERIFY → REVOKE", status: "RELEASE_GATE" },
        ];
        setStatus({ ...data, services });
      })
      .catch(() => { if (active) setStatus({ ok: false, services: [] }); })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  return (
    <PageShell>
      <SubHero eyebrow="Network status" title="Live production readiness." text="This page checks the public verifier and registry at request time and separately discloses services that are still being activated." />
      <section className="subpage-content status-page">
        <Breadcrumb current="Status" />
        <div className="overall-status"><span>{checking ? "…" : status.ok ? "✓" : "!"}</span><div><strong>{checking ? "Checking canonical API authority" : status.ok ? "Canonical API authority responded" : "Canonical API check unavailable"}</strong><p>{status.ok ? "The API/data boundary returned a live response. End-to-end issue, verify, revoke, audit, and release evidence is tracked separately." : "Do not rely on a record unless the canonical API returns a current result."}</p></div><small>{status.checkedAt ? `Checked ${displayDate(status.checkedAt)}` : "Live check"}</small></div>
        <div className="service-list">{status.services.map(service => <div key={service.endpoint}><div><strong>{service.name}</strong><code>{service.endpoint}</code></div><span className={service.status === "OPERATIONAL" ? "" : "pending"}><i />{service.status.replaceAll("_", " ")}{typeof service.publicRecords === "number" ? ` · ${service.publicRecords} records` : ""}</span></div>)}</div>
        <div className="uptime"><div><p className="eyebrow">Production proof</p><h2>Required end-to-end lifecycle</h2><p>issue → register → verify → VERIFIED → revoke → REVOKED</p><p>Compatibility subdomains are aliases only; they are not independent runtime services.</p></div></div>
      </section>
    </PageShell>
  );
}

function NetworkPage() {
  const nodes = [
    ["qrv.network","Public platform node","Human-facing routes, public verifier UX, compatibility proxy, documentation, and issuer inquiry"],
    ["api.qrv.network/api/v1","Canonical API/data authority","Persistent registry, verification, mutations, cryptography, audit, and privileged backend operations"],
  ];
  return (
    <PageShell>
      <SubHero eyebrow="Network namespace" title="One human-facing platform. One trusted API boundary." text="qrv.network owns human-facing routes. api.qrv.network is the only separately operated backend, registry, cryptographic, audit, and mutation boundary. Live activation remains subject to the production acceptance gate." />
      <section className="subpage-content">
        <Breadcrumb current="Network" />
        <div className="node-map"><div className="root-node"><strong>qrv.network</strong><span>QR-V platform node</span></div><div className="node-lines">{nodes.map(([host,role,desc])=><article key={host}><span>●</span><code>{host}</code><strong>{role}</strong><p>{desc}</p></article>)}</div></div>
      </section>
    </PageShell>
  );
}

function SecurityPage() {
  const controls = [["Transport","HTTPS on the production origin with same-origin handling for inquiry submissions."],["Identity","Issuer administration remains unavailable to the public and requires an approved onboarding path."],["Integrity","SHA-256 hashes and canonical serialization are active; Ed25519 signing and validation are disclosed as pending."],["Application","Identifier validation, bounded inputs, prepared database statements, bot trapping and inquiry rate limits."],["Operations","Live service checks, immutable deployments and platform-managed storage are active for the public launch."],["Issuer authority","Organizational authority review precedes access; automated suspension and key rotation remain roadmap controls."],["Audit","Verification result events are recorded; full issuer lifecycle audit capabilities remain access-controlled roadmap work."],["Privacy","The launch registry returns public-mode fields only; restricted and private response modes are not yet publicly exposed."]];
  const threats = ["QR cloning","Malicious URL substitution","Forged certificate data","Fake issuers","Replay attacks","Stolen API keys","Unauthorized revocation","Record tampering","Scraping and enumeration","Denial of service"];
  return (
    <PageShell>
      <SubHero eyebrow="Security and trust" title="Trust must be designed, verified and auditable." text="QR‑V’s security model protects issuer authority, record integrity, verification responses and the complete record lifecycle." />
      <section className="subpage-content">
        <Breadcrumb current="Security" />
        <div className="control-grid">{controls.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="threat-panel"><div><p className="eyebrow light">Threat model</p><h2>Designed against the ways verification can fail.</h2><p>The production security review must consider both technical attacks and failures of organizational authority.</p></div><div>{threats.map(t=><span key={t}>✓ {t}</span>)}</div></div>
      </section>
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell>
      <SubHero eyebrow="About QR-V" title="Verification infrastructure built around accountable records." text="QR‑V provides a structured way to answer whether a record is authentic, who issued it, whether it remains active and whether its data matches the canonical registry entry." />
      <section className="subpage-content">
        <Breadcrumb current="About" />
        <div className="about-lead"><div className="origin-mark">QR‑V<sup>™</sup><span>QRVP-1</span></div><div><p className="eyebrow">Founder and originator</p><h2>Gregory L. Jones</h2><p>Gregory L. Jones, also known as One Gregory Onegodian™, is the founder and originator of QR‑V™. ONEGODIAN, LLC is the commercial owner of the platform and its associated development program.</p><p>QR‑V is positioned as verification infrastructure—not as a generic QR-code generator. Its purpose is to link a scannable reference to an issuer-authorized, registry-backed and status-aware record.</p></div></div>
        <div className="record-of-origin"><span>Project</span><strong>QR‑V™ Global Verification Network</strong><span>Root domain</span><strong>qrv.network</strong><span>Primary protocol</span><strong>QRVP-1</strong><span>Primary standard</span><strong>QVS-1.0</strong><span>Initial product</span><strong>QR‑V™ Verified Certificates</strong><span>Commercial owner</span><strong>ONEGODIAN, LLC</strong></div>
        <div className="mission-band"><p className="eyebrow light">Platform objective</p><h2>Make verification clear enough for the public and disciplined enough for institutions.</h2></div>
      </section>
    </PageShell>
  );
}

function ContactPage() {
  const [submission, setSubmission] = useState<{ state: "idle" | "sending" | "success" | "error"; message?: string }>({ state: "idle" });

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmission({ state: "sending" });
    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: data.get("organization"),
          contactName: data.get("contactName"),
          email: data.get("email"),
          useCase: data.get("useCase"),
          message: data.get("message"),
          consent: data.get("consent") === "yes",
          website: data.get("website"),
        }),
      });
      const result = await response.json() as { ok?: boolean; inquiryId?: string; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Submission failed");
      form.reset();
      setSubmission({ state: "success", message: `Inquiry received. Reference: ${result.inquiryId}` });
    } catch (error) {
      const reason = error instanceof Error && error.message === "RATE_LIMITED"
        ? "Too many recent requests. Please try again later."
        : "The inquiry could not be submitted. Please review the fields and try again.";
      setSubmission({ state: "error", message: reason });
    }
  }

  return (
    <PageShell>
      <SubHero eyebrow="Contact and onboarding" title="Tell us what you need to verify." text="Use this planning form to define your issuer organization, record type, expected volume and implementation requirements." />
      <section className="subpage-content contact-layout">
        <div><Breadcrumb current="Contact" /><p className="eyebrow">Implementation inquiry</p><h2>Start with your verification workflow.</h2><p>QR‑V issuer onboarding begins with organizational identity, authority to issue the requested record type, privacy requirements and the operational lifecycle.</p><div className="contact-cards"><div><strong>Issuer pilots</strong><span>Certificate issuance and public verification</span></div><div><strong>Developer access</strong><span>API integration and implementation planning</span></div><div><strong>Enterprise systems</strong><span>Custom volumes, private modes and white-label nodes</span></div></div></div>
        <form className="contact-form" onSubmit={submitInquiry}>
          <label>Organization<input name="organization" placeholder="Organization name" maxLength={140} required /></label>
          <label>Your name<input name="contactName" placeholder="Full name" maxLength={120} autoComplete="name" required /></label>
          <label>Email<input name="email" type="email" placeholder="you@organization.com" maxLength={180} autoComplete="email" required /></label>
          <label>Primary use case<select name="useCase" defaultValue="" required><option value="" disabled>Select record type</option><option>Certificates and credentials</option><option>Membership or identity</option><option>Documents</option><option>Products</option><option>Property or assets</option><option>Other</option></select></label>
          <label>What must the workflow verify?<textarea name="message" rows={5} minLength={20} maxLength={2500} placeholder="Describe the issuer, record, public result and lifecycle." required /></label>
          <label className="hp-field" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label className="consent-field"><input name="consent" type="checkbox" value="yes" required /><span>I authorize QR-V / ONEGODIAN, LLC to use this information to respond to this inquiry. I have reviewed the privacy notice.</span></label>
          <button className="button" type="submit" disabled={submission.state === "sending"}>{submission.state === "sending" ? "Submitting…" : "Submit inquiry"}</button>
          {submission.message && <p className={`form-status ${submission.state}`} role="status">{submission.message}</p>}
          <small>Issuer approval, implementation scope, pricing, and legally operative terms require separate written confirmation.</small>
        </form>
      </section>
    </PageShell>
  );
}

function LegalPage({ type }: { type: "terms" | "privacy" }) {
  const isTerms = type === "terms";
  return (
    <PageShell>
      <SubHero eyebrow={isTerms ? "Legal" : "Privacy"} title={isTerms ? "Terms of use" : "Privacy notice"} text={isTerms ? "Rules governing access to and use of the QR‑V public website, verifier, registry, API, and inquiry services." : "How QR‑V handles public verification activity and issuer-inquiry information."} />
      <section className="subpage-content legal-page">
        <Breadcrumb current={isTerms ? "Terms" : "Privacy"} />
        <p className="legal-date">Effective August 20, 2026 · Public launch baseline</p>
        {isTerms ? <>
          <h2>1. Scope</h2><p>These terms apply to the QR‑V™ public website, verifier, registry, API, and inquiry services operated by ONEGODIAN, LLC. Public access does not by itself establish an issuer, customer, fiduciary, certification, or other contractual relationship.</p>
          <h2>2. Verification results</h2><p>A verification result reports the status of a registry record at the time of resolution. Users remain responsible for evaluating whether a record is appropriate for their particular legal, compliance or institutional purpose.</p>
          <h2>3. Authorized use</h2><p>Do not misuse the service to impersonate an issuer, fabricate a record, interfere with verification, enumerate protected data, bypass access controls or create a misleading QR‑V reference.</p>
          <h2>4. Intellectual property</h2><p>QR‑V™, QRVP-1, QVS-1.0, platform content and related materials are owned or controlled by their respective rights holder, including ONEGODIAN, LLC where stated.</p>
          <h2>5. Issuer and commercial agreements</h2><p>Issuer, protected API, enterprise, subscription, and implementation services may require separate written terms, authority verification, pricing, payment, and technical configuration. A Stripe payment does not waive required eligibility or authority review.</p>
          <h2>6. Availability and changes</h2><p>Service availability, supported record classes, status definitions, and technical controls may change as the platform develops. Material service limitations are disclosed through the status and documentation pages.</p>
        </> : <>
          <h2>1. Public verification</h2><p>Public verification should disclose only the fields authorized by the issuer and record privacy mode. Production records may be public, restricted or private.</p>
          <h2>2. Public test records</h2><p>QR‑V maintains non-sensitive public launch and lifecycle test records so users can inspect VERIFIED, REVOKED, EXPIRED, and integrity-failure responses. These records are clearly identified and are not third-party credentials.</p>
          <h2>3. Operational data</h2><p>The service records verification identifiers, result states, request timestamps, and security or reliability events needed for registry integrity, abuse prevention, audit, and incident response. The public launch verifier does not require a verifier to submit a name or email address.</p>
          <h2>4. Inquiry and issuer data</h2><p>The issuer inquiry form stores organization, contact, email, use-case, message, consent, status, and submission time information so ONEGODIAN, LLC can evaluate and respond to the request. Issuer onboarding and billing may require additional notices and written terms.</p>
          <h2>5. Data minimization</h2><p>Private record data should not be embedded directly in the QR image. Verification responses should return the minimum data required by the applicable privacy mode.</p>
          <h2>6. Choices and requests</h2><p>Do not submit sensitive personal data through the public inquiry form. A person may use the contact page to request access, correction, or deletion review for inquiry information, subject to legitimate security, legal, and recordkeeping needs.</p>
        </>}
        <div className="legal-disclaimer"><strong>Important limitation</strong><p>These public terms and notices are not a substitute for an issuer agreement, data-processing agreement, professional legal advice, or a legal determination that a verified record is sufficient for a particular transaction.</p></div>
      </section>
    </PageShell>
  );
}

function StorePage() {
  return (
    <PageShell>
      <SubHero eyebrow="QR-V products" title="Verification products and implementation services." text="Begin with verified certificates, then expand through issuer subscriptions, integration packages and enterprise deployment." />
      <section className="subpage-content">
        <Breadcrumb current="Store" />
        <div className="store-grid"><article><span>Initial product</span><h2>Verified Certificate Pilot</h2><p>Structured pilot for one issuer, one certificate class and the complete issue-to-verification lifecycle.</p><strong>Request scope</strong><Link className="button" href="/contact">Plan pilot</Link></article><article><span>Implementation</span><h2>Starter Launch</h2><p>Issuer onboarding, certificate configuration, workflow setup and implementation guidance.</p><strong>$5,000</strong><Link className="button button-outline" href="/contact">Discuss launch</Link></article><article><span>Enterprise</span><h2>Custom Verification Node</h2><p>High-volume, controlled-access or white-label verification infrastructure.</p><strong>Custom</strong><Link className="button button-outline" href="/contact">Contact sales</Link></article></div>
      </section>
    </PageShell>
  );
}

function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const latestPost = newsPosts[0];
  const visiblePosts = activeCategory === "All"
    ? newsPosts.slice(1)
    : newsPosts.filter(post => post.category === activeCategory);

  return (
    <PageShell>
      <SubHero eyebrow="QR-V newsroom" title="News, research and platform updates." text="Official articles covering the QR‑V protocol, registry, developer resources, security, use cases, adoption, research and network development." />
      <section className="subpage-content news-page">
        <Breadcrumb current="News" />
        <div className="news-toolbar" aria-label="Filter news by category">
          {newsCategories.map(category => (
            <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>
          ))}
        </div>

        {activeCategory === "All" && latestPost && (
          <article className="news-featured">
            <div className="news-featured-mark" aria-hidden="true"><span>QR‑V</span><b>NEWS</b></div>
            <div>
              <p className="eyebrow">Latest · {latestPost.category}</p>
              <h2><Link href={`/news/${latestPost.slug}`}>{latestPost.title}</Link></h2>
              <p>{latestPost.excerpt}</p>
              <div className="news-meta"><span>{formatNewsDate(latestPost.publishedAt, true)}</span><span>{latestPost.author}</span></div>
              <Link className="text-link" href={`/news/${latestPost.slug}`}>Read article <span>→</span></Link>
            </div>
          </article>
        )}

        <div className="news-list-heading">
          <div><p className="eyebrow">Article archive</p><h2>{activeCategory === "All" ? "All QR-V coverage" : activeCategory}</h2></div>
          <strong>{visiblePosts.length} {visiblePosts.length === 1 ? "article" : "articles"}</strong>
        </div>
        <div className="news-grid">
          {visiblePosts.map(post => (
            <article className="news-card" key={post.slug}>
              <div className="news-card-top"><span>{post.category}</span><time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time></div>
              <h3><Link href={`/news/${post.slug}`}>{post.title}</Link></h3>
              <p>{post.excerpt}</p>
              <div className="news-card-foot"><span>{post.author}</span><Link href={`/news/${post.slug}`} aria-label={`Read ${post.title}`}>Read <span aria-hidden="true">↗</span></Link></div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function NewsArticlePage({ slug }: { slug: string }) {
  const post = getNewsPost(slug);
  if (!post) return <GenericPage path={`news/${slug}`} />;
  const related = newsPosts.filter(item => item.category === post.category && item.slug !== post.slug).slice(0, 3);

  return (
    <PageShell>
      <article className="news-article">
        <header className="news-article-header">
          <div className="news-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/news">News</Link><span>/</span><b>{post.category}</b></div>
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <div className="news-meta"><span>{formatNewsDate(post.publishedAt, true)}</span><span>{post.author}</span></div>
        </header>
        <div className="news-article-body">
          <p className="lead">{post.excerpt}</p>
          <div className="article-record"><span>Published</span><strong>{formatNewsDate(post.publishedAt, true)}</strong><span>Editorial desk</span><strong>{post.author}</strong><span>Category</span><strong>{post.category}</strong></div>
          <p>This article was imported into the QR‑V Global Verification Network news archive from the supplied publication record.</p>
        </div>
        <footer className="news-article-footer"><Link className="button button-outline" href="/news">← Back to all news</Link></footer>
      </article>
      {related.length > 0 && <section className="related-news"><div className="news-list-heading"><div><p className="eyebrow">Continue reading</p><h2>Related in {post.category}</h2></div></div><div className="news-grid">{related.map(item => <article className="news-card" key={item.slug}><div className="news-card-top"><span>{item.category}</span><time dateTime={item.publishedAt}>{formatNewsDate(item.publishedAt)}</time></div><h3><Link href={`/news/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p><div className="news-card-foot"><span>{item.author}</span><Link href={`/news/${item.slug}`}>Read <span aria-hidden="true">↗</span></Link></div></article>)}</div></section>}
    </PageShell>
  );
}

function GenericPage({ path }: { path: string }) {
  const title = path.replaceAll("-", " ").replace(/\b\w/g, x => x.toUpperCase());
  return <PageShell><SubHero eyebrow="QR-V network" title={title} text="This service area is part of the QR‑V Global Verification Network." /><section className="subpage-content"><Breadcrumb current={title} /><div className="empty-state"><strong>QR‑V</strong><h2>Continue through the network hub.</h2><p>Use the primary navigation to access verification, registry, issuer, documentation and developer services.</p><Link className="button" href="/">Return home</Link></div></section></PageShell>;
}

export default function QrvSubpage({ path, queryId }: { path: string; queryId?: string }) {
  const root = path.split("/")[0];
  const page = useMemo(() => {
    switch (root) {
      case "verify": return <VerifyPage path={path} initialQueryId={queryId} />;
      case "protocol": return <ProtocolPage />;
      case "how-it-works": return <HowPage />;
      case "registry": return <RegistryPage />;
      case "use-cases": return <UseCasesPage />;
      case "developers": return <DevelopersPage />;
      case "api-reference": return <DevelopersPage />;
      case "explorer": return <RegistryPage />;
      case "certificate-verification": return <VerifyPage path={`verify/${DEMO_ID}`} />;
      case "issuer": return <IssuerPage />;
      case "pricing": return <PricingPage />;
      case "docs": return <DocsPage />;
      case "status": return <StatusPage />;
      case "network": return <NetworkPage />;
      case "security": return <SecurityPage />;
      case "about": return <AboutPage />;
      case "contact": return <ContactPage />;
      case "terms": return <LegalPage type="terms" />;
      case "privacy": return <LegalPage type="privacy" />;
      case "store": return <StorePage />;
      case "news": {
        const newsSlug = path.split("/").slice(1).join("/");
        return newsSlug ? <NewsArticlePage slug={newsSlug} /> : <NewsPage />;
      }
      default: return <GenericPage path={path} />;
    }
  }, [path, queryId, root]);
  return page;
}
