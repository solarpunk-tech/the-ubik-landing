# Ubik Brand, UI, Creative, And Metadata System

This dossier is the public-site reference for Ubik across marketing, pricing, trust, editorial, download, and legal pages. It is grounded in the current React/Tailwind implementation and should guide future page work, metadata updates, and visual QA.

## Brand Position

Ubik is decision intelligence for frozen food trade operations. The product sits above the tools operators already use: CRM, ERP, email, WhatsApp, spreadsheets, shared drives, calendars, and local meetings. It reads operational state, prepares reviewed actions, and keeps humans in control before work moves.

The brand should feel precise, operational, and trusted. It is not a generic AI assistant, a chat wrapper, or a broad productivity suite. The strongest framing is:

- Frozen food importers, exporters, processors, and operator-led trade teams.
- Reviewed action, not autonomous mystery work.
- Evidence, context, approval, and audit as everyday product behavior.
- Trade workflows that move from RFQ, PO, shipment, margin, lot, and customer context into one reviewed action queue.

Use frozen food as the site-wide category term unless a researched editorial note is specifically about seafood, shrimp, or another narrower commodity. On-page copy, metadata, image alt text, OG/Twitter copy, and JSON-LD descriptions should match the same terminology.

## Audience And Voice

Marketing pages speak to operators who live in inboxes, spreadsheets, ERPs, WhatsApp, and customer exceptions. The voice should be direct, concrete, and workflow-literate. Say what changes in the operator day.

Trust and security pages speak to customer admins, founders, IT reviewers, and commercial leaders. The voice should be calm, scoped, and specific about permissions, access, approvals, data use, and review boundaries.

Pricing pages speak to decision makers comparing product value and rollout risk. The voice should make plan hierarchy obvious and tie cost to recovered operating leverage, not seat-count theater.

Editorial pages speak to trade operators and category experts. The voice can be more analytical, but every claim should preserve sources, constraints, and the operating decision being improved.

Legal pages speak plainly. Dense copy should remain scan-friendly, with high contrast body text, clear section rhythm, and no decorative fade that makes terms harder to read.

## Typography System

Headings use the Montserrat-based heading stack. They should be compact, confident, and set with zero letter spacing. Reserve hero-scale type for true hero moments. Inside cards, panels, tabs, legal sections, and editorial sidebars, use smaller headings that fit the component.

Body copy uses Noto Sans. Body text should be readable in both themes. Use `text-foreground/72 dark:text-foreground/82` or stronger for copy that a reader must understand. Use `text-muted-foreground` only for decorative metadata, disabled hints, placeholder text, or non-critical labels where lower emphasis is intentional.

Mono labels use IBM Plex Mono. They are for operational metadata: queue timestamps, integration labels, section markers, metric IDs, source labels, and audit-like state. Mono labels should not become invisible in dark mode. When placed below icons, use semibold and high contrast.

CTA text should be short command language: `Try Ubik Now`, `Talk to founders`, `Open full walkthrough`, `Download`. CTA labels need strong contrast on every surface and should never rely on grey text over blue, black, or dark panels.

Editorial captions and source notes are supporting evidence. They can be smaller, but not faint. Use strong muted foreground values and keep line-height generous enough for scanning.

## Color And Contrast

The system is built around square geometry, crisp borders, a pale operational shell in light mode, and a near-black workspace shell in dark mode. Blue is the action and intelligence color. It should be used for focus, CTAs, active states, links, selected rows, and compact signal accents.

Light mode intent:

- `background` and `shell` create a clean operating surface.
- `foreground` carries headings and primary reading text.
- `muted-foreground` is stronger than default grey and should still pass practical readability for normal UI text.
- Borders define structure without making cards feel decorative.

Dark mode intent:

- Text must not collapse into grey-on-black. If the copy is meant to be read, use foreground tints at 80 percent or above.
- Integration labels, tab labels, legal body text, article metadata, and small captions need deliberate contrast.
- Dark cards may use muted surfaces, but text hierarchy must come from size, weight, and spacing, not low contrast.

Blue surface rules:

- On primary blue cards, body copy should use at least `text-primary-foreground/90`.
- Primary action on a blue panel may invert to black fill with white text when stronger hierarchy is needed.
- Secondary action on a blue panel should use white fill with black text when the surrounding surface is dark or saturated.
- Avoid transparent outline buttons with low-contrast blue or grey text on blue cards.

Icon-label behavior:

- Icons can be visual; labels are information. Labels below icons should be semibold and high contrast in dark mode.
- Hover states may lift the tile and move the background, but they should not invert text into unreadable accent combinations.

