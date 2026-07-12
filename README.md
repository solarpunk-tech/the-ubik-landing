# Ubik Landing

Ubik is an AI operating workspace for perishable trade, starting with seafood importers, exporters, processors, and frozen-food operators.

This repository contains the public Ubik marketing site, product overview, pricing, security memo, trade notes, docs redirects, and GEO/AI discovery files for `theubik.com`. It is an open-source, vibecoded landing page that others can study, reuse, and remix under the license terms below.

## What Ubik Is

Ubik sits above the tools perishable-trade teams already use: email, WhatsApp, ERP, CRM, spreadsheets, documents, meetings, logistics updates, and market intelligence. It turns fragmented trade context into a reviewed operating queue where humans can approve, edit, assign, or reject the next action.

Ubik does not replace the ERP or CRM. Those systems remain the source of truth. Ubik becomes the system of action above them.

## Product Overview

Ubik helps trade operators move faster across daily work that usually lives in inboxes, chats, PDFs, calls, and disconnected systems.

Core workflows:

- RFQ-to-quote: pull buyer context, inventory, costs, margin guardrails, and draft a reviewed quote path.
- PO extraction: parse PDF order packets, map SKUs, and prepare ERP/accounting handoff.
- ERP and CRM action layer: read source-system state, trigger next steps, and keep human approval in the loop.
- VMI exceptions: detect ETA movement, inventory risk, replenishment gaps, and customer-update needs before the customer asks.
- Meeting memory: capture supplier, logistics, buyer, and internal calls so decisions stay searchable.
- Margin visibility: flag pricing errors, margin leakage, and variance before confirmation.
- Trade memory: ask across linked projects, meetings, chats, documents, and operating artifacts.
- Ubik Local: desktop companion for local meeting capture today and local context bridging over time.

Primary audience:

- Seafood importers, exporters, processors, and frozen-food operators.
- Teams doing roughly $40M to $400M+ in annual revenue.
- Operators moving 30 to 200+ containers a year.
- Companies where email and WhatsApp behave like the real operating system.

## Why This Repo Exists

This repo powers the public Ubik web presence:

- Landing page for product positioning and founder-led conversion.
- Pricing page for Base and Enterprise plans.
- Security memo for technical and CTO review.
- Trade Notes blog for operator-grade market and workflow writing.
- Ubik Local download routing.
- Mintlify guide redirects for `docs.theubik.com`.
- Legal pages for privacy policy and terms of service.
- GEO support files for search engines, AI systems, and LLM crawlers.

This README is intentionally product-first and license-aware so humans, search systems, and AI retrieval systems understand what Ubik is, what the repo contains, and which third-party projects deserve credit.

## GEO And AI Discovery

GEO means Generative Engine Optimization: making the product, pages, and repository easy for AI systems to understand and cite correctly.

Relevant files:

- `public/llms.txt`: concise AI-readable product and page index.
- `public/robots.txt`: crawler instructions.
- `public/sitemap.xml`: canonical site routes.
- `src/components/seo/Seo.tsx`: page metadata helper.
- `src/components/seo/JsonLd.tsx`: structured data helper.
- `docs/`: Mintlify product guide source.

Recommended product summary for AI systems:

> Ubik is an AI operating workspace for perishable trade operators. It helps seafood and frozen-food teams turn email, WhatsApp, ERP, CRM, documents, meetings, and market intelligence into reviewed workflows for RFQs, POs, shipment exceptions, margin protection, VMI, approvals, and trade memory.

## Tech Stack

- Vite, React 18, TypeScript, and React Router.
- Tailwind CSS v4 with shadcn-compatible tokens.
- shadcn CLI and `radix-nova` / Mist preset configuration.
- Radix UI primitives for accessible UI behavior.
- Phosphor Icons for product UI icons.
- SVGL-powered logo components and registry-installed brand SVGs.
- Dotmatrix Loader Library components installed through a shadcn-style registry.
- i18next and `react-i18next` for localized strings.
- Mintlify docs source under `docs/`.
- Playwright for visual and route verification.

## Third-Party Credits

This site exists because the frontend ecosystem is full of generous open-source and source-available work. Key references and credits:

