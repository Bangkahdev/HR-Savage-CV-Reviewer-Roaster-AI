# Changelog — HR Savage CV Reviewer & Roaster AI

All notable changes to this project are documented in this file.

## [2.0.0] — Soft UI & Production Hardening

### Breaking Changes
- Renamed project from `react-example` to `hr-savage-cv-reviewer-roaster-ai`.
- Downgraded React from 19 → 18, Vite from 6/8 → 5, Express from 5 → 4 for broader compatibility.
- `@google/genai` updated to `^1.0.0`; removed unstable `gemini-3.7-flash` fallback models.

### Added
- **CORS middleware** with configurable `ALLOWED_ORIGINS` env var.
- **Rate limiting**: global limiter (100 req/15min/IP) + AI endpoint limiter (20 req/15min/IP).
- **Zod input validation** on all API endpoints with clear 400 error messages.
- **`/api/quick-roast`** endpoint (previously documented but missing from implementation).
- Type-safe Gemini response wrapper (`GeminiTextResponse`).
- `focus-ring-soft`, `soft-glass`, `soft-shadow`, `soft-glow` utility CSS classes.
- Page fade-in animation (`page-fade`).
- `MAINTENANCE.md` operator guide.

### Changed
- **UI/UX redesign** — soft styling: slate-50 background, coral/amber/emerald accent palette, rounded-3xl cards, glassmorphism, softer shadows, smoother transitions.
- `tsconfig.json` — enabled `strict`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`.
- `vite.config.ts` — corrected `@` path alias to `./src`, added production `rollupOptions` manual chunks, `emptyOutDir`, sourcemaps.
- `vercel.json` — added `framework: null`, `buildCommand: "npm run build"`, env var references.
- `server.ts` — already skips `app.listen` when `process.env.VERCEL === "1"` (serverless-safe).

### Removed
- Duplicate `@tailwindcss/vite` and `vite` entries from devDependencies.
- Unstable Gemini model candidates (`gemini-3.7-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`).

### Fixed
- `api/app.ts` — replaced all `any` with typed interfaces and Zod schemas.
- CORS no longer uses wildcard; restricted to known origins in production.
- Rate-limit headers now use standard `RateLimit-*` headers.

### Security
- API key never exposed to client (server-side only).
- Request payloads limited to 25MB.
- CORS origin whitelist via `ALLOWED_ORIGINS`.
- Per-IP rate limiting on AI endpoints to prevent abuse.
