# Agora Token Server

A minimal Express server for generating Agora RTC and RTM tokens. It exposes JSON endpoints to obtain time-limited tokens for a given `channelName` and optional `uid`.

## Tech stack

- Node.js + Express
- CORS enabled
- Uses `agora-token` to build tokens

## Endpoints

- `GET /` — health check
- `POST /rtc-token` — body: `{ channelName: string, uid?: number, role?: "publisher" | "subscriber" }`
- `POST /rtm-token` — body: `{ userId: string }`

Responses include a `token` and metadata; errors return JSON with `error`.

## Environment variables

Set these before running or deploying:

- `AGORA_APP_ID` — your Agora App ID
- `AGORA_APP_CERTIFICATE` — your Agora App Certificate
- `PORT` — optional, defaults to `3000`

If you can add files, create a `.env` (not committed) with:

```
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
PORT=3000
```

## Run locally

1. Install deps:
   ```bash
   npm install
   ```
2. Set environment variables (e.g. via `.env` using a shell like `direnv`, or export inline):
   ```bash
   export AGORA_APP_ID=your_agora_app_id
   export AGORA_APP_CERTIFICATE=your_agora_app_certificate
   export PORT=3000
   ```
3. Start:
   ```bash
   npm start
   ```
4. Test:
   ```bash
   curl -X POST http://localhost:3000/rtc-token \
     -H 'Content-Type: application/json' \
     -d '{"channelName":"test","uid":123,"role":"publisher"}'
   ```

## Deployment Options

### Quick Comparison

| Platform    | Free Tier  | Sleeps?             | Auto-Deploy | Best For             |
| ----------- | ---------- | ------------------- | ----------- | -------------------- |
| **Render**  | ✅ Yes     | ⏸️ After 15 min     | ✅ GitHub   | Simple deployments   |
| **Fly.io**  | ✅ Yes     | ❌ No               | ✅ GitHub   | Always-on apps       |
| **Vercel**  | ✅ Yes     | ❌ No (serverless)  | ✅ GitHub   | Serverless functions |
| **Cyclic**  | ✅ Yes     | ⏸️ After inactivity | ✅ GitHub   | Node.js apps         |
| **Railway** | ⚠️ Limited | ❌ No               | ✅ GitHub   | Full-stack apps      |

**Recommendation:**

- **Always-on needed?** → Fly.io or Railway
- **Can accept cold starts?** → Render or Cyclic
- **Want serverless?** → Vercel

---

### Option 1: Render (Free Tier)

**Pros:** Free tier available, auto-deploy from GitHub, easy setup

1. Push your code to GitHub (see "Push to GitHub" section below)
2. Go to [Render.com](https://render.com) and sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `agora-token-server` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (sleeps after 15 min inactivity)
6. In "Environment Variables", add:
   - `AGORA_APP_ID` = your app ID
   - `AGORA_APP_CERTIFICATE` = your certificate
   - `PORT` = `10000` (Render uses port 10000, but `process.env.PORT` is auto-set)
7. Click "Create Web Service"
8. Wait for deployment (~2-3 minutes)
9. Your app will be available at `https://your-app-name.onrender.com`

**Note:** Free tier spins down after 15 min of inactivity; first request may take ~30 seconds.

---

### Option 2: Fly.io (Free Tier)

**Pros:** Generous free tier, no sleep, good performance

1. Push your code to GitHub (see "Push to GitHub" section below)
2. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
3. Login:
   ```bash
   fly auth login
   ```
4. Initialize (in project directory):
   ```bash
   fly launch
   ```
   - Choose your app name
   - Select a region
   - Don't deploy yet (we'll set env vars first)
   - This creates a `fly.toml` file (see `fly.toml.example` for reference)
5. Set environment variables:
   ```bash
   fly secrets set AGORA_APP_ID=your_agora_app_id
   fly secrets set AGORA_APP_CERTIFICATE=your_agora_app_certificate
   ```
6. Deploy:
   ```bash
   fly deploy
   ```
7. Open your app:
   ```bash
   fly open
   ```

