import { env } from "cloudflare:workers";

export type PublicRecord = {
  qrvid: string;
  issuer: string;
  issuerCode: string;
  subject: string;
  title: string;
  status: "VERIFIED" | "REVOKED" | "EXPIRED" | "INVALID_SIGNATURE";
  issuedAt: string;
  expiresAt: string | null;
  reason: string | null;
  privacyMode: "PUBLIC";
  recordHash: string;
  signatureState: "PENDING_ED25519" | "VALID" | "INVALID";
  createdAt: string;
  updatedAt: string;
};

type RuntimeEnv = { DB?: D1Database };

function database(): D1Database {
  const db = (env as unknown as RuntimeEnv).DB;
  if (!db) throw new Error("QR-V registry storage is not configured.");
  return db;
}

function canonicalPayload(record: Omit<PublicRecord, "recordHash" | "createdAt" | "updatedAt">) {
  return JSON.stringify({
    expiresAt: record.expiresAt,
    issuedAt: record.issuedAt,
    issuer: record.issuer,
    issuerCode: record.issuerCode,
    privacyMode: record.privacyMode,
    qrvid: record.qrvid,
    reason: record.reason,
    signatureState: record.signatureState,
    status: record.status,
    subject: record.subject,
    title: record.title,
  });
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashRecord(record: Omit<PublicRecord, "recordHash" | "createdAt" | "updatedAt">) {
  return sha256Hex(canonicalPayload(record));
}

let initialization: Promise<void> | null = null;

export function ensureQrvSchema() {
  if (!initialization) initialization = initialize().catch(error => {
    initialization = null;
    throw error;
  });
  return initialization;
}

async function initialize() {
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS verification_records (
      qrvid TEXT PRIMARY KEY NOT NULL,
      issuer TEXT NOT NULL,
      issuer_code TEXT NOT NULL,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      issued_at TEXT NOT NULL,
      expires_at TEXT,
      reason TEXT,
      privacy_mode TEXT NOT NULL DEFAULT 'PUBLIC',
      record_hash TEXT NOT NULL,
      signature_state TEXT NOT NULL DEFAULT 'PENDING_ED25519',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS verification_records_status_idx ON verification_records (status)"),
    db.prepare("CREATE INDEX IF NOT EXISTS verification_records_issuer_idx ON verification_records (issuer_code)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS verification_events (
      id TEXT PRIMARY KEY NOT NULL,
      qrvid TEXT NOT NULL,
      result_status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS verification_events_qrvid_idx ON verification_events (qrvid)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS issuer_inquiries (
      id TEXT PRIMARY KEY NOT NULL,
      organization TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      use_case TEXT NOT NULL,
      message TEXT NOT NULL,
      consent INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'NEW',
      created_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS issuer_inquiries_email_idx ON issuer_inquiries (email)"),
    db.prepare("CREATE INDEX IF NOT EXISTS issuer_inquiries_created_at_idx ON issuer_inquiries (created_at)"),
  ]);

  const now = "2026-08-20T16:00:00-04:00";
  const seeds: Array<Omit<PublicRecord, "recordHash" | "createdAt" | "updatedAt">> = [
    {
      qrvid: "QRV-PROD-CERT-000001",
      issuer: "ONEGODIAN, LLC",
      issuerCode: "QRV-ISS-ONEGODIAN-001",
      subject: "QR-V Global Verification Network",
      title: "QRVP-1 Public Launch Record",
      status: "VERIFIED",
      issuedAt: "2026-08-20T16:00:00-04:00",
      expiresAt: null,
      reason: null,
      privacyMode: "PUBLIC",
      signatureState: "PENDING_ED25519",
    },
    {
      qrvid: "QRV-PROD-CERT-000002",
      issuer: "QR-V Public Test Registry",
      issuerCode: "QRV-ISS-TEST-001",
      subject: "Public lifecycle test",
      title: "Revocation State Test Record",
      status: "REVOKED",
      issuedAt: "2026-07-30T12:00:00Z",
      expiresAt: null,
      reason: "Withdrawn to demonstrate the public revocation state.",
      privacyMode: "PUBLIC",
      signatureState: "PENDING_ED25519",
    },
    {
      qrvid: "QRV-PROD-CERT-000003",
      issuer: "QR-V Public Test Registry",
      issuerCode: "QRV-ISS-TEST-001",
      subject: "Public lifecycle test",
      title: "Expiration State Test Record",
      status: "EXPIRED",
      issuedAt: "2026-06-01T12:00:00Z",
      expiresAt: "2026-07-01T12:00:00Z",
      reason: null,
      privacyMode: "PUBLIC",
      signatureState: "PENDING_ED25519",
    },
    {
      qrvid: "QRV-TEST-CERT-BADSIG",
      issuer: "QR-V Public Test Registry",
      issuerCode: "QRV-ISS-TEST-001",
      subject: "Public integrity test",
      title: "Invalid Signature State Test Record",
      status: "INVALID_SIGNATURE",
      issuedAt: "2026-07-30T12:00:00Z",
      expiresAt: null,
      reason: "Signature validation intentionally fails for this test record.",
      privacyMode: "PUBLIC",
      signatureState: "INVALID",
    },
  ];

  const statements = [];
  for (const seed of seeds) {
    statements.push(db.prepare(`INSERT OR IGNORE INTO verification_records (
      qrvid, issuer, issuer_code, subject, title, status, issued_at, expires_at,
      reason, privacy_mode, record_hash, signature_state, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(
        seed.qrvid,
        seed.issuer,
        seed.issuerCode,
        seed.subject,
        seed.title,
        seed.status,
        seed.issuedAt,
        seed.expiresAt,
        seed.reason,
        seed.privacyMode,
        await hashRecord(seed),
        seed.signatureState,
        now,
        now,
      ));
  }
  await db.batch(statements);
}

export function getQrvDatabase() {
  return database();
}

export function rowToPublicRecord(row: Record<string, unknown>): PublicRecord {
  return {
    qrvid: String(row.qrvid),
    issuer: String(row.issuer),
    issuerCode: String(row.issuer_code),
    subject: String(row.subject),
    title: String(row.title),
    status: String(row.status) as PublicRecord["status"],
    issuedAt: String(row.issued_at),
    expiresAt: row.expires_at ? String(row.expires_at) : null,
    reason: row.reason ? String(row.reason) : null,
    privacyMode: "PUBLIC",
    recordHash: String(row.record_hash),
    signatureState: String(row.signature_state) as PublicRecord["signatureState"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}
