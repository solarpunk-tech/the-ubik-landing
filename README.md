# Ubik Landing

Static marketing site for **Ubik** — the AI operator workbench.

Built to satisfy Google OAuth verification requirements:

- Homepage (`/`) explains the purpose of the app.
- Brand name matches the OAuth consent screen (**Ubik**).
- Privacy Policy (`/privacy-policy`) and Terms of Service (`/terms-of-service`) are linked from the homepage.

## Files

```
index.html              Vite app shell
src/                    React landing, try-now, legal, and security memo routes
src/index.css           Tailwind v4 + shadcn Mist tokens
public/                 Logo, favicon, llms.txt, robots.txt, sitemap.xml
vercel.json             Clean URL redirects and SPA fallback
```

Vite + React + TypeScript + Tailwind v4 + shadcn.

## Brand assets

Logo assets live under `public/`:

- `public/logo-light.png` — light favicon/mark.
- `public/logo-dark.png` — dark favicon/mark.
- `public/logo-wordmark-light.png` — light wordmark.
- `public/logo-wordmark-dark.png` — dark wordmark.
- `public/favicon-light.png` and `public/favicon-dark.png` — browser icons.

React loads these paths through `src/lib/brand.ts`, so filename changes only need one mapping update.

## Try-now and payments

The `/try` page is a stub today. It captures early-access intent and keeps the future handoff isolated in `src/lib/try.ts`.

Future Vite rewrite target:

```bash
VITE_TRY_TARGET=stub | razorpay | app
```

Payment handoff remains internal until the paid flow is ready; the public site should only describe early-access workflow scoping.

Missing integration logos can be added under `public/integrations/` and mapped once in `src/lib/landing-content.ts`.

## Local preview

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.

## Deploy

### Vercel
```bash
pnpm build
npx vercel --prod
```
Then set your custom domain (`theubik.com`) in the Vercel dashboard.

### Netlify
Run `pnpm build`, then deploy `dist`.

### Cloudflare Pages
Create a Pages project and point it at this folder (no build command, output `/`).

## After deploying

1. Point **theubik.com** DNS at the host you chose.
2. In the Google Cloud Console → **OAuth consent screen**, set:
   - **Application homepage** → `https://theubik.com/`
   - **Application privacy policy link** → `https://theubik.com/privacy-policy`
   - **Application terms of service link** → `https://theubik.com/terms-of-service`
3. Reply to the Google Trust & Safety thread that the issues have been resolved.

## What this fixes on the Google verification page

- ✅ *Your homepage does not explain the purpose of your app* → the hero + "What Ubik does" sections describe the purpose clearly.
- ✅ *App name on OAuth consent screen does not match the app name on your homepage* → the homepage is branded **Ubik** (matching the consent-screen name), hosted at **theubik.com** (matching the app domain).
