# CV Generator

Next.js CV builder with MongoDB, Auth.js, AI assist, and PDF export.

## Local development

1. Copy `.env.example` to `.env.local` and fill in values (see [Environment variables](#environment-variables)).
2. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Themes, dark mode and languages

The globe button (navbar, auth pages, dashboard sidebar, builder header) opens the preferences menu:

- **Languages:** English, Español, Français, Deutsch, العربية (right-to-left) and 中文. Strings live in `lib/i18n/dictionaries/`; `en.ts` is the source shape and every other locale is type-checked against it. `lib/i18n/dictionaries.test.ts` checks placeholders and array lengths.
- **Themes:** Violet, Ocean, Emerald, Rose and Sunset. Brand colours are CSS variables in `app/tokens.css`.
- **Appearance:** Light, Dark or System.

Choices are stored in the `cvg-locale`, `cvg-theme` and `cvg-mode` cookies and applied on the server, so pages render without a flash. Without a cookie, the language comes from the browser's `Accept-Language`. Dark sections and the CV paper use the `scheme-light` class to keep the light palette. Legal documents and server error messages are English only.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (`tsx --test lib/**/*.test.ts`) |

## Environment variables

All configuration is **server-only** (this app does not use `NEXT_PUBLIC_*` for secrets).

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Yes (runtime) | MongoDB connection string |
| `MONGODB_DB_NAME` | Yes (runtime) | Database name (use separate names per environment) |
| `AUTH_SECRET` | Yes in production | `openssl rand -base64 32` |
| `AUTH_URL` | Recommended in production | e.g. `https://your-app.vercel.app` |
| `AUTH_GOOGLE_ID` | Optional | Both Google vars required to enable Google sign-in |
| `AUTH_GOOGLE_SECRET` | Optional | OAuth client secret |
| `OPENAI_API_KEY` | Optional | AI features disabled when unset |
| `AI_MODEL` | Optional | Defaults to `gpt-4o-mini` |
| `AI_BASE_URL` | Optional | OpenAI-compatible API base URL |

See `.env.example` for a safe template to commit. Never commit `.env` or real credentials.

## Production deployment (Vercel)

### Prerequisites

- [MongoDB Atlas](https://www.mongodb.com/atlas) (or compatible) cluster
- Vercel project linked to this repository
- (Optional) Google Cloud OAuth client for Google sign-in
- (Optional) OpenAI API key for AI assist

### MongoDB

1. Create a cluster and database user with read/write access.
2. Allow network access from Vercel (Atlas: **Network Access** ΓåÆ allow `0.0.0.0/0` or Vercel static IPs if you restrict).
3. Copy the connection string into Vercel as `MONGODB_URI`.
4. Set `MONGODB_DB_NAME` to a production-specific name (e.g. `cv-generator-production`).

The app reuses a cached Mongoose connection across serverless invocations (`lib/db/connect.ts`).

### Auth.js on Vercel

1. Set `AUTH_SECRET` (32+ random characters) for **Production** (and Preview if you test auth there).
2. Set `AUTH_URL` to your deployment URL, e.g. `https://your-app.vercel.app`.
3. `trustHost` is enabled in `auth.config.ts` for hosted deployments.

**Email/password** signup works when MongoDB and `AUTH_SECRET` are configured.

### Google OAuth (optional)

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Create an OAuth 2.0 **Web application** client.
2. **Authorized redirect URI:** `https://your-app.vercel.app/api/auth/callback/google`  
   (Add `http://localhost:3000/api/auth/callback/google` for local dev.)
3. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in Vercel.

### OpenAI (optional)

Set `OPENAI_API_KEY` in Vercel. Optionally override `AI_MODEL` or `AI_BASE_URL` for compatible providers.

### Deploy on Vercel

1. Import the Git repository in Vercel.
2. **Framework preset:** Next.js  
3. **Build command:** `npm run build` (default)  
4. **Install command:** `npm install` (default)  
5. Add environment variables for Production (and Preview as needed).
6. Deploy.

PDF export uses the **Node.js** runtime (`@react-pdf/renderer`) on `GET /api/cv/[id]/export`.

### Post-deployment smoke tests

Run through this checklist on the production URL:

1. [ ] Homepage loads
2. [ ] Signup (email/password) works
3. [ ] Google login works (when Google OAuth is configured)
4. [ ] Login and logout work
5. [ ] Dashboard loads for signed-in users
6. [ ] CV creation works
7. [ ] CV editing and autosave work
8. [ ] Template switching works
9. [ ] AI features work (when `OPENAI_API_KEY` is set)
10. [ ] PDF export downloads a valid file
11. [ ] Unauthorized CV access is rejected (signed out or another userΓÇÖs CV id)
12. [ ] Production build succeeded in Vercel (deploy logs)

## Architecture notes

- **Auth:** JWT sessions; dashboard routes protected via `proxy.ts` (Next.js 16 proxy convention).
- **CV access:** Server actions and APIs enforce ownership via `getCurrentUser` and `checkCvOwnership`.
- **PDF export:** Server reads saved CV from MongoDB; client sends only the CV id.