Contrast thresholds:

- Main copy, legal copy, form help, and article body: aim for WCAG AA contrast against the local surface.
- Metadata, captions, and mono labels: can be lower hierarchy, but still readable without zooming.
- Disabled controls and placeholders: may use muted values, but should be recognizably inactive.

## Layout And Component Grammar

The visual grammar is square, gridded, and operational. Cards use hard corners, borders, and restrained shadow. Avoid nested cards, soft blobs, generic gradients, oversized decorative panels, and marketing fluff layouts.

Section bands should feel like work surfaces, not floating billboards. Use `container-page`, `section-y`, matrix backgrounds, border grids, and compact panels to create rhythm.

Cards are for repeated items, plans, trust principles, article modules, and framed tools. They should not be used to wrap entire page sections unless the page already needs a bounded tool or CTA surface.

Buttons should preserve hierarchy:

- Primary action: filled, high contrast, immediate.
- Secondary action: filled or outline only when the text remains clear.
- Icon buttons: use recognizable icons and keep tooltips or labels where needed.

Tabs, accordions, badges, callouts, and mobile sheets inherit the same type and contrast rules. If a shared primitive is readable in both themes, prefer fixing it there before adding one-off page overrides.

## Interaction Language

Motion should feel like live operational state: queues update, rows activate, matrices breathe, and product panels respond. It should not feel like a decorative animation layer.

Use hover and focus to clarify affordance:

- Links and nav items should strengthen on hover.
- Cards may shift or change surface tone subtly.
- Focus states must remain visible in both themes.
- Mobile menu and dialogs must preserve text contrast inherited from shared sheet/dialog primitives.

## Content And SEO Alignment

`Seo` is the metadata entrypoint. Pages should pass a concise title, description, canonical when needed, image, image alt text, and type. Do not add product-specific branching inside `Seo`; standardize page usage instead.

Title rules:

- Use `Page | Ubik` or a similarly clear separator.
- Avoid em dashes in social titles and previews.
- Put the actual page promise in the first phrase.

Description rules:

- Lead with frozen-food trade operations unless the page is a specific editorial note.
- Describe the operational result, not generic AI capability.
- Keep security claims scoped and current.

OG/Twitter image and alt rules:

- Every social image needs alt text when the page supplies an image.
- Alt text should identify the page preview and match on-page terminology.
- If a social card says frozen food, do not leave alt text or body copy saying seafood.
- Blog articles can keep commodity-specific language when the researched note is specifically about that commodity.

Canonical and structured data rules:

- Canonical URLs should match the public route.
- JSON-LD descriptions should mirror the public positioning and avoid stale category terms.
- Sitemap entries should stay aligned with live published routes.

## Page Guardrails

Homepage:

- Hero must state `Decision Intelligence for Trade Operations`.
- Category language should be frozen food.
- Metrics should stay aligned to `$25Mn+` and `100+ containers` unless leadership updates the proof points.
- Integration labels must remain readable in dark mode.
- CTA panel buttons need black/white contrast on blue surfaces.

Pricing:

- Plan cards, billing toggle labels, FAQ answers, and included-product strips must be readable in both themes.
- Enterprise copy should say frozen food when speaking about the site-wide category.

How it works:

- Workflow metadata, carousel labels, rail steps, and review-loop copy should be clear in dark mode.
- Supporting copy should not fade below readable contrast.

Try:

- Form-adjacent copy, tabs, help text, and plan context need clear hierarchy.
- The page title should avoid em dashes in metadata.

Security:

- Trust language should be frozen-food aligned unless quoting a customer-specific article.
- Permission, approval, revocation, and training-data claims must remain precise.

Blog:

- Index metadata, article bylines, source notes, captions, figure alt text, and share affordances need readable contrast.
- Editorial specificity is allowed. A seafood article may say seafood if the article is researched around seafood evidence.

Download:

- Platform labels, helper text, version notes, and coming-soon panels must be readable on both neutral and card surfaces.

Privacy and Terms:

- Legal body text should never use decorative low-contrast grey.
- Effective dates and company detail labels can be smaller, but still readable.

## Future Regression Checklist

- No readable text is greyed out on dark surfaces.
- On-page category language matches title, description, OG/Twitter alt text, and JSON-LD.
- CTA hierarchy remains obvious on blue, black, white, and neutral panels.
- Mono labels are semibold or high enough contrast when used under icons.
- Mobile routes do not introduce horizontal overflow or clipped buttons.
- Social preview titles avoid em dashes.
- `Seo` remains simple and reusable.
- New pages receive light and dark visual QA before shipping.
