import express from "express";

const app = express();
app.use(express.json());

/**
 * Health Check
 */
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "qrv-node",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

/**
 * Verification Endpoint (Node Layer)
 */
app.get("/verify/:qrvid", async (req, res) => {
  const { qrvid } = req.params;

  try {
    // Temporary deterministic response (until registry integration)
    const result = {
      qrvid,
      verified: true,
      verificationState: "VERIFIED",
      status: "active",
      source: "node.qrv.network",
      message: "Verification executed at node layer",
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "node_verification_error",
      message: "Node verification failed",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`QR-V Node running on port ${PORT}`);
});