---

### Option 3: Vercel (Serverless)

**Pros:** Great for serverless, excellent performance, generous free tier

**Note:** Requires converting to serverless functions. We'll create a Vercel-compatible version.

1. Push your code to GitHub
2. Create `vercel.json` in project root (see below)
3. Create `api/index.js` (see below)
4. Go to [Vercel.com](https://vercel.com) and import your GitHub repo
5. Add environment variables in project settings:
   - `AGORA_APP_ID`
   - `AGORA_APP_CERTIFICATE`
6. Deploy

See "Vercel Setup" section below for configuration files.

---

### Option 4: Render Alternative - Railway

1. Push your code to GitHub (see "Push to GitHub" section below)
2. Go to Railway dashboard and choose "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will auto-detect a Node app via `package.json` and use `npm start`
5. In Project → Variables, add:
   - `AGORA_APP_ID`
   - `AGORA_APP_CERTIFICATE`
   - (optional) `PORT` — Railway injects a port; server already respects `process.env.PORT`
6. Click "Deploy". On success, open the generated domain and hit `/` to verify

**Alternative: Railway CLI**

```bash
# Install CLI if needed
npm i -g @railway/cli

# Login and init
railway login
railway init  # select or create a project

# Set variables
railway variables set AGORA_APP_ID=your_agora_app_id
railway variables set AGORA_APP_CERTIFICATE=your_agora_app_certificate

# Deploy
railway up
```

---

### Option 5: Cyclic.sh

**Pros:** Free tier, auto-deploy from GitHub, no credit card required

1. Push your code to GitHub
2. Go to [Cyclic.sh](https://cyclic.sh) and sign up with GitHub
3. Click "Link Your Repo" and select your repository
4. Cyclic auto-detects Node.js
5. Add environment variables:
   - `AGORA_APP_ID`
   - `AGORA_APP_CERTIFICATE`
6. Click "Deploy"
7. Your app will be live at `https://your-app-name.cyclic.app`

---

### Option 6: Fly.io Alternative - Heroku

**Note:** Heroku removed their free tier, but Eco Dyno ($5/month) is available. Included for completeness.

1. Install Heroku CLI and login
2. Create app: `heroku create your-app-name`
3. Set env vars:
   ```bash
   heroku config:set AGORA_APP_ID=your_agora_app_id
   heroku config:set AGORA_APP_CERTIFICATE=your_agora_app_certificate
   ```
4. Deploy: `git push heroku main`

---

### Push to GitHub (Required for most platforms)

From the project root:

```bash
git init
git add .
git commit -m "init: agora token server"
# Create an empty repo on GitHub first, then set the remote:
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

---

### Configuration Files Included

This repository includes ready-to-use configuration files:

- **`vercel.json`** - Vercel serverless configuration (already included)
- **`api/index.js`** - Vercel serverless function (already included)
- **`fly.toml.example`** - Fly.io configuration template (copy to `fly.toml` or use `fly launch`)

For other platforms (Render, Cyclic, Railway), no additional config files are needed—they auto-detect Node.js from `package.json`.

---

### Vercel Setup (Serverless Configuration)

The following files are already included in this repo:

**`vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

**`api/index.js`:** (already included)

```javascript
const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-token");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const EXPIRATION_TIME = 86400;

app.get("/", (req, res) => {
  res.json({ status: "Agora Token Server Running" });
});

app.post("/rtc-token", (req, res) => {
  try {
    const { channelName, uid, role = "publisher" } = req.body;

    if (!channelName) {
      return res.status(400).json({ error: "channelName is required" });
    }

    if (!APP_ID || !APP_CERTIFICATE) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const userId = uid || 0;
    const userRole =
      role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + EXPIRATION_TIME;

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

module.exports = app;
```

## Notes

- Tokens expire after 24 hours by default. Adjust `EXPIRATION_TIME` in `server.js` if needed.
- Keep `AGORA_APP_CERTIFICATE` secret; never commit it.
- CORS is enabled globally; tighten origins in production if required.