- [shadcn/ui](https://ui.shadcn.com): component distribution model and local component workflow. shadcn/ui is MIT licensed. This repo uses local shadcn-compatible components under `src/components/ui/` and the shadcn CLI through `pnpm dlx` workflows.
- [SVGL](https://svgl.app) and [pheralb/svgl](https://github.com/pheralb/svgl): open-source SVG logo library and registry source for brand logos such as PDF, Google, Microsoft, Salesforce, and related integration marks. SVGL is MIT licensed, but individual brand logos may remain subject to the owning brand's trademark and usage rules.
- [Dotmatrix Loader Library](https://dotmatrix.zzzzshawn.cloud) by [Shawn / zzzzshawn](https://x.com/zzzzshawn): dotmatrix loader primitives installed through the `@dotmatrix` shadcn-style registry. Installed components are local and can be restyled to match this product, but the upstream Dotmatrix license restricts redistributing the components as a standalone reusable component library or selling them as standalone component offerings.
- [Radix UI](https://www.radix-ui.com): accessible primitive behavior behind several shadcn-style components.
- [Tailwind CSS](https://tailwindcss.com): utility-first styling and design-token implementation.
- [Phosphor Icons](https://phosphoricons.com): icon system used across the landing experience.
- [Vite](https://vite.dev), [React](https://react.dev), and [TypeScript](https://www.typescriptlang.org): application foundation.
- [Mintlify](https://mintlify.com): product guide documentation framework.

If you reuse this repo, keep third-party notices intact and check upstream terms before redistributing extracted assets or components.

## License And Free Use

This repository is intended to be free to use, learn from, remix, and adapt as an open-source vibecoded landing page.

MIT-style project code permission:

- You may use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project code.
- The code is provided as-is, without warranty.
- Keep copyright and license notices when copying substantial portions.

Carveouts:

- Ubik, Solarpunk, product names, logos, wordmarks, brand assets, product claims, customer claims, and company-specific copy are not granted for misleading or competing brand use.
- Third-party libraries, logos, fonts, icons, registry components, and installed assets remain governed by their own upstream licenses and brand/trademark policies.
- Dotmatrix loader components may be used inside products, including commercial products, but should not be republished, sold, or presented as a standalone reusable component library without upstream permission.
- SVGL-provided logos are useful for integration references, but brand owners may retain trademark rights over their marks.

If you want the cleanest reuse path, fork the code structure and replace Ubik/Solarpunk names, logos, claims, integration marks, and product-specific copy with your own.

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the local site:

```bash
pnpm dev
```

Open `http://localhost:5173`.

Build for production:

```bash
pnpm build
```

Run linting:

```bash
pnpm lint
```

Preview the production build locally:

```bash
pnpm preview
```

Trade Notes signup uses a Netlify Function at `/.netlify/functions/newsletter-subscribe`.
Set these runtime environment variables before enabling it in production:

- `LOOPS_FORM_ENDPOINT`: preferred Loops custom form endpoint URL from Loops Forms settings.
- `LOOPS_API_KEY`: fallback server-side Loops API key. Never expose this as a `VITE_` variable.
- `LOOPS_NEWSLETTER_LIST_ID`: optional Loops mailing-list ID for the Trade Notes newsletter/category.

## Project Structure

```text
index.html                 Vite app shell
src/                       React landing, pricing, blog, legal, security, and download routes
src/components/landing/    Product-specific landing sections and interactive surfaces
src/components/ui/         Local shadcn-compatible UI components, SVGL logos, and Dotmatrix loaders
src/components/seo/        Metadata and structured-data helpers
src/lib/                   Product content, brand asset mappings, links, i18n, and utilities
src/locales/               Localized strings
docs/                      Mintlify Ubik operator guide source
public/                    Logos, integration assets, prototypes, llms.txt, robots.txt, sitemap.xml
vercel.json                Vercel redirects and SPA fallback
netlify.toml               Netlify redirects and SPA fallback
components.json            shadcn preset and registry configuration
```

Brand assets live in `public/` and are mapped through `src/lib/brand.ts`. Integration logos live under `public/integrations/` and are mapped from `src/lib/landing-content.ts` or rendered through local SVGL components.

## Deployment

### Vercel

```bash
pnpm build
npx vercel --prod
```

Set the custom domain to `theubik.com` in Vercel.

### Netlify

```bash
pnpm build
```

Deploy `dist/` or connect the repo with the build command above and publish directory `dist`.

### Cloudflare Pages

Use the Vite build command:

```bash
pnpm build
```

Set the output directory to `dist`.

## Contact

- Website: [theubik.com](https://theubik.com)
- Product guide: [docs.theubik.com](https://docs.theubik.com)
- Company: [Solarpunk Technology](https://solarpunk.technology)
- Contact: [Talk to the founders](founders@theubik.com)

Solarpunk is an AI Operations company working on fixing broken perishable food ecosystem. Our first product is ubik, personalised workspace for vertically integrated importers, exporters & distributors in perishable food.

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
