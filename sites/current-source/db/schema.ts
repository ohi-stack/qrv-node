import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const verificationRecords = sqliteTable("verification_records", {
  qrvid: text("qrvid").primaryKey(),
  issuer: text("issuer").notNull(),
  issuerCode: text("issuer_code").notNull(),
  subject: text("subject").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  issuedAt: text("issued_at").notNull(),
  expiresAt: text("expires_at"),
  reason: text("reason"),
  privacyMode: text("privacy_mode").notNull().default("PUBLIC"),
  recordHash: text("record_hash").notNull(),
  signatureState: text("signature_state").notNull().default("PENDING_ED25519"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, table => [
  index("verification_records_status_idx").on(table.status),
  index("verification_records_issuer_idx").on(table.issuerCode),
]);

export const verificationEvents = sqliteTable("verification_events", {
  id: text("id").primaryKey(),
  qrvid: text("qrvid").notNull(),
  resultStatus: text("result_status").notNull(),
  createdAt: text("created_at").notNull(),
}, table => [index("verification_events_qrvid_idx").on(table.qrvid)]);

export const issuerInquiries = sqliteTable("issuer_inquiries", {
  id: text("id").primaryKey(),
  organization: text("organization").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  useCase: text("use_case").notNull(),
  message: text("message").notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  status: text("status").notNull().default("NEW"),
  createdAt: text("created_at").notNull(),
}, table => [
  index("issuer_inquiries_email_idx").on(table.email),
  index("issuer_inquiries_created_at_idx").on(table.createdAt),
]);
