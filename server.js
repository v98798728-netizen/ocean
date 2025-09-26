// server.js

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// AI proxy route
app.post("/api/ai", async (req, res) => {
  console.log("✅ Received request at /api/ai", req.body);

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("NVIDIA API error:", response.status, errorData);
      return res.status(response.status).json({ error: errorData.error || "Unknown error from NVIDIA API" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error proxying NVIDIA request:", err);
    res.status(500).json({ error: "Failed to contact NVIDIA API" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server running on http://0.0.0.0:${PORT}`);
});
