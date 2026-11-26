# Maintenance Guide — HR Savage CV Reviewer & Roaster AI

Operational documentation for maintaining and deploying this application.

## Project Structure

```
.
├── api/
│   ├── app.ts          # Express app with all /api/* routes + middleware
│   └── index.ts        # Vercel serverless entry (re-exports app)
├── server.ts           # Local dev server (Vite middleware + Express)
├── src/
│   ├── App.tsx         # Root shell, mode switching, global state
│   ├── components/     # React feature components
│   ├── data/           # Sample CVs
│   ├── types.ts        # TypeScript interfaces (shared frontend/backend)
│   ├── utils/
│   │   ├── api.ts      # safeFetchJson client helper
│   │   └── helpers.ts  # PDF export, score theme, confetti
│   ├── index.css       # Tailwind + custom soft UI utilities
│   ├── main.tsx        # React entry
│   └── vite-env.d.ts
├── docs/
│   ├── API.md          # Full endpoint reference
│   └── ARCHITECTURE.md # System design & data flow
├── vercel.json         # Vercel deployment config
├── vite.config.ts      # Vite build config
├── tsconfig.json       # TypeScript config (strict mode)
├── package.json        # Dependencies & scripts
└── .env.example        # Environment variable template
```

## Environment Variables

Copy `.env.example` to `.env` (local) or set in Vercel Dashboard > Settings > Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/)) |
| `APP_URL` | No | Base URL of the app (default `http://localhost:3000`) |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins (default: localhost) |
| `NODE_ENV` | No | `development` or `production` |

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start local dev server on port 3000 (Vite middleware mode) |
| `npm run build` | Build frontend (Vite) + bundle backend (esbuild → `dist/server.cjs`) |
| `npm run start` | Run production server from `dist/server.cjs` |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm run preview` | Build then start production server |

## Deployment to Vercel

1. Connect the GitHub repository to Vercel.
2. Set build command: `npm run build` (already in `vercel.json`).
3. Set output directory: `dist`.
4. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `APP_URL` (your Vercel domain, e.g. `https://your-app.vercel.app`)
   - `ALLOWED_ORIGINS` (e.g. `https://your-app.vercel.app`)
5. Vercel will route `/api/*` to `api/index.ts` (serverless function).
6. Frontend static assets served from `dist/`.

**Note:** `server.ts` checks `process.env.VERCEL !== "1"` before calling `app.listen()`, so it will not try to start a long-running server in Vercel's serverless environment.

## Backend Architecture

- **Express** app in `api/app.ts`, exported as default.
- All AI endpoints are rate-limited (`aiLimiter`: 20 req / 15 min / IP).
- Global limiter (`globalLimiter`: 100 req / 15 min / IP) applies to `/api/*`.
- CORS is configured via `cors()` with `ALLOWED_ORIGINS` whitelist.
- All request bodies validated with **Zod** schemas before reaching business logic.
- Gemini client created per-request via `getGeminiClient()`; API key read from env.
- `generateWithRetry()` falls back across stable Gemini models on 429/5xx.
- Unsupported/unstable model names removed (only `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash-latest`, `gemini-1.5-pro-latest`).

## Frontend Architecture

- **React 18** + **TypeScript**, built with **Vite 5**.
- **Tailwind CSS** with custom soft UI utilities in `src/index.css`.
- State lives in `App.tsx` (mode, results, loading, error).
- Components under `src/components/`: CV input, review dashboard, GitHub roaster, digital footprint, HR chat, bullet rewriter, loading animation, header.
- API calls go through `safeFetchJson()` in `src/utils/api.ts` (timeout, HTML error detection, JSON parsing).

## Type Safety

- `tsconfig.json` runs in `strict` mode with `noUncheckedIndexedAccess`.
- Backend request bodies validated with Zod schemas.
- Shared TypeScript interfaces in `src/types.ts` and `api/app.ts`.
- Run `npm run lint` before committing to catch type errors.

## PDF Export

- Generated client-side with **jspdf** (`src/utils/helpers.ts`).
- Includes score, grade, verdict, roast, red flags, and action plan.
- File name: `Audit_CV_HRSavage_<role>.pdf`.

## Troubleshooting

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| `GEMINI_API_KEY belum dikonfigurasi` | Missing env var | Set `GEMINI_API_KEY` in `.env` or Vercel dashboard |
| 429 / quota exceeded | Gemini rate limit | Wait, or add another API key; check `ALLOWED_ORIGINS` |
| CORS error | Origin not whitelisted | Add your domain to `ALLOWED_ORIGINS` |
| Build fails | Type error | Run `npm run lint` and fix reported issues |
| Vercel 502 on `/api/*` | API route misconfigured | Verify `vercel.json` rewrites point to `/api/index.ts` |

## Adding a New API Endpoint

1. Add a Zod validation schema in `api/app.ts`.
2. Add the Express route with `aiLimiter` middleware.
3. Wrap logic in try/catch; use `formatErrorMessage()` for Gemini errors.
4. Return `{ success: true, data: ... }` or `{ success: false, error: ... }`.
5. Document the endpoint in `docs/API.md`.
6. Add a TypeScript interface to `src/types.ts` if the frontend consumes it.
7. Run `npm run lint` and `npm run build`.
