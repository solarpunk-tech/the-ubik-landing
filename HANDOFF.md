# Handoff — the-ubik-landing

## Current status

- Repo path: `/Users/shubhranshujha/Codex/the-ubik-landing`.
- The old static HTML/CSS site has been rewritten as Vite + React 18 + TypeScript + Tailwind v4 + shadcn `radix-nova` / Mist.
- shadcn preset is configured in `components.json`, with registries for `@svgl`, `@manifest`, and `@dotmatrix`.
- Dotmatrix loaders are installed from the registry and imported through `src/components/dotmatrix-loader.css`.
- A deterministic large-scale bitmatrix visual system is implemented in `src/components/landing/MatrixField.tsx`.
- Additional dotmatrix registry loaders are available for accents: `dotm-square-1`, `dotm-square-6`, `dotm-circular-4`, and `dotm-triangle-15`.

## Implemented

- Landing page, `/try`, `/security`, `/privacy-policy`, and `/terms-of-service` are React routes.
- `/security` is a CTO-specific memo with the CTA "Share this with your tech team".
- `/try` remains a stub and uses `src/lib/try.ts` with `VITE_TRY_TARGET=stub | razorpay | app`.
- Payment-gateway copy is intentionally kept out of public pages until the paid handoff is live.
- Logo assets are centralized in `src/lib/brand.ts` and loaded from `public/`.
- Desktop nav uses the wordmark; compact/mobile nav uses the favicon mark to preserve CTA/menu space.
- Top nav is intentionally concise: Product, How it works, Journal, Trust, Try now. Privacy and Terms live in the footer only.
- i18n JSON was migrated from root `locales/` to `src/locales/<lang>/common.json`.
- GEO support files live in `public/llms.txt`, `public/robots.txt`, and `public/sitemap.xml`.
- Landing copy now focuses on Ubik as the operator layer above CRM, programs, ERP, inbox, files, meetings, and the sales stack.
- `src/components/landing/ProductSurface.tsx` replaces the generic feature-card grid with a CRM/programs/ERP/sales-stack to Ubik to reviewed-output preview.
- `/how-it-works` is the deeper workflow story with prototype slots for future Loom or product journeys.
- `/blog` and `/blog/:slug` are static editorial shells with a square share panel and copy-success animation.
- Missing source-system logo assets should be added under `public/integrations/` and mapped from `src/lib/landing-content.ts`; current expected names include `whatsapp.svg`, `google-docs.svg`, `oracle.svg`, `odoo.svg`, `zoho.svg`, and `power-bi.svg`.
- Landing-created UI labels, buttons, inputs, cards, dialog/sheet-like surfaces, tabs, tooltips, and nav primitives have been squared off; dotmatrix dots remain circular by design.
- The hero now has a vertical seafood/category ticker, soft-blur text reveal, and animated multi-app operating queue.
- Footer includes the Solarpunk credit line and public Solarpunk logo assets.
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
  - Copy pass mobile: `verification/copy-pass-home-mobile.png`
  - Copy pass iPad: `verification/copy-pass-home-ipad.png`
  - Copy pass 13-inch: `verification/copy-pass-home-13in.png`
  - Copy pass 13-inch full page: `verification/copy-pass-home-13in-full.png`
  - Copy pass 15-inch: `verification/copy-pass-home-15in.png`
  - Copy pass wide: `verification/copy-pass-home-wide.png`
  - Nav/copy reduction mobile: `verification/nav-copy-reduction-mobile.png`
  - Nav/copy reduction iPad: `verification/nav-copy-reduction-ipad.png`
  - Nav/copy reduction 13-inch: `verification/nav-copy-reduction-13in.png`
  - Nav/copy reduction 13-inch full page: `verification/nav-copy-reduction-13in-full.png`
  - Nav/copy reduction wide: `verification/nav-copy-reduction-wide.png`
  - Comment pass mobile: `verification/comment-pass-mobile.png`
  - Comment pass iPad: `verification/comment-pass-ipad.png`
  - Comment pass laptop: `verification/comment-pass-laptop.png`
  - Comment pass wide: `verification/comment-pass-wide.png`
  - How/blog square pass mobile: `verification/how-blog-square-mobile.png`
  - How/blog square pass iPad: `verification/how-blog-square-ipad.png`
  - How/blog square pass laptop: `verification/how-blog-square-laptop.png`
  - How/blog square pass wide: `verification/how-blog-square-wide.png`
  - How page laptop: `verification/how-page-laptop.png`
  - Blog index laptop: `verification/blog-page-laptop.png`
  - Share success laptop: `verification/blog-share-success-laptop.png`

## Latest visual delta

- The ticker now uses a Phosphor food icon instead of the Ubik mark.
- The homepage How band is now a compact prototype-slot carousel; `/how-it-works` carries the full workflow carousel.
- The Journal preview and `/blog` route are live with sparse editorial cards and a square share panel.
- The Solarpunk footer credit is a full IBM Plex Mono link to `https://solarpunk.technology`.
- Verified no horizontal overflow at 390, 768, 1366, and 1728 px.
- Latest browser-comment pass:
  - Ticker rows now use different food/category Phosphor icons.
  - First proof stat now reads `800+ trade skills`.
  - Logistics uses `public/integrations/Maersk_Group_Logo.svg`.
  - Product surface center panel now reads `Trade intelligence personalised.` with white text and a black selected `Signal` chip.
  - Homepage Journal preview no longer shows the share panel.
  - Blog article share starts as a compact `Share field note` callout and expands to X, WhatsApp, LinkedIn, email, and copy; copy success is blue/white.
  - Mobile menu trigger uses plus/close state and the sheet content has proper side padding.
  - `/how-it-works` CTA now reads `Automate my workflows`.
  - Solarpunk footer mark has a 6px radius.
