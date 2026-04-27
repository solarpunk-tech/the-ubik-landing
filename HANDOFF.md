# Handoff — the-ubik-landing

## Current status

- Repo path: `/Users/shubhranshujha/Codex/the-ubik-landing`.
- The old static HTML/CSS site has been rewritten as Vite + React 18 + TypeScript + Tailwind v4 + shadcn `radix-nova` / Mist.
- shadcn preset is configured in `components.json`, with registries for `@svgl`, `@manifest`, and `@dotmatrix`.
- Dotmatrix loaders are installed from the registry and imported through `src/components/dotmatrix-loader.css`.
- A deterministic large-scale bitmatrix visual system is implemented in `src/components/landing/MatrixField.tsx`.

## Implemented

- Landing page, `/try`, `/security`, `/privacy-policy`, and `/terms-of-service` are React routes.
- `/security` is a CTO-specific memo with the CTA "Share this with your tech team".
- `/try` remains a stub and uses `src/lib/try.ts` with `VITE_TRY_TARGET=stub | razorpay | app`.
- Razorpay is the planned international gateway; legacy payment copy has been removed.
- Logo assets are centralized in `src/lib/brand.ts` and loaded from `public/`.
- Desktop nav uses the wordmark; compact/mobile nav uses the favicon mark to preserve CTA/menu space.
- i18n JSON was migrated from root `locales/` to `src/locales/<lang>/common.json`.
- GEO support files live in `public/llms.txt`, `public/robots.txt`, and `public/sitemap.xml`.
- Landing copy now targets seafood, perishables, and trade operations workflows: inquiry autopilot, PO-to-order review, shipment visibility, quality/compliance packets, and ERP-ready handoffs.
- Gmail research was read-only and used only to extract broad positioning from Hemanth-led outreach; no email was sent, forwarded, or modified.

## Verification

- `pnpm lint` passes.
- `pnpm build` passes.
- Repository search for old gateway/CTA/color utility strings returns no matches.
- Playwright screenshots were captured after a 2s route wait so lazy-loaded pages render beyond the fallback.
- Visual evidence:
  - Before: `verification/before-origin-main-home.png`
  - Final desktop: `verification/final-home-desktop.png`
  - Final mobile: `verification/final-home-mobile.png`
  - Final iPad portrait: `verification/final-home-ipad.png`
  - Final tablet landscape: `verification/final-home-tablet-landscape.png`
  - Final large desktop: `verification/final-home-large.png`
  - Final security wide: `verification/final-security-wide.png`
  - Final try laptop: `verification/final-try-laptop.png`

## Next notes

- Replace privacy and terms copy when the final legal text is shared.
- If final logo filenames change, update only `src/lib/brand.ts`.
- Browser plugin tools were unavailable in this session, so Playwright Chromium was used for screenshot verification.
