import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/**
 * QR-V Verification Engine
 * Deterministic resolution of QRVID → registry record → verification state
 */
export async function verifyQrvid(qrvid) {
  const timestamp = new Date().toISOString();

  try {
    const { rows } = await pool.query(
      `SELECT * FROM qr_objects WHERE qrvid = $1 LIMIT 1`,
      [qrvid]
    );

    const record = rows[0];

    if (!record) {
      return {
        qrvid,
        verified: false,
        verificationState: "NOT_FOUND",
        status: "unknown",
        message: "QR-V identifier not found in registry",
        timestamp
      };
    }

    if (record.status === "revoked") {
      return {
        qrvid,
        verified: false,
        verificationState: "REVOKED",
        status: "revoked",
        issuer: record.issuer,
        recordType: record.record_type,
        revokedAt: record.revoked_at,
        timestamp
      };
    }

    if (record.expiration_date && new Date(record.expiration_date) < new Date()) {
      return {
        qrvid,
        verified: false,
        verificationState: "EXPIRED",
        status: "expired",
        issuer: record.issuer,
        recordType: record.record_type,
        expirationDate: record.expiration_date,
        timestamp
      };
    }

    return {
      qrvid,
      verified: true,
      verificationState: "VERIFIED",
      status: "active",
      issuer: record.issuer,
      recordType: record.record_type,
      issuedDate: record.issued_date,
      timestamp
    };
  } catch (err) {
    return {
      qrvid,
      verified: false,
      verificationState: "ERROR",
      error: "registry_query_failed",
      message: err.message,
      timestamp
    };
  }
}