- Latest visual evidence:
  - Comment fixes home mobile: `verification/comment-fixes-home-mobile-v2.png`
  - Comment fixes menu mobile: `verification/comment-fixes-menu-mobile-viewport.png`
  - Comment fixes blog share collapsed: `verification/comment-fixes-blog-share-collapsed-v2.png`
  - Comment fixes blog share expanded: `verification/comment-fixes-share-viewport.png`
- Latest round 2 comment pass:
  - Live queue final row changed to `Invoice verification` with Zoho + Tally and finance-ops copy.
  - Wordmark integrations in compact queue rows can render as full-width logo-only tiles; if `public/integrations/tally.svg` is missing, the tile falls back to text.
  - Logistics now uses `public/integrations/MAERSK-B.CO.svg`.
  - Source-system `Trade docs` uses the shadcn-installed `@svgl/pdf` icon and `PDFs` metadata.
  - Source-system `Conversations` replaces the repeated WhatsApp title.
  - How-it-works media panels now use real product media from `public/prototypes/`.
  - Mobile menu trigger is borderless/backgroundless, blue while closed and black while open; the extra sheet separator was removed.
  - Latest visual evidence:
    - Round 2 home mobile: `verification/comment-round2-home-mobile.png`
    - Round 2 how mobile: `verification/comment-round2-how-mobile.png`
    - Round 2 menu mobile: `verification/comment-round2-menu-mobile.png`

## Prototype media

- Real product media now lives under `public/prototypes/`.
- Current Loom videos: `home-task-nav.mp4`, `inbox-navigation.mp4`, `meeting-nav.mp4`, `know-anything-navigation.mp4`.
- Poster frames live under `public/prototypes/posters/`.
- VMI screenshots live under `public/prototypes/screenshots/`.
- Recommended future formats: `webm` or small `mp4` for video, `webp` or optimized `png` for screenshots, and animated `webp` or short `mp4` instead of heavy GIFs.
- Accounting-region queue logic:
  - `PO -> ERP -> Accounting` resolves the accounting tile from browser locale/timezone.
  - India (`en-IN`, `Asia/Kolkata`) shows Tally from `public/integrations/tally logo india.png`.
  - Europe locales/timezones show Sage from `public/integrations/Sage_logo.png`.
  - US/default shows the shadcn-installed `@svgl/microsoft-excel` icon.
  - Latest evidence: `verification/accounting-region-home-india-mobile.png`.
- Latest heading/queue emphasis pass:
  - Hero H1 now reads `Personalised Workspace for Perishable Trade` with `Workspace` emphasized in primary blue.
  - Hero lede uses block reveal instead of per-character blur and emphasizes `$300M+` in primary blue.
  - Live queue header and inactive rows use clean `bg-card` surfaces instead of `bg-shell`/translucent grey treatment.
  - The `PO -> ERP -> Accounting` row uses the same compact logo-chip convention as the rows above; India evidence shows Zoho + Tally.
  - Latest evidence: `verification/heading-queue-pass-desktop-v2.png`.
- Latest pricing pass:
  - Added `/pricing` and linked it from the top/mobile nav.
  - Pricing now uses two plans only: `Base` and `Enterprise`.
  - Ubik Local is an included desktop add-on inside both plans, with a subtle included-product strip below the cards.
  - Monthly/annual toggle only changes Base from `$100 / month` to `$85 / month` and shows `Save 15%`.
  - Main FAQ and pricing FAQ now include the requested `What data is shared with LLMs?` answer.
  - `public/llms.txt` was replaced with the supplied first-version LLM index, and `/pricing` was added to `public/sitemap.xml`.
  - Latest evidence: `verification/pricing-desktop.png`, `verification/pricing-mobile.png`, `verification/pricing-desktop-annual.png`, `verification/pricing-mobile-annual.png`.
- Latest pricing cleanup:
  - Base and Enterprise cards now show 5 bullets each.
  - Enterprise no longer repeats the Ubik Local add-on bullet; it inherits through `Everything in Base`.
  - Removed `where supported` from visible pricing copy.
  - Ubik Local strip now uses `Computer and browser use` plus `Ubik` wordmark + `Local`, with pills for local recorder, desktop bridge, private file encryption, and device-held credentials.
  - Pricing FAQ now has five expandable doubts with paragraph spacing and a left rule for readable answers.
  - Latest evidence: `verification/pricing-crisp-desktop.png`, `verification/pricing-crisp-mobile.png`, `verification/pricing-crisp-faq-viewport.png`.
- Latest browser comment pass:
  - Removed named customer/company examples from homepage How copy, blog title/excerpt, and visible FAQ/content notes; examples are now customer-safe descriptions such as a large vertically integrated seafood conglomerate and a US processor.
  - Blog article share affordance is no longer a tall bordered desktop block; it is a compact sticky reader-side callout with transparent chrome and the expanded panel keeps the same lightweight treatment.
  - Pricing Ubik Local wordmark is larger inside the same included-product strip without changing the strip size.
  - Verification: `pnpm lint` passes, `pnpm build` passes, and browser text checks for `/`, `/blog`, and `/blog/buyer-follow-up-to-order-packet` find no named examples.
  - Latest evidence: `verification/comment3-names-home-mobile-after-v2.png`, `verification/comment3-blog-index-mobile-after-v2.png`, `verification/comment3-share-desktop-after-v2.png`, `verification/comment3-pricing-local-after-v2.png`.

## Next notes

- Replace privacy and terms copy when the final legal text is shared.
- If final logo filenames change, update only `src/lib/brand.ts`.
- Browser plugin DOM verification and Playwright screenshot capture were used for the final comment pass.
