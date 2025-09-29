// server.js
const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-token");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configuration - set these as environment variables
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const PORT = process.env.PORT || 3000;

// Token expiration time (in seconds) - 24 hours
const EXPIRATION_TIME = 86400;

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Agora Token Server Running" });
});

// RTC Token generation endpoint
app.post("/rtc-token", (req, res) => {
  try {
    const { channelName, uid, role = "publisher" } = req.body;

    if (!channelName) {
      return res.status(400).json({ error: "channelName is required" });
    }

    if (!APP_ID || !APP_CERTIFICATE) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Default to uid 0 if not provided
    const userId = uid || 0;

    // Determine role (publisher or subscriber)
    const userRole =
      role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

    // Calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + EXPIRATION_TIME;

    // Build token
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      userId,
      userRole,
      privilegeExpireTime
    );

    res.json({
      token,
      appId: APP_ID,
      channelName,
      uid: userId,
      expiresIn: EXPIRATION_TIME,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(PORT, () => {
  console.log(`Agora Token Server listening on port ${PORT}`);
});
