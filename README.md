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

## Deploy: GitHub + Railway (recommended)

### 1) Push to GitHub

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

### 2) Deploy on Railway (GitHub integration)

1. Go to Railway dashboard and choose "New Project" → "Deploy from GitHub".
2. Select your repository.
3. Railway will auto-detect a Node app via `package.json` and use `npm start`.
4. In Project → Variables, add:
   - `AGORA_APP_ID`
   - `AGORA_APP_CERTIFICATE`
   - (optional) `PORT` — Railway injects a port; server already respects `process.env.PORT`.
5. Click "Deploy". On success, open the generated domain and hit `/` to verify.

### Alternative: Railway CLI

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

## Notes

- Tokens expire after 24 hours by default. Adjust `EXPIRATION_TIME` in `server.js` if needed.
- Keep `AGORA_APP_CERTIFICATE` secret; never commit it.
- CORS is enabled globally; tighten origins in production if required.
