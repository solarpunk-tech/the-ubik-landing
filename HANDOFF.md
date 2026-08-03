# Handoff — the-ubik-landing

## 2026-07-28 homepage closing and workflow browser annotations

- Status: complete locally and visually verified. No commit, push, PR, or
  deployment performed.
- Follow-up correction: at desktop widths of 1280px and above, the closing
  headline and its Base/Enterprise caption now each stay on one line. The
  explicit headline line break and the caption's `76ch` cap were removed;
  smaller viewports retain natural wrapping.
- Normalized all `.workflow-result-widget` backgrounds from the secondary
  surface to the same warm-paper background used by the surrounding workflow
  panels. Compliance / `12 lots cleared` was verified directly.
- Removed Arintra and Lumian from the repeated company experience rail.
- Replaced Sai Kiran's named profile and LinkedIn link with an anonymous stealth
  card:
  - `AI/ML & Product Engineering`,
  - `Leadership announcement coming soon`,
  - a short explanation that the leader is working with Ubik in stealth.
- Reworked the closing pricing statement:
  - desktop headline is explicitly two lines,
  - `outcome` is highlighted in Ubik blue,
  - the content area is wider,
  - caption now reads: `Base plan ships 2-3 new workflows every month.
    Enterprise ships 2-3 a week along with SSO, local first, mobile
    integrations.`
- Responsive behavior:
  - closing CTA becomes one column on mobile,
  - the forced desktop line break is released on mobile,
  - 390px viewport has zero horizontal overflow.
- Validation:
  - `pnpm build` passes with existing Vite chunk warnings,
  - `pnpm lint` passes with eight existing Fast Refresh warnings,
  - `git diff --check` passes,
  - browser text confirms Arintra, Lumian, and Sai Kiran are absent.
- Before evidence: four user browser-comment screenshots in the current task.
- After evidence:
  - workflow background:
    `output/playwright/home-annotations-workflow-background-after.png`,
  - closing/team/company desktop:
    `output/playwright/home-annotations-closing-after-desktop.png`,
  - closing/team/company mobile:
    `output/playwright/home-annotations-closing-after-mobile.png`,
  - single-line closing desktop:
    `output/playwright/home-closing-single-line-after-desktop.png`.
- Browser console has no implementation errors. The existing external
  Hapag-Lloyd Google favicon request still returns 404.
- Local review URL: `http://127.0.0.1:5174/`.

## 2026-07-25 homepage annotations, docs deployment section, and pricing simplification

- Local dev server remains running at `http://127.0.0.1:5173/`.
- No commit, push, PR, main merge, or deploy was performed.
- Correction after user review: the supplied deployment screenshot is no longer embedded on the homepage. The homepage now recreates those three points as a native `Deploy anywhere` section component in the site style.
- Scope touched for this pass:
  - `src/pages/Index.tsx`: removed the right-side hero integration component; shortened the hero headline and lede; applied browser annotation copy changes; removed the `Bulk reply completed` workflow commit footer; added a native three-card `Deploy anywhere` section above the team cards; moved Trade Notes to the bottom above the footer with the shorter title/link; updated the company strip label and closing CTA headline.
  - `src/index.css`: added responsive/stable styling for the new deployment-card section using local CSS-drawn deployment marks. Mobile stacks the cards; desktop uses a three-card grid beside the title.
  - `docs/index.mdx` and `docs/style.css`: renamed the Mintlify home page from `Ubik operator guide` to `Getting Started` and added the deployment options as a home-page guide section.
  - `src/pages/Pricing.tsx`: shortened Base/Enterprise feature bullets; Base now says `2-3 new workflows every month`; Enterprise says `2-3 new workflows every week`, custom ERP/CRM transition into Ubik, and maintenance/playbook updates.
- Validation:
  - `pnpm build` passes; Vite retains the existing large-chunk warning.
  - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
  - `git diff --check` passes.
  - `mintlify validate` passes.
  - `mintlify broken-links` passes.
  - Playwright homepage desktop/mobile confirms all requested visible copy, removed hero component, removed `Bulk reply completed` footer, native deployment-card section, no screenshot image reference, bottom Trade Notes placement, zero console errors, and no horizontal overflow.
  - Playwright pricing desktop confirms monthly/weekly workflow bullets, custom ERP/CRM transition copy, zero console errors, and no horizontal overflow.
- Visual evidence:
  - Before/user reference screenshot: `/Users/shubhranshujha/Desktop/Screenshot 2026-07-25 at 7.39.16 PM.png`
  - After native deployment section desktop: `output/playwright/home-deploy-native-final-desktop.png`
  - After native deployment section mobile: `output/playwright/home-deploy-native-final-mobile.png`
  - After pricing desktop: `output/playwright/pricing-workflow-points-desktop.png`

## 2026-07-25 homepage copy reduction and cleanup pass

- Local dev server remains running at `http://127.0.0.1:5173/`.
- No commit, push, PR, main merge, or deploy was performed.
- Browser comments addressed:
  - Removed the hero visual top chrome (`LIVE SYSTEMS` / `ONE TRADE MEMORY`).
  - Removed the hero visual bottom output strip (`SAFE NEXT MOVE` / reviewed action copy).
  - Replaced the center white-box mark with a five-square animated blue Ubik mark.
  - Made hero tool nodes lighter and more blended into the grid; favicon images use multiply blending to reduce visible white backgrounds.
  - Enlarged the operating-experience company rail and gave it more vertical presence.
  - Reworked the founder closing block so the quote uses more horizontal width, removed the right-column kicker/body, and made Hemanth's image link to LinkedIn.
  - Changed team labels to `Product GTM` and `Agent systems`.
- Copy reduction beyond annotations:
  - Removed homepage subtitle/kicker lines above section titles for the hero, shipment reality, trade memory, outcomes, Trade Notes, and closing CTA sections.
  - Folded key terms into answer-style headings/body where useful: perishable importers/exporters, trade memory, decision-to-done workflows, and perishable trade operators.
- Validation:
  - `pnpm build` passes; Vite retains the existing large-chunk warning.
  - Playwright desktop confirms the removed chrome/kicker strings are absent, the new memory heading and team labels are present, Hemanth photo links to LinkedIn, the hero core has five square children with transparent container/no shadow, and no horizontal overflow.
  - Playwright mobile confirms no horizontal overflow, removed hero chrome remains absent, and the founder photo LinkedIn link is present.
- Visual evidence:
  - After hero desktop: `output/playwright/home-cleanup-hero-after-desktop.png`
  - After founder desktop: `output/playwright/home-cleanup-founder-after-desktop.png`
  - After hero mobile: `output/playwright/home-cleanup-hero-after-mobile.png`
  - After founder mobile: `output/playwright/home-cleanup-founder-after-mobile.png`

## 2026-07-25 Sai Kiran LinkedIn URL supplied

- Local dev server is running at `http://127.0.0.1:5173/` from `/Users/shubhranshujha/Codex/the-ubik-landing`.
- Updated Sai Kiran's team-card LinkedIn URL from the scoped people-search fallback to `https://www.linkedin.com/in/saikiraniitb/`.
- The older handoff entries below still mention the historical blocker, but it is resolved for the rendered homepage as of this note.
- No commit, push, PR, main merge, or deploy was performed in this step.

## 2026-07-25 shrimp workflow relevance and hero rail-square cleanup

### Status

- **STATICALLY COMPLETE — browser visual verification is blocked, not committed or pushed.**
- Existing unrelated content blocker remains: Sai Kiran's exact LinkedIn URL is unknown.
- Browser blocker: the in-app browser refused the localhost page with its URL policy while trying to run the after-check. Do not bypass this with a second browser surface. Next action: manually reload the visible `http://127.0.0.1:5173/` tab, then retry screenshot capture.

### Implemented

- Removed the extra blue square markers from the hero leadership and manager rail lines. The central Ubik memory core is now the only blue square mark in that hero map.
- Reworked the trade-memory journey around one product: shrimp.
- Replaced generic Panel 01 source favicons with contextual source rows:
  - Compliance: FDA alert, BAP certificate, health PDF,
  - Sales Ops: buyer email, WhatsApp, CRM promise,
  - Plant & Inventory: SAP stock, cold-store inventory, Power BI,
  - Packaging: artwork PDF, buyer spec, packaging policy,
  - Finance: Ramp, FX sheet, Power BI,
  - Procurement: supplier email, Coupa, vendor certificates.
- Removed the repeated Panel 01 sentence `Evidence arrives from the tools your team already works in.`
- Changed Panel 03 from a repeated `One safe next move` heading to step-specific reviewed outputs:
  - Compliance release,
  - Buyer update,
  - Production plan,
  - Packaging override,
  - Margin approval,
  - Supplier choice.

### Visual requirements and evidence

- Layout: keep the three-panel systems -> memory -> reviewed output structure, with source rows doing more visual work instead of the removed helper sentence.
- Spacing: preserve existing panel widths and row heights; avoid adding a new text block below Panel 01.
- Typography: keep compact IBM Plex Mono status labels; keep readable product-specific output titles in Panel 03.
- Color: only the center hero memory mark should be blue on the top/bottom rail axis; no extra blue rail midpoint squares.
- Interactions: retain the existing auto-advancing team spine and manual selection pause.
- Responsive behavior: contextual source rows should stay contained in the existing mobile panel stack.
- Before: browser-comment screenshots attached to this task showing extra rail squares, repeated Panel 01 helper copy, generic source favicons, and repeated Panel 03 output language.
- After: not captured due to the browser blocker above.
- Static verification:
  - `pnpm build` passes,
  - `git diff --check` passes,
  - `pnpm lint` passes with the existing seven Fast Refresh warnings under `src/components/evilcharts/**`.

## 2026-07-25 live systems rotation and Ubik-mark correction

### Status

- **COMPLETE LOCALLY — visually verified, not committed or pushed.**
- Existing unrelated content blocker remains: Sai Kiran's exact LinkedIn URL is unknown.

### Implemented

- Converted the six static hero tiles into coordinated 3.6-second rotations:
  - Gmail / Outlook,
  - WhatsApp / Slack / Teams,
  - D365 / Zoho / Oracle / SAP,
  - Maersk / DHL / MSC,
  - PDF / Excel / Images / CSV,
  - Ramp / Razorpay / Power BI / Wise.
- Added a leadership rail above the tools (`LEADERSHIP · DECIDE`) and a manager rail below them (`MANAGERS · MONITOR · VALIDATE`).
- The hero memory core is now a solid Ubik-blue square with blue border layers instead of a white field with a small blue square.
- The active workflow selector and traveling orchestration actor now remain solid Ubik blue without the white hollow-square treatment.
- Tool swapping and workflow motion stop under `prefers-reduced-motion`.
- The integration graphic exposes one concise accessible summary instead of announcing every timed swap.

### Visual requirements and evidence

- Layout: retain the six-node systems → memory composition and use the previously empty top/bottom field space for decision ownership.
- Spacing: keep all rotating labels on one line without changing the hero's overall footprint.
- Typography: retain compact IBM Plex Mono system metadata; distinguish responsibility with `LEADERSHIP`, `DECIDE`, `MANAGERS`, and `MONITOR · VALIDATE`.
- Color: warm paper and commodity ink remain dominant; solid Ubik blue marks the memory core, active workflow, and moving orchestration actor.
- Interactions: tool families rotate together every 3.6 seconds; reduced-motion users see the first stable set.
- Responsive behavior: six tiles stay contained in the existing mobile field; longer labels such as `Razorpay` and `Power BI` do not wrap or overflow.
- Before: `output/browser-comments/home-hero-live-systems-before.png`.
- After:
  - `output/browser-comments/home-hero-live-systems-after.png`,
  - `output/browser-comments/home-hero-live-systems-mobile-after.png`,
  - `output/browser-comments/home-workflow-ubik-mark-after.png`.
- Browser verification:
  - multiple timed tool sets render with the expected favicons or file-type icons,
  - leadership and manager rails remain visible,
  - mobile tiles report zero overflow and zero wrapped labels,
  - document width remains below viewport width,
  - no browser console errors.
- Static verification:
  - `pnpm build` passes,
  - `git diff --check` passes,
  - `pnpm lint` passes with the existing seven Fast Refresh warnings under `src/components/evilcharts/**`.

## 2026-07-25 hero integration product-name correction

### Status

- **COMPLETE LOCALLY — visually verified, not committed or pushed.**
- Replaced the hero integration field's generic category labels with the recognizable product names already represented by each tile's favicon:
  - `ERP` → `Odoo`,
  - `Carrier` → `Maersk`,
  - `Documents` → `Adobe`,
  - `Finance` → `Tally`.
- Existing unrelated content blocker remains: Sai Kiran's exact LinkedIn URL is unknown.

### Visual requirements and evidence

- Layout: preserve the existing six-tile field and central Ubik memory square.
- Spacing: keep all tile dimensions and positions unchanged; only the labels change.
- Typography: retain compact uppercase IBM Plex Mono labels.
- Color: preserve the warm-paper, commodity-ink, and Ubik-blue hero system.
- Interactions: none; the integration map remains a static product story.
- Responsive behavior: keep the existing mobile tile layout and avoid longer labels that would force wrapping.
- Before: `output/browser-comments/home-hero-app-names-before.png`.
- After:
  - `output/browser-comments/home-hero-app-names-after.png`,
  - `output/browser-comments/home-hero-app-names-mobile-after.png`.
- Browser verification:
  - the integration field renders `Gmail`, `WhatsApp`, `Odoo`, `Maersk`, `Adobe`, and `Tally`,
  - no tile overflows and no label wraps at the narrow viewport,
  - document width remains below viewport width,
  - no browser console errors.
- Static verification:
  - `pnpm build` passes,
  - `git diff --check` passes,
  - `pnpm lint` passes with the existing seven Fast Refresh warnings under `src/components/evilcharts/**`.

## 2026-07-25 workflow-orchestration correction and team-copy restore

### Status

- **COMPLETE LOCALLY — visually verified, not committed or pushed.**
- This section supersedes the `INCOMPLETE` screenshot status and provisional team copy in the immediately following handoff entry.
- Existing content blocker remains: Sai Kiran's exact LinkedIn URL is unknown; the icon still uses the scoped LinkedIn people search.

### Corrected implementation

- Removed both misaligned diamond connector markers between the three workflow panels.
- Added one full-width orchestration rail above the panels:
  - `UBIK IS WORKING`,
  - a blue Ubik square moves evidence → memory → action,
  - the active-team square on the six-stop spine remains the selector indicator.
- The center product surface is now purpose-built for every workflow instead of repeating one bitemporal card:
  - Compliance & CSR: PDF OCR + image extraction with structured certificate fields,
  - Sales Ops: buyer-promise history and known-time timeline,
  - Plant & Inventory: lot allocation chart across warehouses,
  - Packaging: extraction, rule check, human review, and production-tracker task progression,
  - Finance: landed-margin history against the approved floor,
  - Procurement: supplier project progress and reviewed reply tasks.
- Replaced the bottom ownership sentence with eight additional integration favicons and `+100 MORE`.
- Restored the earlier concise team copy:
  - Shubhranshu: `Product & systems` / `Turns complex operating context into calm products, integrations, and dependable workflows.`,
  - Sai: `Product engineering` / `Builds and ships the workflow layer that carries trade decisions safely into the systems teams use.`

### Visual requirements and evidence

- Layout: retain the three-column systems → working memory → output composition, with the orchestration rail spanning all three columns.
- Typography: short mono process metadata; clear product-facing team roles and two-line bios.
- Color: warm paper and commodity ink; Ubik blue is the moving actor, active selector, extracted intelligence, and written-back result.
- Interactions: all six team tabs remain directly selectable and pause auto-advance after manual selection.
- Responsive behavior: selectors use two columns; source, memory, and output panels stack; the app strip remains contained.
- Before: two browser-comment screenshots attached to this correction task showing the repeated bitemporal card, connector diamonds, and sentence footer.
- After:
  - `output/browser-comments/home-workflow-distinct-memory-after.png`,
  - `output/browser-comments/home-workflow-orchestration-and-integrations-after.png`,
  - `output/browser-comments/home-team-copy-restored-after.png`,
  - `output/browser-comments/home-workflow-orchestration-mobile-after.png`.
- Browser verification:
  - all six selectors render their matching distinct memory label,
  - `.workflow-flow-rule` count is `0`,
  - additional integration favicon count is `8`,
  - `MEET THE TEAM BEHIND IT` count remains `0`,
  - mobile document width equals viewport width (`416px`) and the workflow stack is contained at `384.69px`,
  - no browser console errors.
- Static verification:
  - `pnpm build` passes,
  - `git diff --check` passes,
  - `pnpm lint` passes with the existing seven Fast Refresh warnings under `src/components/evilcharts/**`.

## 2026-07-25 integrations, team workflow spine, and hero visual pass

### Status

- **INCOMPLETE — implementation and static checks are complete, but the required after screenshots could not be captured.**
- Blocker: the existing in-app browser tab had become an `ERR_CONNECTION_REFUSED` page while the local Vite server was stopped. After restarting Vite at `http://127.0.0.1:5173/`, Browser Use blocked navigation from the generated error page back to localhost under its URL policy. Do not use a second browser surface as a workaround. Next action: reload the already-open localhost tab manually, then capture the four after views listed below.
- Existing content blocker remains: Sai Kiran's exact LinkedIn URL is still unknown; the icon continues to use a scoped LinkedIn people search.

### Source and intent

- The four supplied sales-deck screenshots were treated as product/content evidence only, not as visual references.
- Recovered the older integration vocabulary from the committed favicon grid and source-system surface, then adapted it to the current warm-paper Swiss landing system.
- The product story is now apps → bitemporal trade memory → reviewed output across six operating teams, rather than a generic dashboard or a sales-deck card library.

### Implemented locally

- Hero:
  - replaced the text-heavy shipment decision sheet with a quiet visual integration field,
  - six source-app tiles feed a central Ubik memory square,
  - the only outcome copy is `One reviewed action, with its evidence attached.`,
  - left-side hero proposition and CTAs remain the visual priority.
- Product / trade memory:
  - title is provisionally `Every team works from the same trade memory.`,
  - added six directly selectable stops: Compliance & CSR, Sales Operations, Plant & Inventory, Packaging, Finance, and Procurement,
  - every stop shows three real source apps, one valid-time / known-time record, linked ontology context, and one relevant result widget,
  - widgets cover lot traceability, buyer promise watch, lot readiness, packaging material rules, margin watch, and vendor comparison,
  - auto-advance pauses when a visitor makes a selection.
- Closing team strip:
  - removed the separate `MEET THE TEAM BEHIND IT` label column,
  - the two profiles now share the full horizontal width,
  - Shubhranshu is provisionally `Product operator · design · GTM`,
  - Sai is provisionally `AI/ML · systems architecture`.

### Visual requirements and evidence

- Layout: visual-first hero; six-stop horizontal team spine; expanded three-part systems → memory → output surface; two equal founder-profile columns.
- Spacing: preserve the existing 8px-derived rhythm, generous editorial section spacing, and compact evidence rows.
- Typography: Montserrat/Noto display and body system already used by the landing; IBM Plex Mono only for apps, times, states, and result metadata.
- Color: warm paper, commodity ink, and Ubik blue only; green/red/amber are not introduced as decorative UI color.
- Interactions: team stops auto-advance every 4.2 seconds until manually selected; selection then remains stable.
- Responsive behavior: six stops become a two-column selector; evidence, memory, and result stack vertically; the team profiles stack to one column.
- Before:
  - `output/browser-comments/home-ontology-bitemporal-after.png`,
  - `output/browser-comments/home-closing-team-strip-after.png`,
  - browser-comment hero screenshot attached to task `019f95a0-cb2d-7020-b564-89c06143adaa`.
- Required after capture once the localhost tab is reloaded:
  - `output/browser-comments/home-hero-integration-visual-after.png`,
  - `output/browser-comments/home-team-workflow-stack-after.png`,
  - `output/browser-comments/home-team-profiles-two-column-after.png`,
  - `output/browser-comments/home-team-workflow-stack-mobile-after.png`.
- Static verification:
  - `pnpm build` passes,
  - `git diff --check` passes,
  - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.

### Provisional copy for next-session cleanup

- Product eyebrow: `OWN YOUR TRADE SECRETS, DATA & INTELLIGENCE`
- Product title: `Every team works from the same trade memory.`
- Product support: `Ubik joins the systems each team already uses, remembers what was true and when it became known, and turns that context into the next safe workflow.`
- Hero visual outcome: `One reviewed action, with its evidence attached.`
- Shubhranshu role: `Product operator · design · GTM`
- Shubhranshu bio: `A full-stack FDE and venture builder who turns domain insight into product, adoption, and repeatable growth.`
- Sai role: `AI/ML · systems architecture`
- Sai bio: `Builds the foundational LLM, memory, and agent systems that make Ubik reliable in real operating workflows.`
- No copy cleanup or push was performed; user requested a dedicated cleanup session before publishing.

## 2026-07-25 bitemporal ontology, contrast, and closing-team pass

### Source and intent

- Continued from Codex task `019f95a0-cb2d-7020-b564-89c06143adaa`.
- Reused `/Users/shubhranshujha/Codex/fresh/ubik-webapp/output/ubik-widget-board.html` as a component-language reference, especially its source evidence, linked entities, review states, and writeback patterns.
- Replaced the physical Harvest → Retail ontology story with the product mechanism that differentiates Ubik: bitemporal truth, linked trade entities, conflict detection, downstream impact, human review, and reusable memory.

### Implemented locally

- Trade ontology:
  - eyebrow: `OWN YOUR TRADE SECRETS, DATA & INTELLIGENCE`,
  - title: `Know what changed, when it changed, and what it changes next.`,
  - support explains valid-time truth, knowledge-time truth, and the buyer/lot/shipment/margin/promise consequences,
  - eight interactive states now read `Signal captured`, `Truth dated`, `Entities linked`, `Conflict found`, `Impact traced`, `Decision prepared`, `Human reviewed`, and `Memory updated`,
  - each state has a purpose-built artifact: source evidence card, dual-time record, entity graph, reconciliation conflict, impact grid, decision brief, approval trail, or intelligence receipt.
- Outcomes contrast:
  - `FROM DECISION TO DONE` now renders at full inverse white,
  - body copy is full inverse white, `18px`, and medium weight instead of low-opacity grey.
- Closing section:
  - the 14-company experience row now spans the full content width with larger marks and full-strength labels,
  - Hemanth's credit is a direct LinkedIn link with a LinkedIn mark,
  - added the compact `MEET THE TEAM BEHIND IT` strip with two columns for Shubhranshu Jha and Sai Kiran plus one-line bios and LinkedIn marks.
- LinkedIn URL status:
  - Hemanth: verified direct URL `https://www.linkedin.com/in/hemanth-thimmasarthi`,
  - Shubhranshu: verified direct URL `https://www.linkedin.com/in/11shubhranshu`,
  - Sai: no direct personal LinkedIn URL was discoverable from the repo, GitHub profile, or public search; the current icon uses a scoped LinkedIn people search. Replace it with Sai's direct URL when supplied.

### Visual requirements and evidence

- Layout: keep the Swiss editorial proposition above one interactive console; make the company proof a true full-width band; keep the team bios subordinate as a thin horizontal strip.
- Spacing: preserve the existing 8px-derived rhythm and the large separation between proposition, proof component, and closing statement.
- Typography: product innovation in operator language; full-strength supporting copy on ink; compact IBM Plex Mono for evidence/time/state metadata.
- Color: warm paper, commodity ink, and Ubik blue only; blue identifies the active signal, evidence state, or action.
- Interactions: all eight ontology tabs are directly selectable and render their matching state-specific artifact.
- Responsive behavior: ontology selectors become a two-column mobile grid; team profiles stack; DOM audit reports document width `416` at viewport width `433`, with no horizontal overflow.
- Before:
  - `output/playwright/trade-ontology-after-desktop.png`,
  - `output/browser-comments/home-outcomes-closing-before.png`.
- After:
  - `output/browser-comments/home-ontology-bitemporal-after.png`,
  - `output/browser-comments/home-outcomes-contrast-after.png`,
  - `output/browser-comments/home-closing-team-after.png`,
  - `output/browser-comments/home-closing-team-strip-after.png`,
  - `output/browser-comments/home-ontology-bitemporal-mobile-after.png`.
- Browser verification:
  - all eight ontology tabs select and render the correct artifact class,
  - outcomes kicker and body compute to `rgb(254, 253, 251)`,
  - outcomes body computes to `18px` / `500`,
  - company row width is `1344px` and the team grid resolves to two equal desktop columns,
  - no browser console errors,
  - desktop and mobile document widths remain below their viewport widths.
- `pnpm build` and `git diff --check` pass.
- `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.

## 2026-07-25 widget-board-informed work ledger

### Source and intent

- Reviewed `/Users/shubhranshujha/Codex/fresh/ubik-webapp/output/ubik-widget-board.html` as an exhaustive component study, then adapted its compact ledger rows, route comparison, delegated-decision trail, and ETA status stack to the cleaner landing-page composition.
- The landing section remains one interactive work ledger rather than reproducing the prototype's six-card board.

### Implemented locally

- `Vendor replies`: a compact table shows a single reviewed bulk action completed across Amcor, Mondi, Berry Global, and Sealed Air, including source favicons, timestamps, and the packaging-programme writeback.
- `Shipment tracker`: a compact route canvas retains the booked Maersk lane between Visakhapatnam and Newark and overlays a blue dotted Hapag-Lloyd alternative detected by Ubik, with the time and cost delta.
- `Approval`: a delegated → reviewed → approved → committed trail shows Operations, Commercial, and Quality manager decisions, the trade-off each accepted, and a leadership-level readout.
- `ETA watch`: a live status stack shows watched promises, next carrier check, SLA/watch/pending distribution, and the Maersk exception that remains under observation.
- Each view now has state-specific ownership and completion language. Completed replies and manager approvals no longer incorrectly say they are waiting at the human boundary; the alternative carrier route still does.
- Selecting a ledger tab pauses auto-advance so the chosen work product remains inspectable.
- Supporting copy now describes vendor coordination, route comparison, manager approvals, and ongoing monitoring instead of repeating the hero decision queue.

### Visual requirements and evidence

- Layout: preserve the editorial statement plus one large ledger; each state uses one purpose-built artifact rather than a repeated generic field list.
- Spacing: dense internal information with clear row rhythm; generous separation between section proposition and work surface.
- Typography: large work-product title, compact mono metadata, and short operational copy; leadership trade-offs remain directly readable.
- Color: commodity ink band, warm-paper artifact, Ubik-blue action/alternative signal, with green and amber reserved for state.
- Interactions: four directly selectable states auto-advance until the visitor selects one; manual selection then remains stable.
- Responsive behavior: selectors become a two-column grid and artifacts stack without horizontal overflow.
- Before: `output/browser-comments/home-outcomes-closing-before.png`.
- After:
  - `output/browser-comments/work-ledger-vendor-replies-final.png`
  - `output/browser-comments/work-ledger-shipment-route-final.png`
  - `output/browser-comments/work-ledger-approval-final.png`
  - `output/browser-comments/work-ledger-eta-watch-final.png`
  - `output/browser-comments/work-ledger-approval-mobile-final.png`
- Browser verification:
  - all four tabs render their distinct artifact heading,
  - vendor and ETA status data remain legible at desktop,
  - route comparison and manager trade-offs remain visible without opening another surface,
  - mobile document width is `416` at a `433` viewport, so there is no horizontal overflow.
- `pnpm build` and `git diff --check` pass.
- `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.

## 2026-07-25 outcomes component and closing-section correction

### User correction

- The outcomes section repeated the hero decision queue despite the reference examples demonstrating different component and narrative patterns.
- `Less chasing. Better trade judgement.` repeated the decision narrative instead of showing what Ubik actually produces.
- The closing panel had unnecessary horizontal dividers and did not explain the forward-deployed team included with the weekly workflows.

### Implemented locally

- Removed the second `TradeDecisionQueue`/`trade-inbox` from the outcomes section.
- Replaced it with an interactive decision-to-done work ledger:
  - buyer reply / `Revised delivery promise`,
  - shipment tracker / `Lot 87 allocated`,
  - approval / `Commercial sign-off`,
  - ETA watch / `The next exception is covered`.
- The ledger is a numbered artifact catalog with a changing warm-paper work product, concrete fields, system destination, human-review boundary, and a dark working-set status bar. It is intentionally different from the hero intake/decision queue.
- New section copy:
  - kicker: `FROM DECISION TO DONE`,
  - heading: `The work moves with the decision.`,
  - support: `Ubik drafts the reply, updates the tracker, opens the approval, and keeps watch after your team signs off.`
- Closing section:
  - removed the right-column top border,
  - removed the company ticker bottom border,
  - kicker now reads `YOUR FORWARD-DEPLOYED UBIK TEAM`,
  - heading now reads `One domain expert. One product engineer. Three personalised workflows every week.`,
  - support explains that they learn the programme, build against the customer's systems, and stay after go-live.

### Visual requirements and evidence

- Layout: outcomes uses a short editorial statement plus one large artifact catalog; it must not resemble the hero decision queue.
- Spacing: preserve the full dark-band rhythm and give the work product more space than the selector.
- Typography: crisp six-word outcome heading; product artifact title is the visual focal point.
- Color: ink section, Ubik-blue change-set bar, warm-paper document; no extra palette.
- Interactions: four work-product tabs auto-advance and are directly selectable; selected work swaps with a short horizontal reveal.
- Responsive behavior: catalog stacks above the work product on mobile and the four selectors become a two-column grid.
- Before: `output/browser-comments/home-outcomes-closing-before.png`.
- After outcomes: `output/browser-comments/home-outcomes-after.png`.
- After closing: `output/browser-comments/home-closing-after.png`.
- After mobile: `output/browser-comments/home-outcomes-closing-after-mobile.png`.
- Browser verification:
  - exactly one `.trade-work-ledger`,
  - zero `.trade-inbox` elements,
  - closing panel top border and ticker bottom border both compute to `0px`,
  - desktop document width `1488` at viewport `1505`,
  - mobile document width `416` at viewport `433`,
  - clicking `Shipment tracker` selects the tab and renders `Lot 87 allocated`.
- `pnpm build` and `git diff --check` pass.
- `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.

## 2026-07-25 browser comments and header-film research

### Implemented locally

- `/how-it-works` workflow showcase contrast:
  - inactive tabs now use white text on the ink surface,
  - the workflow eyebrow, step numbers, body copy, and outline CTA now use the inverse white type contract,
  - the selected tab remains ink text on the warm-paper active surface.
- Homepage closing section:
  - restored the exact 14-company production set beside the founder statement: AZ Gems, Sandhya Aqua, Dr. Reddy's, Airtel, Udaan, Ola, Walmart, Whole Foods Market, Costco, AquaExchange, ClearTax, Arintra, Lumian, and Housing,
  - retained the live production logo sources, including the corrected Wikimedia Ola asset and the Sandhya Aqua mark,
  - replaced the unapproved `Put one trade workflow live in two weeks.` heading with the recorded user wording `3 personalised workflows every week.`,
  - changed the supporting kicker to `BUILT AROUND YOUR TRADE DESK` so it does not repeat the heading.
- Verification:
  - `pnpm build` passes with the existing chunk-size warning only,
  - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`,
  - `git diff --check` passes.

### Visual requirements from the browser comment

- Layout: keep the existing five-tab product walkthrough and the current split copy/media panel.
- Spacing: no layout or spacing expansion was requested.
- Typography: all labels and supporting copy placed on the ink surface must be white/inverse; only the selected warm-paper tab uses ink type.
- Color: preserve the Swiss warm-paper, commodity-ink, and Ubik-blue palette.
- Interactions: tab selection, spring active-state handoff, video controls, autoplay, and reduced-motion behavior stay unchanged.
- Responsive behavior: keep the existing horizontal tab scroller and stacked mobile product panel.
- Before evidence: `output/browser-comments/how-it-works-contrast-before.png`.
- After evidence: **blocked**. The in-app browser accepted the before capture but rejected localhost capture after refresh under its URL safety policy. Manual next action: refresh `http://localhost:5173/how-it-works`, confirm all inactive tab/copy/action text is white on ink, and save `output/browser-comments/how-it-works-contrast-after.png`.
- UI completion status: **INCOMPLETE pending the after screenshot**, even though code verification passes.

### Reference-site findings

- Claude Cowork:
  - centered proposition and CTA block stay separate from a large rounded video poster below,
  - the poster tells the story before playback through completed-task chips and a phone notification,
  - the 1:20 film is click-to-play and moves through one operator prompt, connected context/tools, scheduled tasks, work output, and a final notification,
  - legibility is enforced with solid white cards on blue fields rather than text over busy moving imagery.
- Composio:
  - a short high-contrast thesis sits inside a dark kinetic field,
  - animated scanline/tool bands frame the copy without passing behind it,
  - the first scroll reveals a three-column execution proof: tool search/plan, agent conversation, connections/execution/config.
- Supermemory:
  - a quiet white hero uses blue dotted motion at the edges, never behind the central copy,
  - customer logos supply trust before a full-width kinetic blue/ink visual,
  - the next component is a numbered interactive catalog with a persistent selector and one large changing artifact.
- Borrow the narrative sequencing and contrast discipline, not the reference brands' type, rounded geometry, or decorative effects.

### Header-film experiment to try

- Recommended first test: a 24–32 second, sound-optional product film built with the existing Motion + HTML video pipeline; do not start with an avatar.
- Storyboard:
  1. `One shipment. Five systems. One safe next move.`
  2. Operator request: the buyer needs a revised delivery promise.
  3. Email, WhatsApp, ERP, and carrier signals converge on the Ubik blue square.
  4. Ubik checks Lot 87, margin, ETA, and packaging/compliance evidence.
  5. Ubik drafts the buyer reply, updates the shipment tracker, and creates the approval task.
  6. Final phone/meeting-style notification: `Revised delivery plan ready. One approval needs you.`
- Visual language:
  - warm-paper and ink UI, one Ubik-blue active square,
  - Meetings-style segmented source rail and three-bar working pulse,
  - web-app-style execution trace, provenance, approval, and artifact states,
  - no dashboard montage and no tiny unreadable UI.
- Delivery brief:
  - master at 1920×1200 or 1440×900, 30 fps,
  - export H.264 MP4 plus a poster PNG; add WebM only if it materially improves weight,
  - target a sub-8 MB web asset,
  - keep all essential meaning visible without audio and provide burned-in captions if voice is used,
  - reserve the centre 70% for legible UI because the player crops at smaller breakpoints.
- Tool choice:
  - use Motion for the in-page player shell, poster transitions, progress, and reduced-motion fallback,
  - use the existing HTML video pattern from `HowWorkflowCarousel`,
  - use HeyGen only for a clean voice track or an optional separate founder-led cut; an avatar is not recommended for the product-first hero,
  - use Remotion only if an offline rendered UI film is needed; it is not currently installed,
  - do not add GSAP to the hero unless timeline requirements exceed Motion.
- Decision gate: create two rough exports before implementing the hero:
  - A: 24-second silent/captioned product cut,
  - B: 35-second voice-led cut using the same scenes.
  Choose based on whether a first-time importer/exporter can state the input, Ubik's work, the approval boundary, and the resulting artifact after one viewing.

## 2026-07-24 Swiss homepage reset

- Supersedes the previous blue/agentic-pattern homepage direction. The token-only recolor was rejected because it left the legacy composition and matrix system visibly intact.
- Homepage was rebuilt as a standalone minimal Swiss trade desk in `src/pages/Index.tsx`: one warm-paper hero, a black-ink shipment control sheet, a four-programme reality table, a three-step value section, a small text-only Trade Notes preview, and the founder note at the bottom beside the final CTA.
- Copy now leads with the useful commercial proposition: a shipment is several broken programmes, and Ubik reconnects messages, lots, approvals, and buyer promises so the team can make one safe next move.
- The homepage no longer renders comparison, app-grid, carousel, founder-photo, or matrix-field components. The only background treatment is a low-contrast grid that changes to orange only on hero hover.
- Palette: warm white `42 36% 96%`, near-black commodity ink, and Ubik blue `227 81% 56%` as the single product/action signal. Blue must never return as a full-page matrix background.
- Header uses the paper wordmark at the top and changes to ink with the inverse wordmark on scroll.
- Founder note: Hemanth’s portrait from `public/founders/hemanth.png` now appears beside the quote in the final homepage section, in a restrained monochrome editorial treatment.
- Shared in-repo route treatment: `/how-it-works`, `/pricing`, `/security`, `/download`, `/try`, `/blog`, all legal pages, and their shared header/footer now use the same paper/ink/Ubik-blue visual contract. Matrix fields are suppressed on secondary routes; existing product flows, pricing toggle, installer controls, legal tables, and Trade Notes content stay unchanged. `docs.theubik.com` is a separate site and was intentionally not changed.
- Visual evidence: `output/playwright/swiss-home-after-desktop.png`, `output/playwright/swiss-home-after-mobile.png`, `output/playwright/swiss-founder-note-after-desktop.png`, and `output/playwright/swiss-pricing-after-desktop.png`; mobile check reports document width 416 vs viewport width 433 (no horizontal overflow). Pricing desktop check reports no visible matrix field and document width 1265 vs viewport width 1280.
- Verification: `pnpm build` and `git diff --check` pass. Build retains the existing chunk-size warnings only.

### 2026-07-24 trade decision queue follow-up

- Homepage eyebrow now reads `Live for Perishable Food Importers & Exporters`.
- Hero throughput proof now says `3 / wk` / `tailored workflows`.
- Reviewed `ubik-meetings-pr21-staging`'s `NotificationCard.jsx` and `Chip.jsx`; carried over the segmented source strip, timed signal swap, and blue-square/audio-bar status language as a new landing-specific `TradeDecisionQueue` component inside `src/pages/Index.tsx`.
- The hero decision card now shows Ubik joining a rotating Email, WhatsApp, ERP, or carrier signal through source favicons before rendering the recommendation. The right column next to `Less chasing. Better trade judgement.` uses the same queue to make the value of decision consolidation explicit.
- Visual evidence: `output/playwright/trade-queue-after-desktop.png` and `output/playwright/outcomes-queue-after-desktop.png`. Desktop check found two decision queues, two active source favicon elements, and no horizontal overflow (`1265` document width vs `1280` viewport).

### 2026-07-24 decision and ontology follow-up

- Removed the duplicate `UBIK RECOMMENDS` and evidence block from the hero card. The live queue is now the single decision artifact and ends with the resulting short action.
- Rotating examples now include revised-delivery email, revised quantity, Lot 87 allocation, carrier-delay follow-up, and packaging compliance approval. WhatsApp uses its direct favicon rather than the white-backed Google favicon endpoint.
- Added `TradeFlowOntology` after the programme-breakage section: eight clickable linked stages from Harvest → Quality → Export → Import → Cold chain → Warehouse → Packaging → Retail, with the commercial decision question and a stage-specific explanation.
- Evidence: `output/playwright/decision-flow-after-desktop.png` and `output/playwright/trade-ontology-after-desktop.png`. DOM check confirms eight ontology stages, no `UBIK RECOMMENDS` copy, and no desktop horizontal overflow (`1265` document width vs `1280` viewport).
- The outcomes section intentionally uses a different component from the hero: a stacked `trade-inbox` of Email, WhatsApp, and ERP notifications converging on a blue `Ubik decision queue` action. Evidence: `output/playwright/outcomes-inbox-after-desktop.png`.

### 2026-07-24 live decision and programme-film follow-up

- Hero queue resolution is now a dark working state rather than a blue label: the rotating source signal resolves into a bold white decision, an animated blue Ubik square, and a changing operational line such as `Writing the lot move into the shipment tracker` or `Reminding Hemanth about material delivery`. There is no `UBIK RECOMMENDS` or evidence copy.
- Replaced the copied eight-box flow with the interactive `TradeFlowOntology` console. A click/auto-advancing programme list drives one animated blue square along Harvest → Retail and morphs its adjacent product artifact between a chart, quality checklist, clearance file, ETA timeline, and lot-allocation tracker. This is intentionally a small launch-film language, not another dashboard or a literal flow diagram.
- Trade Notes heading is shortened to `Trade Notes.` and the right-hand teaser now reads `featuredBlogPost.title` from `src/lib/landing-content.ts`, so it stays aligned to the actual latest article.
- Visual requirements / evidence: the hero must show white bold decision text plus blue active-agent mark; the ontology must consume the full area without trailing rail whitespace and visibly change its product artifact by stage; Trade Notes must show the current article title. Captures: `output/playwright/home-after-hero-queue.png`, `output/playwright/home-after-ontology.png`, and `output/playwright/home-after-trade-notes.png`.
- Verification: `pnpm build` and `git diff --check` pass; only the repository's pre-existing Vite chunk-size warnings remain.

### 2026-07-24 operational proof and closing follow-up

- The hero queue result no longer reuses the header’s equalizer-style agent mark. It now carries a distinct travelling blue-square working dot with a short motion trail beside the white decision and live operational progress line.
- The trade ontology proposition is now a full-width, tighter statement: `Every trade decision changes the programme.` The supporting line is one sentence: `Ubik follows the commercial consequence from harvest to retail.`
- The outcomes queue now demonstrates work produced by Ubik—not just source consolidation—with a changing action (for example, `Create the revised-delivery task`), its follow-up progress, and compact proof chips for artifact creation, task updates, workflow monitoring, and reminders.
- Removed `A NOTE FROM THE FOUNDER`; the founder credit is now `Hemanth Rao · Operator in Chief`. The final CTA replaces `Start small` with `3 tailored workflows / week` and includes a moving perishable-trade proof ticker. The ticker deliberately uses domain labels rather than unverified past-employer logos; replace with real marks only after the exact company list is supplied.
- Resolved the accidental-looking section colour shift: Trade Notes and the closing section share the same warm-paper surface and are divided by a fine rule only.
- Visual evidence: `output/playwright/home-after-workflow-agent.png`, `output/playwright/home-after-ontology-copy.png`, `output/playwright/home-after-outcomes-artifacts.png`, and `output/playwright/home-after-closing-unified.png`.

## Current status

- Repo path: `/Users/shubhranshujha/Codex/the-ubik-landing`.
- Active compliance branch: `jex/pren-187-compai-landing-compliance` for Linear PREN-187 under PREN-175.
- Latest homepage pass rebased against `origin/main` on May 23, 2026; no remote delta was pending.
- The old static HTML/CSS site has been rewritten as Vite + React 18 + TypeScript + Tailwind v4 + shadcn `radix-nova` / Mist.
- shadcn preset is configured in `components.json`, with registries for `@svgl`, `@manifest`, and `@dotmatrix`.
- Dotmatrix loaders are installed from the registry and imported through `src/components/dotmatrix-loader.css`.
- A deterministic large-scale bitmatrix visual system is implemented in `src/components/landing/MatrixField.tsx`.
- Additional dotmatrix registry loaders are available for accents: `dotm-square-1`, `dotm-square-6`, `dotm-circular-4`, and `dotm-triangle-15`.
- Latest homepage component/copy pass is local-only at `http://127.0.0.1:5173/`; do not deploy until the user and team approve it.

### 2026-07-24 homepage benchmark and component pass

- Visual requirements:
  - layout: replace the repeated synthetic walkthrough with one real-product workflow surface; use full-width blue, ink, and white bands instead of pale floating sections,
  - spacing: preserve generous section rhythm while reducing repeated explanatory blocks,
  - typography: use answer-first category and buyer-question headings with short supporting copy,
  - color: carry the hero blue through category, systems, comparison, and closing bands; use ink for evidence, trust, and founder sections,
  - interactions: keep cursor-reactive matrix fields only on hero/category/CTA; use spring tabs and clipped content handoffs for product and systems,
  - responsive behavior: horizontally scrollable workflow tabs, stacked case-study/security panels, three-column system selector, and zero document overflow at 390px.
- Implementation:
  - homepage category was initially changed to `The AI operating layer for perishable trade`; the follow-up below supersedes this with agentic operating-system positioning,
  - the primary workflow section uses real prototype video/screenshots through `HowWorkflowCarousel`,
  - the original detailed `LandingV2HowSection` remains in source but is no longer rendered on the homepage,
  - integrations are a selectable signal/context/action console with no unsupported integration count,
  - FAQ and JSON-LD share one concise `homepageFaqs` source,
  - public roadmap/internal-status copy and bottom placeholder callouts are removed,
  - static matrix fields no longer attach global pointer listeners,
  - GSAP was reviewed but not added; the existing Motion runtime covers the required scroll, spring, layout, presence, and reduced-motion behavior without a second animation runtime.
- Visual evidence:
  - before desktop: `output/playwright/homepage-components-before-desktop.png`
  - before mobile: `output/playwright/homepage-components-before-mobile.png`
  - after desktop: `output/playwright/homepage-components-after-desktop.png`
  - after mobile: `output/playwright/homepage-components-after-mobile.png`
- Verification:
  - production build passes,
  - lint passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`,
  - `git diff --check` passes,
  - Playwright at 390x844 reports document/body width 390, no console errors, working workflow and integration selectors, all category steps present, and no roadmap copy.

### 2026-07-24 agentic operating-system identity pass

- User direction:
  - replace review-centric language with an agentic operating-system story,
  - use the category band's empty left side for a post-AI decision queue,
  - show Ubik's blue-square orchestrator spawning specialist agents and connecting to browser, computer, email, and ERP tools,
  - restore the full app grid on an ink background with click-to-select combinations,
  - make FAQs feel like an importer/exporter desk,
  - carry the blue/ink identity into Pricing, How It Works, Security, Meetings, Trade Notes, and the shared header/footer without changing linked layouts or controls.
- Homepage implementation:
  - canonical category is `The agentic operating system for perishable trade`,
  - category queue shows memory recall, specialist-agent spawn, tool access, and a composed commercial decision,
  - the three strategy buckets are `Perceive`, `Reason`, and `Act`, with reduced-motion-aware rotating signals covering demand, inventory, risk, working capital, margin/volume, service/cash, compliance, pricing, allocation, and escalation,
  - the model-logo card is replaced by a frameless blue-square orchestration map,
  - systems section uses the full 35-app grid on ink; Outlook is selected by default; users can select/deselect up to three apps; combinations produce rice packaging, shrimp margin, meat inventory, grain shipment, or working-capital workflows,
  - FAQ is an ink trade-desk surface with RFQ, PO, ETA, VMI, LOT, CIF, COGS, LANE, and TRACE cues; the first answer opens by default,
  - homepage SEO, JSON-LD, FAQ answer, `index.html`, and `public/llms.txt` use the same agentic operating-system definition.
- Site identity implementation:
  - shared header/footer use an ink liquid-glass treatment with inverse logos and white navigation,
  - Pricing and How It Works have explicit inverse blue hero contracts,
  - Security and Meetings keep their existing layouts and wired controls while receiving blue hero and stronger text treatments,
  - Trade Notes keeps its editorial layout with a blue desk header and stronger article metadata,
  - `Guide` remains an external link to `https://docs.theubik.com`; it is not a route in this repository and was not restyled here.
- Verification evidence:
  - previous route captures: `output/playwright/brand-pass-before-{pricing,how,security,meetings,trade-notes}-desktop.png`,
  - homepage after: `output/playwright/brand-pass-after-home-desktop.png` and `output/playwright/brand-pass-after-home-mobile.png`,
  - secondary routes after: `output/playwright/brand-pass-after-{pricing,how,security,meetings,trade-notes}-desktop.png`,
  - combination state: `output/playwright/brand-pass-systems-combo.png`,
  - 390px checks pass with no horizontal overflow on `/`, `/pricing`, `/how-it-works`, `/security`, `/download`, and `/blog`,
  - homepage system selection, cap, deselection, grain combination, default-open FAQ, and Pricing annual billing interaction pass,
  - `/download` still reports the known localhost-only S3 manifest CORS error and falls back to the retained installer URLs; no download layout or wiring changed.

### 2026-07-24 fixed blue-and-ink palette pass

- User direction:
  - the ink header felt detached from the blue hero,
  - remove light/dark mode switching and keep one Ubik visual mode,
  - remove white page and component backgrounds; use cobalt and ink surfaces with white typography.
- Implementation:
  - the shared header is now translucent cobalt glass instead of black,
  - the root palette is fixed to cobalt, ink, and dark blue cards; browser/OS color preference no longer changes the site,
  - the desktop and mobile theme controls, `ThemeProvider`, dormant `ThemeToggle`, and `next-themes` dependency were removed,
  - Sonner notifications now use the fixed dark presentation,
  - hero chips, primary CTAs, workflow panels, tool selectors, pricing cards, Meetings cards, menus, popovers, and tooltips no longer introduce white surfaces,
  - white remains available for typography, logos, and pixels inside real product screenshots.
- Visual requirements:
  - layout and spacing remain unchanged,
  - the header must visually continue the hero rather than form a black cap,
  - blue marks active/product regions; ink separates evidence, tools, and reading sections,
  - desktop and mobile keep the same fixed palette with no theme affordance.
- Evidence:
  - user before reference: `/var/folders/yz/jgm0w7r158s1lth5ylp9rhvh0000gn/T/codex-clipboard-b78c746b-3a73-4605-9a73-240dcfb6e32d.png`,
  - after homepage fold: `output/playwright/single-palette-final-home-fold.png`,
  - after homepage mobile: `output/playwright/single-palette-final-home-mobile.png`,
  - after Pricing: `output/playwright/single-palette-final-pricing-fold.png`,
  - after How It Works: `output/playwright/single-palette-final-how-fold.png`,
  - after Meetings: `output/playwright/single-palette-after-meetings-fold.png`.

## Implemented

- Homepage browser-comment correction:
  - hero keeps the Landing V2 layout/copy direction but uses the original matrix background seed,
  - hero headline now reads `Decision Intelligence for Trade Operations`; hero lede now says `frozen food` and highlights `frozen food`, `$25Mn+`, and `100+ containers`,
  - the over-copied Landing V2 `What Ubik does` primitives section was removed,
  - the original compact homepage `How it works` section was restored above Security,
  - Landing V2 `Wherever your work already lives` tools grid now sits below the restored `How it works` section,
  - FAQ is followed by a moving company-logo strip for experienced supply-chain operators, builders, and ex-founders,
  - header/download naming changed from `Ubik Local` to `Ubik Meetings`; the header item is now in the nav row with hover icon swap and no bordered secondary CTA treatment.
- Social preview and share copy:
  - `og:title`, `twitter:title`, and share text now use `|` instead of em dashes,
  - homepage OG screenshots were regenerated to `public/og-image.png`,
  - security note OG screenshots were regenerated to `public/security/og-image.png`,
  - article OG image URLs now use local public paths so blog previews resolve in this repo and in production.
- Homepage SEO refresh:
  - root meta description, OG description, Twitter description, keywords, and JSON-LD now say `frozen food` instead of `seafood`,
  - `og:image:alt` and `twitter:image:alt` are now set explicitly through the SEO helper and root HTML,
  - homepage hero badge and supporting copy now say `Global Frozen Food` so the social preview image matches the page.
- Tool/integration logos in the hero queue, tools grid, workflow evidence, and new company strip use Google favicon URLs (`https://www.google.com/s2/favicons?...`) to match the requested icon approach.
- Landing page, `/try`, `/security`, `/privacy-policy`, and `/terms-of-service` are React routes.
- `/security` is a CTO-specific memo with the CTA "Share this with your tech team".
- `/try` remains a stub and uses `src/lib/try.ts` with `VITE_TRY_TARGET=stub | razorpay | app`.
- Payment-gateway copy is intentionally kept out of public pages until the paid handoff is live.
- Logo assets are centralized in `src/lib/brand.ts` and loaded from `public/`.
- Desktop nav uses the wordmark; compact/mobile nav uses the favicon mark to preserve CTA/menu space.
- Top nav is intentionally concise: Product, How it works, Journal, Trust, Talk to founders. Privacy and Terms live in the footer only.
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
- Latest CompAI compliance pass:
  - Pulled `origin/main`; it was already up to date before branching.
  - Added canonical `/legal/privacy` and `/legal/subprocessors` React routes while keeping existing `/privacy-policy` compatibility.
  - Footer and docs footer now link to canonical privacy and subprocessor pages.
  - Privacy Notice no longer claims generic "no tracking"; it now discloses cookieless PostHog telemetry, no advertising/cross-site cookies, no session replay, and DSR/deletion request handling by email.
  - Added public subprocessor page focused on customer-data/content subprocessors from the CompAI/vendor inventory and keeps PostHog in the Privacy Notice-only telemetry category.
  - Added `public/.well-known/security.txt`.
  - Added `.github/dependabot.yml`, `.github/CODEOWNERS`, and a dependency-review workflow for high-severity dependency checks on PRs.
- Latest finalized privacy-pack alignment:
  - Public legal content is now mapped from `/Users/shubhranshujha/Claude Code/compliance/privacy/privacy-notice.md`, `subprocessor-list-public.md`, and `cookie-inventory.md`.
  - `/legal/privacy` now uses Solarpunk Technology, Vadodara address, DPDP grievance officer, controller/processor table, lawful-basis table, recording consent, SCC transfer language, concrete retention table, and EU representative language from the finalized pack.
  - `/legal/subprocessors` now uses the finalized vendor ordering, exact locations, 30 days' advance notice, and SCC/DPA transfer note.
  - Added `/legal/cookies` for the finalized Cookie & Tracker Inventory; footer, docs footer, sitemap, and llms index include the route.
  - Compatibility routes `/privacy`, `/privacy-policy`, and `/privacy-policy.html` continue rendering the Privacy Notice; `/legal/privacy` remains canonical.
  - Public source-mapping notes are kept out of rendered legal copy; source references remain in code comments and this handoff only.
  - SeaRates was removed from the public subprocessor list because it is not currently used and was exploratory/planned.
  - Scope note: `/terms-of-service` still contains the older Malaysia entity/legal venue text and was not part of this privacy-pack mapping pass.
  - Visual delta: legal pages now use finalized privacy-pack content while preserving the existing PageShell/legal article layout; desktop tables remain grid-based and mobile tables collapse into stacked labelled rows with no horizontal overflow.
- Latest Trust Center and Meetings download pass:
  - Added central Comp AI Trust Center links in `src/lib/links.ts`:
    - Trust Center page: `https://security.trycomp.ai/?organizationId=org_6942f5b5ad9fe5d196af748b`
    - Public overview API: `https://api.trycomp.ai/v1/trust-access/solarpunk-technology/overview`
    - Public vendor API: `https://api.trycomp.ai/v1/trust-access/solarpunk-technology/vendors`
  - `/security` now exposes external `Open Trust Center` CTAs near the founder/contact trust actions and final trust CTA.
  - `/legal/subprocessors` now exposes `View live Trust Center` while staying a public customer-data/content subprocessor list, not a full Trust Center vendor mirror.
  - Public subprocessor parity decision: added PostHog with `Product analytics`, `Opaque user id + product usage events (IP not collected)`, and `United States`; intentionally did not mirror operational Trust Center vendors such as GitHub, Slack, Linear, Netlify, Azure Trusted Signing, ChatGPT/Claude app entries, or AWS for this pass.
  - SeaRates appears in the live Trust Center vendor API but remains excluded from local public legal copy until current product usage is confirmed.
  - `/download` remains canonical and no longer auto-downloads on page load; it now presents a meetings-product hero, proof cards, and a compatibility strip for Zoom, Slack, Webex, Microsoft Teams, and Google Meet using Google favicon logos.
  - The primary download CTA uses the existing `useDownloadLinks()` S3 URLs and preserves the old S3 fallback links. `/download?os=mac` defaults to Apple Silicon; `/download?os=windows` selects the Windows installer; the compact selector switches Mac Apple Silicon, Mac Intel, and Windows CTA label, icon, URL, and install steps.
  - Visual requirements captured from the screenshot/prototype: centered hero; three proof cards for not joining meetings, screen-share invisibility, and movable workflow widget; notification card with segmented left strip, meeting CTA, caret affordance, counter badge, and floating widget; responsive layout with no 390px horizontal overflow.
  - Latest browser-feedback pass:
    - Replaced the top-right `Next meeting in 7 minutes` block with a `Pre-read preview` card marked `Coming soon`.
    - The pre-read card shows context sources for Ubik Memory, LinkedIn, Email, and Calendar, with favicon-backed source marks where applicable.
    - The notification card left strip now has three clickable segments and auto-cycles through meeting, update, and compliance/review notifications about every 4.2 seconds.
    - The third proof card now uses a vertical chip/widget visual instead of the previous `AI Response` overlay.
    - macOS install steps now include Screen Recording and Microphone permissions plus restarting Ubik for local detection; Windows steps now refer to the setup wizard and Start-menu launch.
    - Production S3 CORS decision: allow only `https://theubik.com` and `https://www.theubik.com` for `GET`/`HEAD` on the `ubik-meetings` manifest. Do not add localhost, `127.0.0.1`, `app.theubik.com`, or `staging.theubik.com`; app/staging only redirect to canonical `/download`.
    - AWS CLI is installed locally, but this session had no AWS credentials, so the S3 CORS config could not be applied from Codex. Apply it outside this repo, then verify the production manifest fetch.
  - Latest deployment/version/mobile guard follow-up:
    - Netlify automatic production deploy for commit `b1c16d6` was skipped with `Skipped due to account credit usage exceeded`; the live site remained on deploy `6a1e98dab3df2d000993868b` / commit `d653ad2` until a manual CLI deploy is published.
    - S3 `desktop/latest/latest.json` is still the source of truth for dynamic installer URLs and version display; current manifest version is `3.8.0`.
    - The retained fallback installer URLs are unchanged and remain under `https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/`.
    - Fallback version copy now reads `Latest desktop release` instead of `Version ...` when the browser cannot read the manifest.
    - Mobile/tablet/coarse-pointer or sub-1024px views do not render an active DMG/EXE installer CTA, installer filename, or OS build selector. They show `Open this page on a Mac or Windows desktop to install Ubik Meetings.` and a desktop-install guidance section.
    - Desktop/fine-pointer views keep the dynamic `useDownloadLinks()` CTA href, OS selector, and macOS/Windows-specific install steps.
    - Follow-up commit `0340abd` was pushed to `origin/main`, but Netlify auto-deploy also skipped it with `Skipped due to account credit usage exceeded`.
    - Manual deploy attempts were blocked too: `netlify deploy --prod --dir=dist` returned `JSONHTTPError: Forbidden`, and the Netlify MCP deploy command failed after upload with `500 Internal Server Error`.
    - Current publish blocker: Netlify account/project deployment is blocked at the platform/account layer. Resolve Netlify credit/billing/permission state, then redeploy `origin/main` at `0340abd` or later.

## Verification

### 2026-07-22 homepage interaction and copy pass

- Reworked the hero category chip in `src/components/landing/LandingV2Sections.tsx` into an animated cold-chain instrument: pulse marker, live category label, and scanning status bar. Categories now rotate through Frozen food, Dairy, Meat, Produce, and Specialty goods.
- Replaced homepage case-study and founder copy that was over-indexed on seafood with broader perishable-trade / buyer-RFQ language. Existing editorial Trade Notes still contain seafood-specific articles by design.
- Added a distinct animated SVG handoff path to `src/components/landing/HowWorkflowCarousel.tsx`; it sits alongside the actual prototype video/image workflow media and lights the active review stages.
- Added reusable CSS motion primitives in `src/index.css` for the trade chip and workflow path; respects the existing reduced-motion behavior in the media carousel.
- Visual evidence after the pass:
  - `output/playwright/perishable-redesign-desktop.png`
  - `output/playwright/perishable-redesign-mobile.png`
  - `output/playwright/perishable-how-it-works-desktop.png`
  - `output/playwright/perishable-how-it-works-mobile.png`
- Browser checks: homepage and `/how-it-works` rendered with no console errors from the new code, no horizontal overflow at 390px, the chip is present, the workflow path is present, and `/how-it-works` still renders one real prototype video.
- `pnpm build`, `pnpm lint`, and `git diff --check` pass. Lint retains the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
- Remotion and HeyGen are not installed in this repo or available as active skills/tools in this session. The implementation uses the existing Motion/GSAP-capable stack, CSS keyframes, inline SVG motion, dotmatrix registry components, and shipped prototype media instead of adding a video-generation pipeline to the marketing page.

### 2026-07-22 case-study clarity follow-up

- Replaced the ambiguous `one decision · buyer RFQ` label with the explicit `case study · buyer RFQ` label and the plain-language heading `How one buyer RFQ moves from inbox to approved quote.`
- Added Motion enter/exit transitions to the active case-study fragment while keeping the existing snap rail and keyboard/focus behavior.
- Inspected the sibling `/Users/shubhranshujha/Codex/web-app` design-system sources and aligned the landing treatment with its real primitives: approval/status language, workflow library framing, operator queue, and inset `well` surfaces. The repos remain separate applications and the landing uses its own compatible tokens/components.
- Follow-up evidence: `output/playwright/case-study-copy-section.png`, `output/playwright/case-study-copy-desktop.png`, and `output/playwright/case-study-copy-mobile.png`.
- Browser verification confirms the new case-study label is present, the old `one decision` copy is absent, and 390px has no horizontal overflow. `pnpm build`, `pnpm lint`, and `git diff --check` pass; lint retains the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.

### 2026-07-22 component structure correction

- The prior follow-up only relabeled and animated the existing card rail; this pass replaced the repeated card pattern.
- Homepage case study is now an annotated evidence scene: left `Trace the request` stage navigator, center animated evidence workspace, and right `Decision receipt` handoff timeline.
- `/how-it-works` is now a workflow canvas: frameless workflow picker, large product-media panel, and vertical review trace. It uses real prototype media from `public/prototypes/` and does not repeat the marketing card grid.
- Visual evidence:
  - `output/playwright/case-study-trace-section.png`
  - `output/playwright/workflow-canvas-section.png`
  - `output/playwright/case-study-trace-desktop.png`
  - `output/playwright/workflow-canvas-desktop.png`
- Browser verification found `.case-study-scene`, `.workflow-canvas`, and `.workflow-media-panel`; desktop and 390px mobile had no horizontal overflow. Build, lint, and diff checks pass.

### 2026-07-22 ontology and joined-insight pass

- Replaced the case-study middle artifact with `CaseStudyInsightCanvas`: a source-linked margin chart, ontology/entity graph connecting RFQ → buyer/SKU/lane/margin, an explainable quote insight, and a memory-recalled source strip for Gmail, WhatsApp, margin model, and ERP.
- Removed the Workflow Section `Review loop` column completely. The workflow component now gives the real product media the space, with only the workflow picker and product journey remaining.
- Evidence:
  - `output/playwright/case-study-insight-canvas-section.png`
  - `output/playwright/case-study-insight-canvas.png`
  - `output/playwright/workflow-no-review-loop.png`
- Browser verification confirmed `.case-insight` and `.workflow-media-panel`, no `Review loop` text, no horizontal overflow, and no console errors from the new code. Build, lint, and diff checks pass; existing lint warnings remain confined to `src/components/evilcharts/**`.

### 2026-07-22 ontology graph cleanup

- Simplified the ontology SVG after browser review: removed the extra cross-links and ambiguous shipment label, changed the center entity to a clear RFQ block, and kept only four linked entities (buyer, SKU, lane, margin) with consistent geometry.
- New copy: `One request. Four linked entities. One explainable decision.`
- Verified `pnpm build`, `pnpm lint`, and `git diff --check`; lint retains the existing seven warnings in `src/components/evilcharts/**`.

### 2026-07-22 case-study stage variety pass

- Replaced the single repeated `CaseStudyInsightCanvas` with four distinct stage components:
  - signals: ontology map + comparable-quote margin chart
  - recommendation: multi-source memory join timeline
  - approval: dark approval artifact with commit map and mapped fields
  - outcome: before/after time comparison with decision/system/memory writeback
- Browser evidence captured at `output/playwright/case-study-variety-stage1.png` and `output/playwright/case-study-variety-stage3.png`; stage 3 interaction was verified by clicking the `approval` step.
- Replaced the chart area fill with an explicit RGBA SVG fill after browser rendering exposed a black fallback.
- `pnpm build`, `pnpm lint`, and `git diff --check` pass; lint retains the existing seven warnings in `src/components/evilcharts/**`.

### 2026-07-23 company ticker update

- Fixed the missing Ola logo by switching from the unavailable favicon endpoint to the Wikimedia-hosted Ola Cabs SVG asset; the asset returned HTTP 200 during verification.
- Added Walmart, Whole Foods Market, and Costco to the Companies We have worked with ticker using Google favicon assets.
- `pnpm build`, `pnpm lint`, and `git diff --check` pass; lint retains the existing seven warnings in `src/components/evilcharts/**`.

### 2026-07-23 homepage How It Works simplification

- Removed the `§ how it works · tuesday 09:14–14:22` eyebrow/date and the explanatory right-column paragraph from the homepage rail heading.
- Removed the long step paragraphs from `RailStepPanel`; each stage now leads with the handoff headline, compact source chips, and the evidence surface.
- Tightened the right evidence panel from a fixed `min-h-[240px]` box to content-fit sizing.
- Added Motion transitions between selected steps and a small three-square Ubik blue transition signal using CSS keyframes.
- `pnpm build`, `pnpm lint`, and `git diff --check` pass; lint retains the existing seven warnings in `src/components/evilcharts/**`.

- `pnpm lint` passes.
- `pnpm build` passes.
- Latest CompAI compliance verification:
  - `git pull --ff-only origin main` returned already up to date.
  - `pnpm lint` passes with existing Fast Refresh warnings in `src/components/evilcharts/**`.
  - `pnpm build` passes.
  - `git diff --check` passes.
  - Rendered DOM checks at 390px confirm `/legal/privacy` includes PostHog disclosure, `/legal/subprocessors` includes Recall.ai and the PostHog note, old "We do not use tracking cookies" and "currently TBD" copy are absent, footer Privacy/Subprocessors links are present, and there is no horizontal overflow.
  - `security.txt` is served at `/.well-known/security.txt` in the Vite preview.
  - `mintlify validate` passes after rerunning with cache permissions.
  - `mintlify broken-links` passes.
  - Latest finalized privacy-pack verification:
    - `pnpm lint` passes with existing Fast Refresh warnings in `src/components/evilcharts/**`.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - `mintlify validate` passes after rerunning with cache permissions.
    - `mintlify broken-links` passes.
    - Rendered DOM checks at 390px confirm required finalized phrases are present on `/legal/privacy`, `/legal/subprocessors`, and `/legal/cookies`; old Malaysia entity/address, region-under-review subprocessor locations, and earlier cookieless-only privacy wording are absent from those legal pages; `/privacy` compatibility renders the finalized notice; `/.well-known/security.txt` returns 200.
    - Local design review server: `http://127.0.0.1:5173/`.
    - Legal cleanup follow-up:
      - Removed rendered source-path/mapping notes from `/legal/privacy`, `/legal/subprocessors`, and `/legal/cookies`; source mapping now remains only in code comments and this handoff.
      - Removed SeaRates from `/legal/subprocessors` because it is not currently used.
      - Targeted audit found no rendered legal-page hits for `mapped from`, `compliance/privacy`, `placeholder`, `under review`, or `SeaRates`; broader marketing integration copy still mentions SeaRates and is intentionally left for a separate decision.
      - `pnpm lint`, `pnpm build`, `git diff --check`, `mintlify validate`, and `mintlify broken-links` pass. Mintlify commands should be run from `docs/`; running `mintlify broken-links` from repo root reports false broken docs links.
      - Rendered DOM checks at 390px confirm `/legal/privacy`, `/legal/subprocessors`, and `/legal/cookies` contain required finalized terms, contain none of the forbidden cleanup strings, and have no horizontal overflow.
      - Visual delta: the cookie intro now ends after the public domain scope, the subprocessor transfer note no longer exposes an internal source path, and the mobile subprocessor list moves from Razorpay directly to Microsoft.
      - Updated visual evidence:
        - `verification/legal-cleanup-privacy-desktop.png`
        - `verification/legal-cleanup-privacy-mobile.png`
        - `verification/legal-cleanup-subprocessors-desktop.png`
        - `verification/legal-cleanup-subprocessors-mobile.png`
        - `verification/legal-cleanup-cookies-desktop.png`
        - `verification/legal-cleanup-cookies-mobile.png`
        - `verification/legal-cleanup-footer-fullpage.png`
    - Latest Trust Center and Meetings download verification:
      - `mcp__comp_ai.get_public_vendors` with `friendlyUrl: solarpunk-technology` returned live vendors including PostHog and SeaRates.
      - `curl` checks returned 200 for the public overview API and public vendor API.
      - Public vendor API parsed at 25 vendors with `PostHog=true` and `SeaRates=true`; local `/legal/subprocessors` includes PostHog and intentionally excludes SeaRates.
      - `/download` rendered with no auto-download. DOM verification confirmed selected installer `mac_arm64` for `/download?os=mac`, CTA `href=https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-arm64.dmg`, and CTA text `Download for Mac`.
      - Selector verification confirmed switching to Windows changes selected installer to `windows`, CTA `href=https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-Setup.exe`, and CTA text `Download for Windows`.
      - Mobile `/download?os=windows` confirmed no horizontal overflow at 390px and retained the Windows S3 installer URL.
      - `/security` desktop/mobile confirmed no horizontal overflow and two `Open Trust Center` links pointing to `https://security.trycomp.ai/?organizationId=org_6942f5b5ad9fe5d196af748b`.
      - `/legal/subprocessors` desktop/mobile confirmed no horizontal overflow, `View live Trust Center` points to the Trust Center URL, PostHog is visible, and SeaRates is not visible.
      - Codex in-app Browser plugin was attempted first but could not attach to the local Vite target, so Playwright was used for screenshots and DOM checks.
      - Local S3 manifest requests still show CORS errors from the Vite origin; `useDownloadLinks()` falls back to the retained old S3 download URLs and the rendered CTA `href`s were verified.
      - Checks passed after implementation: `pnpm lint` with existing Fast Refresh warnings in `src/components/evilcharts/**`, `pnpm build`, `git diff --check`, `mintlify validate`, and `mintlify broken-links`.
      - Visual delta: `/download` changed from auto-download-first to a meetings-product hero with one adaptive CTA; `/security` gained Trust Center CTAs without layout overflow; `/legal/subprocessors` gained the Trust Center CTA and PostHog parity while staying focused on public subprocessors.
      - Latest visual evidence:
        - `verification/trust-meetings-download-desktop.png`
        - `verification/trust-meetings-download-windows-selected.png`
        - `verification/trust-meetings-download-mobile.png`
        - `verification/trust-center-security-desktop.png`
        - `verification/trust-center-security-mobile.png`
        - `verification/trust-center-subprocessors-desktop.png`
        - `verification/trust-center-subprocessors-mobile.png`
    - Latest browser-feedback verification:
      - In-app Browser verified `/download?os=mac` page identity, nonblank content, no framework overlay, pre-read card presence, `Coming soon`, macOS permission step copy, and ticker segment click from meeting to compliance notification.
      - In-app Browser verified switching the OS selector to Windows changes the primary CTA to `Download for Windows`, the CTA `href` to `https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-Setup.exe`, and install copy to `Complete the wizard`.
      - 390px Browser viewport check returned `documentScrollWidth=375` and `bodyScrollWidth=375` for the Windows download route before viewport reset.
      - Playwright evidence confirmed no document/body horizontal overflow on desktop or 390px mobile, pre-read source labels are present, ticker click shows `Compliance gaps flagged`, and retained S3 installer URLs are still used.
      - `aws s3api get-bucket-cors --bucket ubik-meetings` could not run because AWS credentials were not configured in this environment.
      - Localhost manifest CORS errors remain expected local-dev behavior; `useDownloadLinks()` falls back to the retained S3 URLs.
      - Checks passed after the feedback pass: `pnpm lint` with existing Fast Refresh warnings in `src/components/evilcharts/**`, `pnpm build`, `git diff --check`, `mintlify validate`, and `mintlify broken-links`.
      - Latest visual evidence:
        - `verification/trust-meetings-download-feedback-desktop.png`
        - `verification/trust-meetings-download-feedback-windows-selected.png`
        - `verification/trust-meetings-download-feedback-mobile.png`
        - `verification/trust-meetings-download-feedback-mobile-fullpage.png`
        - `verification/trust-meetings-download-feedback-proof-section.png`
        - `verification/trust-center-security-feedback-desktop.png`
        - `verification/trust-center-security-feedback-mobile.png`
        - `verification/trust-center-subprocessors-feedback-desktop.png`
        - `verification/trust-center-subprocessors-feedback-mobile.png`
    - Latest deployment/version/mobile guard verification:
      - `git rev-parse --short HEAD` and `git rev-parse --short origin/main` both returned `b1c16d6` before the follow-up edit.
      - Netlify API showed the latest production deploy for `b1c16d6` in `error` state with `Skipped due to account credit usage exceeded`.
      - `curl` confirmed S3 `latest.json` returns 200 and contains `version: 3.8.0`; it does not expose browser CORS headers yet.
      - `aws s3api put-bucket-cors --bucket ubik-meetings` could not run because AWS credentials were not configured.
      - Local rendered checks confirmed desktop Windows and Mac retain active S3 installer anchors from `useDownloadLinks()`, while 820px tablet and 390px mobile expose zero installer anchors, no DMG/EXE filenames, no `Version ...`, and no document overflow.
      - Checks passed: `pnpm lint` with existing Fast Refresh warnings in `src/components/evilcharts/**`, `pnpm build`, `git diff --check`, `mintlify validate`, and `mintlify broken-links`.
      - Netlify API after push showed deploy `6a271dd5f7c3eb0008b2169b` for commit `0340abd2e4265914bf3404ca75295df606ec3297` in `error` state with `Skipped due to account credit usage exceeded`.
      - Production HTML probe still did not contain the new `/download` text because the latest deploys are unpublished.
      - Latest visual evidence:
        - `verification/download-desktop-active-cta-version-fallback-v2.png`
        - `verification/download-tablet-no-installer-cta-v2.png`
        - `verification/download-mobile-no-installer-cta-v2.png`
    - Visual evidence:
      - `verification/final-privacy-pack-privacy-desktop.png`
      - `verification/final-privacy-pack-privacy-mobile.png`
      - `verification/final-privacy-pack-subprocessors-desktop.png`
      - `verification/final-privacy-pack-subprocessors-mobile.png`
      - `verification/final-privacy-pack-cookies-desktop.png`
      - `verification/final-privacy-pack-cookies-mobile.png`
      - `verification/final-privacy-pack-footer-fullpage.png`
  - Visual evidence:
    - `verification/compai-privacy-desktop.png`
    - `verification/compai-privacy-mobile.png`
    - `verification/compai-privacy-mobile-fullpage.png`
    - `verification/compai-subprocessors-desktop.png`
    - `verification/compai-subprocessors-mobile.png`
    - `verification/compai-subprocessors-fullpage.png`
- Homepage and security note OG screenshots now exist at `public/og-image.png` and `public/security/og-image.png`.
- Latest browser-comment visual verification captured after this correction:
  - `verification/landing-comments-desktop.png`
  - `verification/landing-comments-mobile.png`
  - `verification/landing-comments-fullpage.png`
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
- Latest media/wordmark pass:
  - Pricing `Computer and browser use` strip now uses the Ubik wordmark with a smaller `Local` suffix.
  - Hero queue active row contrast was tightened so active copy and logo chips read clearly on blue.
  - Visual evidence: `verification/media-pass-home-desktop-v2.png`, `verification/media-pass-how-full-v2.png`, `verification/media-pass-how-mobile-v2.png`, `verification/media-pass-pricing-full-v2.png`, `verification/media-pass-pricing-mobile-v2.png`.
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
- Latest CTA/blog pass:
  - Replaced visible `Try now` CTA language with `Talk to founders` and `Realise true value in 30 days` across the nav, homepage hero/CTA band, pricing Base CTA, how-it-works CTA, mobile menu, and `/try` page copy.
  - Blog articles no longer use placeholder body copy. The three current posts now demonstrate distinct layouts in the Ubik style: metric bar infographic, RFQ workflow compression diagram, and AI-native trade thesis cards.
  - Blog article copy avoids named customer/company references.
  - Verification: `pnpm lint` passes, `pnpm build` passes, and browser text checks across `/`, `/try`, `/blog`, and all three blog posts find no old CTA wording or named customer examples.
  - Latest evidence: `verification/cta-blog-pass-home-desktop.png`, `verification/cta-blog-pass-try-desktop.png`, `verification/cta-blog-pass-article-chart.png`, `verification/cta-blog-pass-article-workflow.png`, `verification/cta-blog-pass-article-thesis.png`, `verification/cta-blog-pass-article-mobile.png`.
- Latest theme-toggle/mobile contrast pass:
  - Pulled `origin/main` into `jha-blue-version` with a fast-forward to the merged blue landing PR.
  - Added a persisted light/dark theme toggle using existing `next-themes`; first visit still follows system theme, and explicit light/dark choices persist in local storage.
  - Desktop/tablet header shows the compact icon toggle beside language and CTA; mobile exposes labelled Light/Dark controls inside the sheet menu.
  - Brand and Solarpunk logo assets now switch from the active `.dark` class instead of `prefers-color-scheme`, so manual theme changes update imagery correctly.
  - Dark-mode greys were lifted for readability: muted text, borders, inputs, wells, cards, and blue foreground contrast are clearer while preserving the Ubik blue accent.
  - Mobile-safe wrappers now use `min-h-dvh` where touched; no `h-screen`/`min-h-screen` remains in `src`.
  - Visual requirements from user screenshots:
    - Layout: login or login-adjacent form content must stay reachable on mobile via vertical scroll.
    - Spacing: mobile stacks brand, copy, proof/cards, and sign-in/request controls without clipping.
    - Typography: dark-mode secondary text must not read as dull low-contrast grey.
    - Color: keep Ubik blue as the active-state, metric, and CTA accent across both dark and light variants.
    - Interactions: theme toggle is keyboard-accessible, labelled, and visibly indicates the active theme.
  - Before/reference evidence: user-provided screenshots in the May 3 theme request plus existing local references `verification/heading-queue-pass-desktop-v2.png`, `verification/media-pass-home-desktop-v2.png`, and `verification/pricing-crisp-mobile.png`.
  - After evidence: `verification/theme-toggle-home-desktop-light.png`, `verification/theme-toggle-home-desktop-dark.png`, `verification/theme-toggle-try-mobile-light.png`, `verification/theme-toggle-try-mobile-dark.png`, `verification/theme-toggle-menu-mobile-dark.png`.
  - Verification: `pnpm lint` passes, `pnpm build` passes, Browser/IAB DOM interaction verified mobile sheet theme controls and dark pressed state, Playwright viewport screenshots verified `/`, `/pricing`, `/how-it-works`, `/blog`, and `/try` at 390px with no horizontal overflow and reachable vertical scroll.
  - Remaining dependency: `app.theubik.com/login` is not present in this repo. Port this same theme contract into the app/login repo once that repo is pulled: persisted explicit light/dark, `min-h-dvh`, no clipped mobile login card, and no horizontal overflow at 360-430px.
- Latest Mintlify user-guide pass:
  - Added a Mintlify docs project under `docs/` with `docs.json`, `style.css`, cropped Ubik wordmark assets, and 12 editable MDX pages.
  - The guide is intentionally a product/user guide for non-technical managers, operators, admins, and reviewers, not developer documentation.
  - Information architecture:
    - Start: `Ubik operator guide`, `Sign in`, `Workspace basics`, `How Ubik AI works`.
    - Workflows: `Inquiry to shipment`, `Approving AI work`, `Daily operating queue`, `Ask Ubik`.
    - Admin: `Users and access`, `Connected tools`, `Security and data`.
    - Troubleshooting: `FAQ`.
  - Visual requirements from the docs/user-guide request:
    - Layout: readable Mintlify guide with left navigation, product-first content, and mobile pages that scroll without horizontal overflow.
    - Spacing: maintain the Ubik analytical/editorial rhythm with hairline dividers, open white/dark space, and no marketing-card bloat.
    - Typography: Montserrat headings, Noto Sans body, IBM Plex Mono labels/steps/metrics.
    - Color: Ubik blue remains the active accent; dark mode uses stronger grey contrast and an accessible hover/dark blue token.
    - Interactions: docs topbar links to main site, founder contact, and `app.theubik.com/login`; landing nav and mobile sheet include `Guide`.
  - Landing integration:
    - Desktop nav, mobile nav, and footer now link to `https://docs.theubik.com`.
    - `netlify.toml` and `vercel.json` add `/guide` redirects to `https://docs.theubik.com` before the SPA fallback.
  - Verification:
    - `mint validate` passes.
    - `mint broken-links` passes.
    - `mint a11y` exits successfully; color checks pass minimum thresholds with AA-not-AAA warnings on the primary/light blue pair.
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright screenshots show no horizontal overflow at 390px mobile or 1440px desktop.
  - Latest visual evidence:
    - Docs desktop light: `verification/docs-guide-desktop-light.png`
    - Docs desktop dark: `verification/docs-guide-desktop-dark.png`
    - Docs mobile light: `verification/docs-guide-mobile-light.png`
    - Docs mobile dark AI guide: `verification/docs-guide-mobile-dark.png`
    - Landing desktop nav with Guide: `verification/landing-guide-nav-desktop.png`
    - Landing mobile sheet with Guide: `verification/landing-guide-menu-mobile.png`
  - Remaining dependency:
    - Connect Mintlify to this repo’s `/docs` directory on `main`, configure `docs.theubik.com`, and confirm production TLS/DNS plus PR preview availability based on the Mintlify plan/credits.
- Latest CTA destination pass:
  - Added centralized external URL constants in `src/lib/links.ts`.
  - All visible `Talk to founders` CTAs now point to `https://calendar.app.google/frJjo2U6qdBdgZ1w9`, including landing header, homepage hero, CTA band, pricing Enterprise, security review, workflow walkthrough, footer, and Mintlify docs topbar.
  - All visible `Realise true value in 30 days` CTAs now point to `https://app.theubik.com`.
  - `/try` now redirects to `https://app.theubik.com` in both `netlify.toml` and `vercel.json`, and `/try` was removed from `public/sitemap.xml` because it is no longer a canonical landing page.
  - Mintlify docs topbar primary CTA now points to `https://app.theubik.com` instead of `/login`.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `mint validate` passes.
    - `mint broken-links` passes.
    - `mint a11y` exits successfully with the existing AA-not-AAA color warnings only.
    - `git diff --check` passes.
    - Playwright verified homepage, mobile menu, pricing, and docs CTA hrefs resolve to the calendar or app URLs and have no horizontal overflow.
- Latest CTA/nav rename pass:
  - Browser comments requested: replace `Realise true value in 30 days` with `Try Ubik Now`, remove Product from top nav, rename Journal to Trade Notes, rename Trust to Security, add Ubik Local to top/mobile nav, and make Try Ubik Now primary while Talk to founders is secondary.
  - Header CTA now reads `Try Ubik Now` and links to `https://app.theubik.com`.
  - Homepage hero and lower CTA band now use `Try Ubik Now` as the primary app CTA and `Talk to founders` as secondary.
  - Top/mobile nav now shows `How it works`, `Guide`, `Pricing`, `Trade Notes`, `Security`, and `Ubik Local`; Product is removed.
  - `Ubik Local` routes to `/download?os=<detectedOS>` using the existing OS detection helper.
  - Journal/Trust wording was also updated on the blog, security memo, and related visible surfaces.
  - Visual requirements from user screenshots:
    - Layout: preserve compact mobile header with logo, primary CTA, and plus-menu trigger.
    - Spacing: mobile CTA labels must fit in the existing header/button widths.
    - Typography: use exact requested CTA/nav labels, including `Try Ubik Now` casing.
    - Color: app CTA is primary blue; founder CTA is secondary/outline where paired.
    - Interactions: header Try Ubik Now opens `app.theubik.com`; Ubik Local opens the OS-specific download route.
    - Responsive behavior: full desktop nav shows renamed items and Product removal; mobile sheet shows the same nav set.
  - Evidence:
    - Before in-app browser screenshot: `/tmp/ubik-landing-qa/before-home.png`
    - After mobile/header screenshot: `/tmp/ubik-landing-qa/after-home-stable.png`
    - After mobile menu screenshot: `/tmp/ubik-landing-qa/after-menu-stable.png`
    - After desktop nav screenshot: `/tmp/ubik-landing-qa/after-desktop-settled.png`
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - Browser/IAB verified header CTA text `Try Ubik Now`, href `https://app.theubik.com`, Product link count `0`, mobile menu `Ubik Local`, `Trade Notes`, and `Security`, and no remaining `Realise true value in 30 days` text.
    - Supplemental Playwright desktop screenshot verified the full-width nav and primary/secondary hero CTA color flip.
  - Remaining known console noise:
    - Existing React Router v7 future-flag warnings.
    - Existing SVG property warnings from `src/components/landing/SourceLogoTile.tsx` (`font-family`, `paint-order`, `letter-spacing`, `word-spacing`); not introduced by this CTA/nav pass.
- Latest nav hover pass:
  - Desktop top nav links now use a shared `.nav-link` class.
  - Hover/focus/active state turns the selected nav item Ubik blue with a white background and blue border.
  - Evidence: `/tmp/ubik-landing-qa/nav-hover-playwright.png`.
  - Verification: `pnpm lint`, `pnpm build`, and `git diff --check` pass; Playwright computed hover styles for `Trade Notes` as blue text, white background, and blue border.
  - Latest visual evidence:
    - CTA home desktop: `verification/cta-links-home-desktop.png`
    - CTA mobile menu: `verification/cta-links-home-mobile-menu.png`
    - CTA pricing desktop: `verification/cta-links-pricing-desktop.png`
    - CTA docs desktop: `verification/cta-links-docs-desktop.png`
- Latest browser comment fix pass:
  - Homepage FAQ answers now render as structured paragraphs and lightweight bullets while preserving the plain-text answer strings for FAQ schema.
  - Header chrome now uses a translucent matrix-grid treatment so the hero background visually continues through the sticky nav.
  - Theme switching is a single keyboard-accessible button. Desktop shows one icon button; the mobile sheet shows one labelled row with the current mode.
  - Bottom three-column callouts now read `Agentify backend operations`, `Local-first data privacy approach`, and `Human approved -> autonomous and audited`.
  - Before/reference evidence: user-provided browser comment screenshots for the FAQ text dump, `/how-it-works` header, and bottom proof callouts are attached in the current Codex thread; they were not local repo files.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified one visible desktop theme toggle button, successful toggle state change, and no horizontal overflow on `/` and `/how-it-works` at 1267px and 390px.
  - Latest visual evidence:
    - FAQ desktop: `verification/comment-faq-format-desktop.png`
    - FAQ mobile: `verification/comment-faq-format-mobile.png`
    - Header matrix and single toggle light: `verification/comment-header-matrix-toggle-light.png`
    - Header matrix and single toggle dark: `verification/comment-header-matrix-toggle-dark.png`
    - Bottom callout pillars: `verification/comment-bottom-pillars-desktop.png`
- Latest header seam polish:
  - Header chrome now uses a transparent/frosted layer instead of painting its own duplicate grid, so the actual hero matrix bleeds through and there is no second grid origin to drift.
  - Removed the extra header bottom border that made the top nav read as a separate slab.
  - Verification: `pnpm lint` passes, `pnpm build` passes, `git diff --check` passes, and Playwright verified no horizontal overflow on the homepage at 1267px.
  - Latest visual evidence: `verification/comment-header-seam-through-light.png`.
- Latest browser-language auto-routing pass:
  - i18n now uses supported base locales from `src/locales/*`, resolves regional browser languages such as `pl-PL` to `pl`, and falls back to English for unsupported languages such as `ja-JP` and `ko-KR`.
  - Automatic detector caching is disabled. Only an explicit language selector choice writes `ubik-lang` plus an explicit marker, so old automatic `ubik-lang=en` cache no longer blocks browser-language routing.
  - The language selector now reflects `i18n.resolvedLanguage`, manual overrides persist after reload, and `<html lang>` updates to the resolved locale.
  - The shared shell navigation/footer labels now use available locale keys with English fallback for labels without approved translations.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified `pl-PL -> pl`, `de-DE -> de`, `ja-JP -> en`, `ko-KR -> en`, stale non-explicit `ubik-lang=en` migration, manual `de` override persistence, and no 390px mobile overflow.
  - Latest visual evidence:
    - Polish desktop header: `verification/language-routing-pl-desktop.png`
    - German desktop header: `verification/language-routing-de-desktop.png`
    - Japanese fallback desktop header: `verification/language-routing-ja-fallback-desktop.png`
    - German manual override mobile menu: `verification/language-routing-mobile-menu-de.png`
- Latest client-facing trust page pass:
  - `/security` has been rewritten from an internal CTO/vendor-review memo into a client-facing Trust page for seafood importers, exporters, processors, directors, operators, and admins.
  - The page now explains admin approval, least-needed access, human review, revocation, and no third-party model training in plain language.
  - The scary DWD/Domain-Wide Delegation phrasing is intentionally absent from visible page copy; admin approval is described as Google Workspace or Microsoft 365 app approval.
  - Approved trust claims retained: SOC 2 Type II audit in progress, GDPR, ISO 27001, AES-256 at rest, TLS 1.3 in transit, and audit log on every action.
  - CTAs use the existing founder meeting URL and copy/share trust note behavior.
  - Before/reference evidence: the prior `/security` page copy in `src/pages/SecurityMemo.tsx` led with `Security posture for an AI operating layer` and was framed for technical reviewers.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified `/security` desktop and 390px mobile load without horizontal overflow, have the new hero, do not contain `Domain-Wide Delegation` or `DWD`, and do not contain the old internal memo phrases.
  - Latest visual evidence:
    - Trust desktop full page: `verification/trust-client-facing-desktop.png`
    - Trust mobile full page: `verification/trust-client-facing-mobile.png`
- Latest legal policy pass:
  - `/privacy-policy` and `/privacy-policy.html` now render the supplied `Privacy Notice`, effective `2026-05-05`, for Solarpunk Technology Sdn Bhd operating as Ubik.
  - The privacy page includes controller details, Malaysia tax ID and address, founders, public contact, public-website scope, processor distinction for customer-submitted data, subprocessors, international transfers, security safeguards, AI/LLM handling, retention TBDs, privacy rights, children, change notice, and contact blocks.
  - Legal-copy safety adjustment: current LLM/API providers are named as OpenAI and Anthropic; hosting/infrastructure/API/database providers and formal subprocessor page remain TBD/as applicable.
  - EU/UK representative and DPO are no longer shown as appointed named contacts; the page now says `not appointed unless legally required`.
  - Cookie/tracking wording is explicit but reconciled with current site behavior: the page says no tracking cookies, web beacons, pixels, or advertising tracking technologies on `theubik.com`, while allowing strictly necessary browser storage for language and theme preferences.
  - `/terms-of-service` and `/terms-of-service.html` now render a structured `Terms and Conditions` page, effective `2026-05-05`, covering B2B access, accounts, customer responsibilities, customer content, AI outputs, acceptable use, third-party services, fees, suspension/termination, confidentiality, privacy/DPA relationship, security, disclaimers, liability, indemnity, governing law, changes, and contact.
  - Public SOC 2 wording has been softened site-wide to `SOC 2 Type II audit in progress` or `SOC 2 Type II report is not currently available while the audit is being completed`; no rendered page checked implies a completed report.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified `/privacy-policy` and `/terms-of-service` on desktop and 390px mobile with no horizontal overflow, expected SEO titles, required legal/company text, and audit-in-progress SOC 2 wording across `/`, `/security`, `/pricing`, `/privacy-policy`, and `/terms-of-service`.
  - Latest visual evidence:
    - Privacy desktop full page: `verification/legal-privacy-notice-desktop.png`
    - Privacy mobile full page: `verification/legal-privacy-notice-mobile.png`
    - Terms desktop full page: `verification/legal-terms-conditions-desktop.png`
    - Terms mobile full page: `verification/legal-terms-conditions-mobile.png`
  - Remaining legal dependency: final legal review is still needed before production reliance, especially retention TBDs, DPA/subprocessor page, governing-law wording, liability cap, EU/UK representative/DPO appointment requirements, and SOC 2 timing.
- Latest trust/security copy polish:
  - `/security` now avoids phrasing that talks down to import/export leadership: removed `Plain-English position`, `plain-language`, `A simple review list`, `blank cheque`, and DWD/Domain-Wide Delegation phrasing from the trust page.
  - The trust page now uses cleaner headings: `Operating position`, `Access approval is scoped`, and `Production review`.
  - The public integrations FAQ now describes Gmail/Outlook/Microsoft 365 as `admin-approved app access` instead of Domain-Wide Delegation.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified `/security`, `/privacy-policy`, and `/terms-of-service` on desktop and 390px mobile with no horizontal overflow, expected copy present, and no forbidden DWD/plain-English phrasing.
  - Latest visual evidence:
    - Trust cleaner desktop full page: `verification/trust-cleaner-client-copy-desktop.png`
    - Trust cleaner mobile full page: `verification/trust-cleaner-client-copy-mobile.png`
- Latest Ubik Local nav/download polish:
  - Removed the duplicate standalone header and mobile-sheet `Ubik Local` download buttons; `Ubik Local` remains only as a normal nav item.
  - Added `Ubik Local` to the footer between `Security` and `Talk to founders`, linked to the detected OS download route.
  - Top nav hover/focus/press now uses a solid Ubik blue box with white text and blue border. Persistent route-active visual styling is removed, so `/download?os=mac` does not leave `Ubik Local` highlighted after selection.
  - `/download` now adds the concise Ubik Local line below the Mac/Windows download buttons and a `Coming soon` section with three ICP-facing cards: spreadsheets without uploads, portal context reviewed, and documents into memory.
  - Visual requirements from browser comments:
    - Layout: desktop header must show only one `Ubik Local`; mobile menu must not duplicate it as a separate button.
    - Spacing: footer keeps compact link row with `Ubik Local` included.
    - Typography: download-page copy stays crisp and leadership-friendly.
    - Color: nav hover/press is blue background with white font, not the inverse.
    - Interactions: active route can keep semantic `active` class but must look neutral unless hovered/focused/pressed.
    - Responsive behavior: new `/download` cards stack on mobile with no horizontal overflow.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified header duplicate count, footer `Ubik Local` href, neutral active `/download` nav styling, solid blue/white hover styling, all new copy/cards, and no mobile overflow.
  - Latest evidence:
    - Header no duplicate: `/tmp/ubik-landing-qa/header-no-duplicate.png`
    - Footer Ubik Local: `/tmp/ubik-landing-qa/footer-ubik-local.png`
    - Download local section desktop: `/tmp/ubik-landing-qa/download-local-section.png`
    - Download local section mobile: `/tmp/ubik-landing-qa/download-local-section-mobile.png`
    - Nav hover blue/white: `/tmp/ubik-landing-qa/nav-hover-blue-white.png`
- Latest Ubik Local download comment pass:
  - Top nav order now places `Ubik Local` in the middle: `How it works`, `Guide`, `Pricing`, `Ubik Local`, `Trade Notes`, `Security`; `Security` is the rightmost mid-nav item.
  - Removed the section-level `Coming soon` badge above the Ubik Local heading. Individual cards still carry small `COMING SOON` labels.
  - Download section heading now reads `Your local bridge for intelligence.`
  - Supporting copy now fits on one desktop line: `Ubik Local captures useful computer context and sends only reviewed trade signals into Ubik.`
  - Installer steps are collapsed by default and only render after a user clicks a Mac/Windows/manual download control. The existing automatic download behavior remains unchanged.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified nav order, no top `Coming soon` badge, one-line desktop copy, installer steps hidden before click, installer steps visible after download click, solid blue/white hover state, and no mobile horizontal overflow.
  - Latest evidence:
    - Collapsed local section: `/tmp/ubik-landing-qa/download-local-collapsed.png`
    - Install guide after download click: `/tmp/ubik-landing-qa/download-local-install-guide.png`
    - Collapsed local section mobile: `/tmp/ubik-landing-qa/download-local-collapsed-mobile.png`
    - Nav hover blue/white: `/tmp/ubik-landing-qa/nav-hover-blue-white.png`
- Latest Origin Roulette blog pass:
  - PR #5 branch now publishes one real Trade Notes article: `/blog/origin-roulette-2026-shrimp-sourcing`.
  - The prior three placeholder/static article bodies were removed from the public blog list; reusable article chrome and template fallback remain in `src/pages/Blog.tsx`.
  - Blog data for the new article lives in `src/lib/blog/origin-roulette.ts`, including the public post metadata, origin profiles, flow-map data, tariff cells, decision rows, and source notes.
  - Added D3/TopoJSON map dependencies for the article-native Robinson flow map and tariff matrix: `d3-geo`, `d3-geo-projection`, `topojson-client`, and `world-atlas`, plus type dependencies.
  - Added `src/components/blog/OriginRouletteVisuals.tsx` for:
    - `OriginPortraitRail` with Phosphor `FishSimpleIcon` filter control and light/dark country portraits.
    - `OriginFlowMap` with weighted origin-destination lines and tariff brackets.
    - `TariffDifferentialMatrix` with pending-risk asterisks.
    - `DecisionTreeTable` for forward-book origin choices.
  - Article assets copied into `public/blog/origin-roulette/`:
    - Header images: `header-light.png`, `header-dark.png`.
    - Country portraits: `portraits/light_*.png`, `portraits/dark_*.png`.
  - SEO/GEO updates:
    - Article canonical, `og:type=article`, OG image, and JSON-LD `BlogPosting` are wired.
    - `public/sitemap.xml` now lists the new article URL and removes old placeholder article URLs.
    - `public/llms.txt` now includes an AI-readable Origin Roulette summary and key terms.
  - Visual requirements from the blog request:
    - Layout: one public Trade Notes feature card, consistent article chrome, sticky share panel on desktop, single-column mobile.
    - Spacing: long article sections, charts, and tables stay contained; wide visuals use internal horizontal scrollers only.
    - Typography: Ubik editorial heading/body/mono rhythm retained across article, matrix, map, and captions.
    - Color: light/dark header and portrait variants switch with active theme; tariff matrix uses Ubik blue plus warning/support tones.
    - Interactions: share panel expands, origin filters update the portrait/details panel, map lanes expose selected lane details.
    - Responsive behavior: no document-level horizontal overflow at 390, 768, 1366, or 1728 px.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - Playwright verified `/blog` and `/blog/origin-roulette-2026-shrimp-sourcing`, light/dark screenshots, no horizontal overflow at 390/768/1366/1728 px, share expansion, origin filtering, canonical URL, OG image, `og:type=article`, and JSON-LD presence.
  - Latest evidence:
    - Blog index desktop light: `verification/origin-blog-index-desktop-light.png`
    - Article desktop light: `verification/origin-article-desktop-light.png`
    - Article desktop dark: `verification/origin-article-desktop-dark.png`
    - Article mobile light: `verification/origin-article-mobile-light.png`
    - Article mobile dark: `verification/origin-article-mobile-dark.png`
    - Share/filter interaction: `verification/origin-article-interactions.png`
    - Overflow report: `verification/origin-roulette-visual-report.json`
- Latest blog feature comment pass:
  - Homepage Trade Notes preview no longer uses the generic `Notes on perishable work...` heading or repeated left-column intro.
  - Homepage preview now uses the Origin Roulette header image as the full-width feature lead, with one `Read Trade Notes` link above and a compact article metadata/copy strip below.
  - `/blog` no longer renders the self-evident `Ubik Trade Notes` intro block; it starts directly with the featured article row.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified `/` and `/blog` at 1267px and 390px with no horizontal overflow.
  - Latest evidence:
    - Homepage feature desktop: `verification/comment-blog-feature-home-desktop.png`
    - Blog index no intro desktop: `verification/comment-blog-index-no-intro-desktop.png`
    - Homepage feature mobile: `verification/comment-blog-feature-home-mobile.png`
    - Blog index no intro mobile: `verification/comment-blog-index-no-intro-mobile.png`
    - Overflow report: `verification/comment-blog-feature-report.json`
- Latest Origin Roulette fact-check refresh:
  - `main` was fast-forwarded from `origin/main` at `77d5b35` before edits. Existing untracked `.claude/` directory was left untouched.
  - Updated `/blog/origin-roulette-2026-shrimp-sourcing` against the 18 May 2026 fact-check:
    - Removed dependence on the report authoring frame; no Manus AI attribution or report-workflow language is used in the article.
    - Updated Ecuador U.S. 2025 volume from `~216k / 215,972 MT` to `231,804 MT`.
    - Reframed U.S. tariff presentation from single country rates to duty-stack exposure: base MFN, Section 122/current surcharge status, trade-framework references, AD/CVD deposits, China Section 301, and product carveout status.
    - Narrowed Vietnam / CATCH language so farmed vannamei is not treated as categorically subject to the wild-caught CATCH clock.
    - Replaced the plain source-note list with linked source cards using publisher labels, favicons, and short notes for USITC, White House, ITA, Shrimp Insights, FAO GLOBEFISH, NOAA Fisheries, USITC China Tariffs, and European Commission.
    - Updated `public/llms.txt` with the duty-stack / wild-caught CATCH framing.
  - Visual requirements recorded for this pass:
    - Layout: bottom source section should render as linked source cards with favicons and publisher hierarchy.
    - Spacing: long duty-stack labels and source notes must not overflow on desktop or mobile.
    - Typography: preserve the existing Ubik editorial article style; avoid importing fact-check-report voice.
    - Color: source cards and matrix use existing tokenized shell/card/primary colors.
    - Interactions: source cards are external links; article share and origin filter remain functional.
    - Responsive behavior: article should have no document-level mobile horizontal overflow.
  - Verification:
    - `pnpm exec eslint src` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - `pnpm lint` is blocked by unrelated untracked `.claude/worktrees/determined-engelbart-3f0718` files that ESLint scans; do not treat that as an app-source failure unless `.claude/` is intentionally brought under repo linting.
    - Browser QA verified route identity, nonblank render, updated hero stats, duty-stack matrix labels, source-card DOM presence, source-card screenshot, and mobile width metrics with no document-level overflow.
  - Latest evidence:
    - Before/reference desktop article from prior pass: `verification/origin-article-desktop-light.png`
    - Before/reference mobile article from prior pass: `verification/origin-article-mobile-light.png`
    - After desktop top: `/tmp/ubik-origin-roulette-qa/after-desktop-top.png`
    - After desktop matrix: `/tmp/ubik-origin-roulette-qa/after-desktop-matrix.png`
    - After desktop source cards: `/tmp/ubik-origin-roulette-qa/after-desktop-sources.png`
    - After mobile top: `/tmp/ubik-origin-roulette-qa/after-mobile-top.png`
    - After mobile matrix/no-overflow: `/tmp/ubik-origin-roulette-qa/after-mobile-matrix.png`
- Latest Ubik Local download layout comment pass:
  - The `Ubik Local captures meeting audio...` positioning copy moved above the main download headline so the page explains Ubik Local before the install action.
  - The Mac/Windows install guide rows now render directly below the download buttons after a user clicks a download/manual link, instead of appearing below the `Coming soon` product cards.
  - The lower `Your local bridge for intelligence` section now only carries the coming-soon capability cards.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Playwright verified `/download?os=mac` at 1267px and 390px, with no horizontal overflow and installer steps appearing immediately after the buttons.
  - Latest evidence:
    - Local copy moved up: `verification/download-local-copy-up-desktop.png`
    - Installer guide under buttons desktop: `verification/download-install-guide-under-buttons-desktop.png`
    - Installer guide under buttons mobile: `verification/download-install-guide-under-buttons-mobile.png`
    - Check report: `verification/download-local-comment-report.json`
- Latest security page comment pass:
  - The SOC 2, GDPR, and ISO 27001 trust columns now render boxed yellow `In progress` status tickers with a pulsing square.
  - Security copy was tightened in the hero, operating-position card, trust cards, memo blocks, admin approval, and workspace-admin note.
  - Added a concise PostHog cookieless session telemetry note under the security memo blocks.
  - Added SVGL-sourced Google and Microsoft marks to the Google Workspace and Microsoft 365 admin approval cards.
  - Visual requirements from the user screenshot:
    - Layout: keep the trust columns as a scannable grid and make status visible inside each compliance column.
    - Spacing: copy should be shorter and not force dense paragraph blocks.
    - Typography: yellow ticker uses mono uppercase status text consistent with the rest of the page's operational labels.
    - Color: status uses the existing support/yellow token; admin logos keep their brand colors inside tokenized boxes.
    - Responsive behavior: trust rows and admin cards stack cleanly on 390px with no horizontal overflow.
  - Before evidence:
    - User-attached in-app browser comment screenshot for `/security` in this thread; no local pre-change screenshot path exists in the repo.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - `git diff --check` passes.
    - Browser plugin verified `/security` page identity, nonblank render, status/logos/PostHog text presence, and no framework overlay.
    - Playwright verified desktop/mobile screenshots and no horizontal overflow at 1366px and 390px.
    - Console messages are the existing React Router v7 future-flag warnings only.
  - Latest evidence:
    - Status ticker desktop: `verification/security-status-ticker-desktop.png`
    - Admin logos desktop: `verification/security-admin-logos-desktop.png`
    - Status ticker mobile: `verification/security-status-ticker-mobile.png`
    - Admin logos mobile: `verification/security-admin-logos-mobile.png`
    - Check report: `verification/security-page-report.json`
- Latest OS-aware Ubik Local nav CTA pass:
  - Restored Rini's OS-aware download CTA as a dedicated top-nav button before `Try Ubik Now`.
  - Center nav no longer includes `Ubik Local`; it now reads `How it works`, `Guide`, `Pricing`, `Trade Notes`, `Security`.
  - Desktop CTA rests as `Ubik Local`; hover/focus swaps to the detected OS icon plus `Download App` without changing button width.
  - Mobile sheet now includes an outline `Download App` action with the detected OS icon above the primary `Try Ubik Now` button.
  - Footer keeps the plain `Ubik Local` link to `/download?os=<detected>`.
  - Visual requirements:
    - Layout: dedicated compact header button beside theme toggle, before the primary web-app CTA.
    - Spacing: stable-width button to avoid header shift during hover text swap.
    - Typography: short nav/action labels only; no `Ubik Meetings App` naming in nav.
    - Color: hover/focus uses the existing blue/white nav action treatment.
    - Responsive behavior: desktop-only header button; mobile sheet action with no 390px overflow.
  - Verification:
    - `pnpm lint` passes.
    - `pnpm build` passes.
    - Browser plugin verified `/` page identity and the accessible `Download Ubik Local for Mac` link; Browser screenshot capture timed out, so Playwright was used for stable visual evidence.
    - Playwright verified desktop rest/hover states, click-through to `/download?os=mac`, mobile sheet state, and no horizontal overflow at 1366px and 390px.
    - Console messages include existing React Router future-flag warnings and previously noted SVG/Sheet warnings; no new app crash or framework overlay.
  - Latest evidence:
    - Desktop resting CTA: `verification/nav-local-download-desktop-rest.png`
    - Desktop hover CTA: `verification/nav-local-download-desktop-hover.png`
    - Mobile sheet CTA: `verification/nav-local-download-mobile-sheet.png`
    - Download route reached: `verification/nav-local-download-route.png`
    - Check report: `verification/nav-local-download-report.json`
- Latest LinkedIn carousel pass:
  - Created an 8-slide LinkedIn document carousel from `/blog/origin-roulette-2026-shrimp-sourcing` for the `theubik.com` launch ramp.
  - Output folder: `social/origin-roulette-linkedin-carousel/`.
  - Upload-ready PDF: `social/origin-roulette-linkedin-carousel/origin-roulette-linkedin-carousel.pdf`.
  - Editable render source: `social/origin-roulette-linkedin-carousel/origin-roulette-linkedin-carousel.html`.
  - Regeneration command: `node scripts/render-linkedin-carousel.mjs`.
  - Visual requirements:
    - Layout: square 1080 x 1080 LinkedIn slides with sparse editorial hierarchy and no nested-card treatment.
    - Spacing: large feed-readable title blocks, compact proof/chip grids, and consistent 64px frame.
    - Typography: Montserrat headings, Noto Sans body, IBM Plex Mono operational labels.
    - Color: dark Ubik editorial background with primary blue structural bar and grid field.
    - Writing style: concise trade-desk voice, preserving the origin-risk and operator-workflow framing.
  - Before/style reference evidence:
    - `verification/origin-article-desktop-dark.png`
    - `verification/origin-article-desktop-light.png`
  - After evidence:
    - Cover: `social/origin-roulette-linkedin-carousel/slide-01.png`
    - Origin roles: `social/origin-roulette-linkedin-carousel/slide-04.png`
    - Decision rule: `social/origin-roulette-linkedin-carousel/slide-05.png`
    - CTA: `social/origin-roulette-linkedin-carousel/slide-08.png`
  - Verification:
    - `node scripts/render-linkedin-carousel.mjs` passes and renders 8 PNGs plus one PDF.
    - `pnpm exec eslint scripts/render-linkedin-carousel.mjs` passes.
    - Rendered HTML has 8 footer links to `https://theubik.com`; generated PDF contains 8 URI annotations for `https://theubik.com/`.
    - The decision-rule slide now says `SIMP, forced-labour issues, and CATCH decide durability` and contains no `Annex` mention.
    - Full `pnpm lint` is currently blocked by unrelated existing `.claude/worktrees/determined-engelbart-3f0718` lint errors.
- Latest second Trade Notes blog pass:
  - Work was done in clean sibling worktree `/Users/shubhranshujha/Codex/the-ubik-landing-second-blog` on branch `jex/second-blog-margin-leak`, based on `origin/main` at `17a88c3`; the dirty local `main` checkout was not edited or merged.
  - Added `/blog/the-60-bps-bleed-shrimp-margin-loss` as the second real Trade Notes article.
  - The new article uses the supplied `/Users/shubhranshujha/Downloads/blog/Article 1` source pack, with light/dark hero, waterfall, and deglazed-inspection assets copied under `public/blog/margin-leak/`.
  - Blog registry is no longer Origin-only: shared post types live in `src/lib/blog/types.ts`, the registry lives in `src/lib/blog/index.ts`, and homepage featuring now uses explicit `featured` metadata instead of accidental array position.
  - Unknown `/blog/:slug` routes now render a Trade Note not-found state instead of silently falling back to Origin Roulette.
  - Added `scrollama`, `gsap`, and narrow visx packages for the article-native SVG waterfall scrollytelling component.
  - Visual requirements:
    - Layout: preserve existing Ubik article chrome, sticky desktop share panel, and `/blog` feature-card rhythm.
    - Spacing: the wide waterfall chart must scroll inside its own panel on mobile and must not create document-level overflow.
    - Typography: retain the current heading/body/mono editorial rhythm and keep research-report artifacts out of the prose.
    - Color: use tokenized Ubik colors with light/dark image variants.
    - Interactions: share panel expands, scrollama steps update the active waterfall node, and reduced-motion readers still get all values without animation dependency.
    - Responsive behavior: no document-level horizontal overflow at 390, 768, 1366, or 1728 px.
  - Verification:
    - `pnpm exec eslint src/components/blog/MarginLeakVisuals.tsx src/components/landing/BlogPreview.tsx src/lib/blog src/lib/landing-content.ts src/pages/Blog.tsx` passes.
    - `pnpm build` passes; Vite reports the existing large chunk warning.
    - `git diff --check` passes.
    - Full `pnpm lint` is blocked by an existing `react-hooks/static-components` issue in `src/components/landing/LandingV2Sections.tsx` from the clean `origin/main` baseline.
    - Browser plugin verified route identity, metadata, nonblank render, no framework overlay, scrolly DOM presence, and share button presence. Browser screenshot capture timed out on the image-heavy article, so Playwright produced stable visual evidence.
    - Playwright verified `/`, `/blog`, `/blog/origin-roulette-2026-shrimp-sourcing`, `/blog/the-60-bps-bleed-shrimp-margin-loss`, `/blog/not-a-real-slug`, reduced motion, share expansion, desktop/mobile screenshots, canonical URL, `og:type=article`, OG image, JSON-LD, and no horizontal overflow at 390/768/1366/1728 px.
  - Latest evidence:
    - Desktop light: `verification/margin-leak-article-desktop-light.png`
    - Desktop dark: `verification/margin-leak-article-desktop-dark.png`
    - Mobile light: `verification/margin-leak-article-mobile-light.png`
    - Scrolly step: `verification/margin-leak-scrolly-step.png`
    - Share expanded: `verification/margin-leak-share-expanded.png`
    - Visual/route report: `verification/margin-leak-visual-report.json`
- Latest second Trade Notes browser-comment fix:
  - Fixed `/blog` feature-card image clipping by switching article preview media from cover-cropped to contained artwork.
  - Reworked the margin waterfall section so mobile readers see scroll-linked leak cards first instead of a wide chart; the SVG waterfall is now desktop-only with a richer active-leak summary panel.
  - Replaced the generic static-figure caption with shipment-control-specific copy.
  - Replaced the final takeaway headline with a shorter operator checklist: quote clock, free time, deglazed weight, remedy reserve, and tenor.
  - Verification:
    - `pnpm exec eslint src/components/blog/MarginLeakVisuals.tsx src/pages/Blog.tsx` passes.
    - `pnpm build` passes; Vite still reports the existing large chunk warning.
    - Playwright verified `/blog` article image `object-fit: contain`, article desktop chart visible, mobile chart hidden, updated caption/takeaway text, no framework overlay, no non-Router console warnings, and no horizontal overflow at 390/599/768/1366 px.
  - Latest evidence:
    - Blog index image fit: `verification/comment-fix-blog-index-desktop.png`
    - Desktop waterfall: `verification/comment-fix-waterfall-desktop.png`
    - Mobile waterfall cards: `verification/comment-fix-waterfall-mobile.png`
    - Caption fix: `verification/comment-fix-caption-mobile.png`
    - Takeaway fix: `verification/comment-fix-takeaway-desktop.png`
    - Check report: `verification/comment-fix-report.json`
- Latest article-view correction after user note:
  - Kept the work scoped to `/Users/shubhranshujha/Codex/the-ubik-landing-second-blog`; the original dirty `main` checkout was not edited.
  - Added a mobile-only sticky leak meter inside the article waterfall section so scrollama updates the active leak, bps, remaining margin, and control as readers move through the cards.
  - Confirmed the wide SVG waterfall is hidden on mobile and remains visible only for the desktop sticky chart.
  - Tightened the operating takeaway to: `Price the file with five live controls: quote clock, free time, deglazed weight, remedy reserve, and tenor.`
  - Verification:
    - `pnpm exec eslint src/components/blog/MarginLeakVisuals.tsx src/pages/Blog.tsx` passes.
    - `pnpm build` passes; Vite still reports the existing large chunk warning.
    - Playwright verified the article route has no old placeholder caption, no old LinkedIn-ish takeaway, no document overflow at 599/1366 px, mobile waterfall SVG has zero visible layout footprint, and the new takeaway is present.
  - Latest evidence:
    - Mobile article top: `verification/article-waterfall-mobile-after-user-note.png`
    - Mobile article mid-scroll: `verification/article-mid-mobile-after-user-note.png`
    - Desktop waterfall after article-view correction: `verification/article-waterfall-desktop-after-user-note.png`
- Latest AI monitor-layer Trade Notes pass:
  - Pulled local `main` to latest `origin/main` with `git pull --rebase --autostash origin main`; the existing local Origin Roulette duty-stack/source-card edits and untracked LinkedIn carousel artifacts were preserved.
  - Added `/blog/ai-monitor-layer-seafood-trade` as the third real Trade Notes article, based on `/Users/shubhranshujha/Downloads/blog - why AI needs a monitor layer`.
  - Canonical article metrics use `LLM_AB_Comparison_Data.xlsx`: 662 matched rows, 635 primary-path resolved, 486 web-path resolved, 309 agreements, 167 disagreements, 95.9% vs 73.4% resolution, and 64.9% agreement.
  - Added `src/lib/blog/ai-monitor-layer.ts` and `src/components/blog/AiMonitorLayerVisuals.tsx`; the article uses EvilCharts/Recharts for the benchmark comparison, GSAP for the click/swipe monitor deck, provider favicons, green/amber/red routing, and LMArena/Hugging Face as model-leaderboard context rather than live governance.
  - Installed `recharts` and the shadcn-compatible EvilCharts bar-chart registry component. The generated EvilCharts code was adjusted for React 18 context provider compatibility.
  - Added light/dark article assets under `public/blog/ai-monitor-layer/`; missing theme companions were generated through the imagegen CLI with `OPENAI_API_KEY` checked only as set/unset. The raw key was never printed or written.
  - Updated `src/lib/blog/index.ts`, `src/pages/Blog.tsx`, `src/components/landing/BlogPreview.tsx`, `public/sitemap.xml`, and `public/llms.txt` for the new article and featured preview.
  - Visual requirements:
    - Layout: preserve Ubik article chrome, sticky desktop share panel, `/blog` card rhythm, and contained preview art.
    - Spacing: chart and deck panels must stay inside article width; no document-level mobile overflow.
    - Typography: use the established heading/body/mono editorial rhythm; avoid raw report-graphic styling in body sections.
    - Color: tokenized Ubik UI plus light/dark image variants; provider logos use favicon chips with text fallback.
    - Interactions: EvilCharts legend/bar selection, GSAP deck step transitions, click next/previous, swipe left/right on touch, reduced-motion-safe content.
    - Responsive behavior: 390px mobile should render single-column cards with no horizontal overflow.
  - Verification:
    - `pnpm lint` passes with existing Fast Refresh warnings from EvilCharts generated helper exports.
    - `pnpm build` passes; Vite still reports the large chunk warning.
    - `git diff --check` passes.
    - Secret scan for `OPENAI_API_KEY`, `sk-...`, project keys, and bearer tokens found no API secret values; hits were false positives such as CSS `mask-image` and docs text.
    - Playwright verified `/blog` and `/blog/ai-monitor-layer-seafood-trade`, deck next interaction, light/dark screenshots, canonical URL, `og:type=article`, JSON-LD, and no horizontal overflow at 390/1366 px.
  - Latest evidence:
    - Blog index desktop light: `verification/ai-monitor-blog-index-desktop-light.png`
    - Article desktop light: `verification/ai-monitor-article-desktop-light.png`
    - Deck next desktop light: `verification/ai-monitor-deck-next-desktop-light.png`
    - Article desktop dark: `verification/ai-monitor-article-desktop-dark.png`
    - Article mobile light: `verification/ai-monitor-article-mobile-light.png`
    - Article mobile dark: `verification/ai-monitor-article-mobile-dark.png`
    - Visual/route report: `verification/ai-monitor-visual-report.json`
- Latest AI monitor-layer browser-comment fix:
  - Addressed the browser annotations on `/blog/ai-monitor-layer-seafood-trade`.
  - Hero and blog-list images now fill their media frames with fixed aspect containers instead of rendering as contained artwork with visible side padding.
  - Mobile monitor deck hides the step list and keeps the single click/swipe card, reducing duplicate content and mobile page weight.
  - Removed the research-confidence benchmark section, green/amber/red routing card section, and source/limitation note section from the article.
  - Replaced the generic leaderboard placeholder block with an EvilCharts Arena snapshot section dated May 26, pointing to `https://arena.ai/leaderboard/` and using a custom seafood trade-ops score across frontier models.
  - Removed Hugging Face and LMArena from the provider favicon chip list; chips now represent LLM providers only.
  - Strengthened the final takeaway around Ubik's forward-deployed trade expertise, model routing, and AI transformation value without naming it as a direct MBB/Palantir clone.
  - Verification:
    - `pnpm lint` passes with existing Fast Refresh warnings from EvilCharts generated helper exports.
    - `pnpm build` passes; Vite still reports the large chunk warning.
    - `git diff --check` passes.
    - Playwright verified the old benchmark/routing/limitation/model-ops text is absent, Arena link is present, non-LLM chips are absent, desktop hero and blog-list images fill their containers, mobile deck step buttons are hidden, and no horizontal overflow exists at 390/740/1181 px.
  - Latest evidence:
    - Article desktop light: `verification/ai-monitor-comments-article-desktop-light.png`
    - Blog index desktop light: `verification/ai-monitor-comments-blog-index-desktop-light.png`
    - Article tablet light: `verification/ai-monitor-comments-article-tablet-light.png`
    - Article mobile light: `verification/ai-monitor-comments-article-mobile-light.png`
    - Visual/comment report: `verification/ai-monitor-comments-visual-report.json`
- Latest AI monitor-layer final annotation fix:
  - Replaced the article intro metric cards with broader AI adoption pressure metrics: 12 major models in one March 2026 week, 600x token-price decline since 2020, and 95% enterprise gen-AI pilots with no P&L impact.
  - Simplified the EvilCharts Arena snapshot into a single visible horizontal trade-ops fit series with an inline `Snapshot as of May 26` callout and less empty chart space.
  - Replaced the final takeaway sparkle icon with a Ubik blue square marker.
  - Reworked the final takeaway body from one long paragraph into three operator tiles: route the model, deploy the operator layer, lower the transformation cost.
  - Verified the share panel links use the article canonical URL for X, WhatsApp, LinkedIn, and email.
  - Verification:
    - `pnpm lint` passes with existing Fast Refresh warnings from EvilCharts generated helper exports.
    - `pnpm build` passes; Vite still reports the large chunk warning.
    - `git diff --check` passes.
    - Playwright verified the new metric copy is present, old workbook stat-card labels are absent, the May 26 chart callout is present, visible chart bars render, final tiles render, share links point to `https://theubik.com/blog/ai-monitor-layer-seafood-trade`, and no horizontal overflow exists at 390/740 px.
  - Latest evidence:
    - Tablet article final comments: `verification/ai-monitor-final-comments-tablet-light.png`
    - Mobile article final comments: `verification/ai-monitor-final-comments-mobile-light.png`
    - Final comments report: `verification/ai-monitor-final-comments-report.json`
- Latest AI monitor-layer tabs and source strip fix:
  - Added four workflow-specific tabs to the Arena snapshot: supplier intel, evidence review, workflow routing, and cost control.
  - Each tab swaps the EvilCharts score series and the explanatory use-case callout so readers can see model performance variance by Ubik-specific task instead of one generic score.
  - Added a bottom `Sources` strip with favicon links for Arena, arXiv, McKinsey, and MIT coverage. Each source opens externally and shows a simple hover/focus preview card with an image, title, and note.
  - Verification:
    - `pnpm lint` passes with existing Fast Refresh warnings from EvilCharts generated helper exports.
    - `pnpm build` passes; Vite still reports the large chunk warning.
    - `git diff --check` passes.
    - Playwright verified four tabs, tab switching updates the selected state and explanation, chart bars remain visible, four source links and four hover cards render, source cards have images, and no horizontal overflow exists at 390/740 px.
  - Latest evidence:
    - Tabs and sources tablet: `verification/ai-monitor-tabs-sources-tablet.png`
    - Source hover tablet: `verification/ai-monitor-sources-hover-tablet.png`
    - Tabs and sources mobile: `verification/ai-monitor-tabs-sources-mobile.png`
    - Tabs/source report: `verification/ai-monitor-tabs-sources-report.json`

## Next notes

- Latest docs copy and component literacy pass:
  - Scope stayed in `docs/`; existing non-doc work in the dirty checkout was left untouched.
  - Reframed the Mintlify guide around executive-operational trade decisions: risk, evidence, owner, approval authority, customer promise, margin exposure, source context, and review trail.
  - Updated landing, getting-started, feature workflow, admin/security, FAQ, and coming-soon docs pages with stronger operator guidance.
  - Reduced forced all-caps treatment in `docs/style.css`; compact mono labels remain, but step labels, prompt row labels, and status/handoff chips now read in natural title/sentence case.
  - Added more Mintlify-native variety where useful: `CardGroup`, `Card`, and `Accordion` for operating principles, approval guidance, and review paths.
  - Visual requirements:
    - Layout: docs pages should keep Mintlify navigation, with Features showing pages directly and no `Surfaces` regression.
    - Spacing: prompt tables and cards must stack cleanly on mobile without horizontal scroll.
    - Typography: remove shouty all-caps blocks while preserving small product/status labels.
    - Color: preserve existing Ubik blue/mono docs system.
    - Interactions: Ask Ubik tabs remain usable and mobile optimized.
    - Responsive behavior: 390px mobile and 1440px desktop docs pages should have no horizontal overflow.
  - Verification:
    - `mintlify validate` passes.
    - `mintlify broken-links` passes.
    - `pnpm build` passes; Vite still reports the existing large chunk warning.
    - Browser DOM check on `http://localhost:3000/` confirmed real docs content and no visible `Surfaces`.
    - Playwright verified docs landing, Ask Ubik, Inbox, and Workspace basics at 1440px desktop and 390px mobile with no horizontal overflow, no visible `Surfaces`, and no broad all-caps blocks.
  - Latest evidence:
    - Docs landing desktop: `verification/docs-literacy-index-desktop.png`
    - Docs landing mobile: `verification/docs-literacy-index-mobile.png`
    - Ask Ubik desktop: `verification/docs-literacy-ask-desktop.png`
    - Ask Ubik mobile: `verification/docs-literacy-ask-mobile.png`
    - Inbox desktop: `verification/docs-literacy-inbox-desktop.png`
    - Inbox mobile: `verification/docs-literacy-inbox-mobile.png`
    - Workspace basics desktop: `verification/docs-literacy-workspace-desktop.png`
    - Workspace basics mobile: `verification/docs-literacy-workspace-mobile.png`

- Latest AI monitor-layer image/model refresh:
  - Updated `/blog/ai-monitor-layer-seafood-trade` after browser comment on the Arena snapshot and image set.
  - Replaced all AI monitor article image pairs from `/Users/shubhranshujha/Downloads/blog - why AI needs a monitor layer/ubik-ai-monitor-headerB-1B-2B-3B-upscaled/`:
    - `header-global-evidence-constellation-*` -> `public/blog/ai-monitor-layer/header-*`.
    - `country-signal-proof-matrix-*` -> `public/blog/ai-monitor-layer/reasoning-leakage-*`.
    - `corridor-workflow-matrix-*` -> `public/blog/ai-monitor-layer/routing-friction-*`.
    - `strategic-layer-stack-*` -> `public/blog/ai-monitor-layer/fragmented-truth-*`.
  - Updated the Arena snapshot to May 29, 2026 and refreshed model labels from public Arena signals: Opus 4.7 Thinking, Gemini 3.1 Pro, GPT-5.5 High, Grok 4.20, and Sonnet 4.6.
  - Follow-up browser comment fix: mobile leaderboard use cases now behave like stacked sections; tapping a section renders its benchmark chart and top-model cards directly underneath that section instead of below the whole group.
  - Changed article, blog index, and homepage blog-preview media from cover-cropped to contained artwork so supplied images are not clipped.
  - Visual requirements:
    - Layout: keep the existing Trade Notes article chrome and leaderboard section, but ensure new image pairs render as complete diagrams.
    - Spacing: image frames may letterbox, but must not crop diagram labels or edge content.
    - Typography: preserve the existing article heading/body/mono style; chart model labels must stay readable on mobile.
    - Color: use matching light/dark image pairs through the existing theme class behavior.
    - Interactions: Arena tabs and monitor deck stay functional; source hover previews use contained images.
    - Responsive behavior: 599px mobile and 1440px desktop screenshots should show contained images and no obvious chart clipping.
  - Verification:
    - `pnpm build` passes; Vite still reports the existing large chunk warning.
    - Before evidence: `verification/ai-monitor-before-mobile.png`, `verification/ai-monitor-before-desktop.png`.
    - After evidence: `verification/ai-monitor-after-mobile-light.png`, `verification/ai-monitor-after-desktop-light.png`, `verification/ai-monitor-after-mobile-dark.png`, `verification/ai-monitor-after-desktop-dark.png`.
    - Follow-up mobile leaderboard evidence: `verification/ai-monitor-leaderboard-mobile-accordion-default.png`, `verification/ai-monitor-leaderboard-mobile-accordion-workflow.png`, `verification/ai-monitor-leaderboard-mobile-accordion-cost.png`.

- Latest site-wide typography parity and brand dossier pass:
  - Scope covered the public React site, not the separate Mintlify docs deployment.
  - Strengthened shared muted/readable text behavior across theme tokens, cards, tabs, badges, accordions, dialogs, sheets, route pages, landing sections, and blog visual components.
  - Fixed the annotated homepage dark-mode surfaces: integration-grid labels under icons now render as semibold high-contrast mono labels, and the blue CTA panel now uses black primary CTA with white text plus a white secondary CTA with black text.
  - Updated public metadata/title separators away from em dashes on routed page SEO titles and aligned security/pricing/landing category language to frozen food.
  - Added `BRAND_UI_CREATIVE_SYSTEM.md` as the root creative direction, UI, content, SEO, and future-regression reference for the entire public site.
  - Visual requirements:
    - Layout: preserve existing square grid, border, matrix, and component grammar across all pages.
    - Spacing: do not introduce horizontal overflow or clipped CTA text on mobile.
    - Typography: readable copy uses foreground tints, mono labels stay intentional, and legal/editorial dense text remains scannable.
    - Color: dark-mode text should not collapse into grey on neutral, card, or blue surfaces.
    - Interactions: shared buttons, tabs, accordions, mobile sheet, and footer/header chrome preserve clear hierarchy.
    - Responsive behavior: 599px captures for all public routes should show no horizontal overflow.
  - Verification:
    - `pnpm build` passes; Vite still reports the existing large chunk warning.
    - `pnpm lint` passes with existing Fast Refresh warnings from EvilCharts generated helper exports.
    - Playwright checked `/`, `/pricing`, `/how-it-works`, `/try`, `/security`, `/blog`, `/blog/ai-monitor-layer-seafood-trade`, `/download`, `/privacy-policy`, and `/terms-of-service` in light and dark at 599px with no horizontal overflow.
  - Latest evidence:
    - Route screenshots directory: `verification/typography-parity-2026-05-31/`
    - Annotated tools-grid fix: `verification/typography-parity-2026-05-31/dark-home-tools-grid-target.png`
    - Annotated CTA fix: `verification/typography-parity-2026-05-31/dark-home-cta-target.png`

- Final legal review remains needed for the privacy/terms draft before relying on it in production.
- If final logo filenames change, update only `src/lib/brand.ts`.
- Browser plugin DOM verification and Playwright screenshot capture were used for the final comment pass.

- Latest download build selector and Loops newsletter pass:
  - Pulled `origin/main` with `git pull --ff-only origin main`; repo was already up to date.
  - No commit, push, PR, main merge, or Netlify deploy was performed. Keep this local until explicit approval because Netlify credits are constrained.
  - `/download?os=windows` now presents explicit desktop build cards for `Windows`, `Mac (M-series)`, and `Mac (Intel)` instead of burying the alternatives in a compact selector.
  - Copy guidance: M-series means Apple silicon/ARM64 and is recommended for Macs with M1/M2/M3/M4/newer chips; Intel maps to older Intel/x64 Macs. Avoided a strict 2021+ rule because Apple silicon began in late 2020 and Apple sold overlapping Intel models.
  - Kept the existing mobile/tablet installer guard: 390px mobile shows no direct DMG/EXE anchors and asks users to reopen on a Mac or Windows desktop.
  - Added `netlify/functions/newsletter-subscribe.js`, a server-side Loops subscribe endpoint using `PUT https://app.loops.so/api/v1/contacts/update` so the API key is never exposed client-side.
  - Newsletter endpoint requires `LOOPS_API_KEY`; optional `LOOPS_NEWSLETTER_LIST_ID` maps the contact into the configured Loops mailing list/category via `mailingLists: { [id]: true }`.
  - Added a download-page newsletter form with privacy copy linking to `/legal/privacy`; added `README.md` env notes for future deployment.
  - Latest Loops docs checked on June 16, 2026: API keys must stay server-side; update contact is update-or-create; mailing lists are keyed boolean objects; CLI is available/beta but not needed for runtime website signup.
  - Validation:
    - `pnpm lint` passes with existing Fast Refresh warnings in `src/components/evilcharts/**`.
    - `pnpm build` passes; Vite still reports existing large chunk warnings.
    - `git diff --check` passes.
    - Node unit check mocked Loops fetch and confirmed lowercased email, `source: theubik.com/download`, `userGroup: Newsletter`, and configured mailing-list payload.
    - In-app Browser verified `http://localhost:5173/download?os=windows` page identity, nonblank content, no framework overlay, Windows selected, and installer hrefs for arm64 DMG, x64 DMG, and Windows EXE.
    - In-app Browser desktop light/dark sanity confirmed theme toggle changes root class to `dark` and computed dark colors.
    - In-app Browser mobile 390px confirmed no horizontal overflow (`documentScrollWidth=375`, `bodyScrollWidth=375`) and zero installer anchors.
    - In-app Browser newsletter invalid-email state confirmed custom in-page error, `aria-invalid=true`, `novalidate`, and Privacy Notice link.
  - Visual requirements:
    - Layout: three desktop build choices should be visible above the fold and Windows should be selected on `?os=windows`.
    - Spacing: build cards and newsletter form must not overflow desktop or 390px mobile.
    - Typography: use nontechnical labels (`Mac (M-series)`, `Mac (Intel)`) with concise helper copy.
    - Color: build cards and newsletter form must be legible in light and dark mode.
    - Interactions: clicking a build card starts that installer download; newsletter form validates email before submitting.
    - Responsive behavior: desktop shows installers; mobile preserves no-installer guard.
  - Before evidence:
    - User screenshot: `/var/folders/yz/jgm0w7r158s1lth5ylp9rhvh0000gn/T/codex-clipboard-3d27ea9d-f29f-42c5-99a7-91e9b21fb98f.png`
    - Prior production Windows evidence: `verification/prod-download-windows-desktop.png`, `verification/prod-download-windows-mobile.png`
  - After evidence:
    - `verification/download-build-newsletter-after-desktop-light.png`
    - `verification/download-build-newsletter-after-desktop-dark.png`
    - `verification/download-build-newsletter-after-mobile-windows.png`
    - `verification/download-newsletter-invalid-email-state.png`

- Latest browser-comment follow-up on download proof cards and Trade Notes signup:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Moved the subscribe UI off `/download`; the Meetings page no longer renders a newsletter/Trade Notes form.
  - Added reusable Trade Notes signup UI to `/blog` and every article page through `ArticleShell`.
  - Updated the Loops function payload language from generic Newsletter/download to `userGroup: Trade Notes`; it accepts a blog/article `source` from the client and still reads `LOOPS_API_KEY` only server-side from `process.env`.
  - README env note now calls the signup Trade Notes and keeps `LOOPS_API_KEY` explicitly server-side/non-`VITE_`.
  - Local behavior note: plain Vite `pnpm dev` does not run Netlify Functions, so dropping an email into localhost will not create a real Loops contact unless running through `netlify dev` with `LOOPS_API_KEY` and optional `LOOPS_NEWSLETTER_LIST_ID` configured. Production Netlify will add contacts once those env vars are set.
  - Reworked the Meetings proof-card surfaces for light/dark mode with calmer card backgrounds and less blue-heavy dark surfaces.
  - Replaced mock participant names (`Gina Huels`, `Todd Cremin`, etc.) with app-like roster rows using favicons for Google Meet, Zoom, Microsoft Teams, and Webex while preserving `No bot detected`.
  - Validation:
    - `pnpm lint` passes with existing Fast Refresh warnings in `src/components/evilcharts/**`.
    - `pnpm build` passes; Vite still reports existing large chunk warnings.
    - Mocked Netlify Function confirmed `PUT https://app.loops.so/api/v1/contacts/update`, lowercased email, `source: theubik.com/blog/field-note`, `userGroup: Trade Notes`, and `mailingLists: { list_123: true }`.
    - In-app Browser DOM checks stayed usable, but Browser screenshot capture timed out twice on `Page.captureScreenshot`; Playwright was used for screenshot evidence.
    - Playwright verified `/download?os=windows` has no newsletter form, no old mock names, app-logo roster rows, `No bot detected`, and no 1280px overflow.
    - Playwright verified `/blog` has the Trade Notes form, privacy copy, `/legal/privacy` link, and no 1280px overflow.
    - Playwright verified `/blog/ai-monitor-layer-seafood-trade` has one Trade Notes form with article-specific email input id and no 1280px overflow.
    - Playwright verified `/blog` at 390px has the Trade Notes form and no horizontal overflow.
    - Known local console noise remains: React Router future-flag warnings, local S3 manifest CORS fallback errors on `/download`, and existing chart zero-size warnings on the AI monitor article.
  - Latest evidence:
    - `verification/download-proof-cards-after-light.png`
    - `verification/download-proof-cards-after-dark.png`
    - `verification/blog-trade-notes-newsletter-index.png`
    - `verification/blog-trade-notes-newsletter-article.png`
    - `verification/blog-trade-notes-newsletter-mobile.png`

- Latest pre-read icon and Trade Notes privacy-copy follow-up:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Replaced the `SparkleIcon` in the `/download` pre-read preview with the product AI mark pattern: a small blue square dot.
  - Updated the Trade Notes consent copy on `/blog` and every article page to state the actual email use: Trade Notes and product-relevant operator updates.
  - Consent copy now links to both Ubik Privacy Notice (`/legal/privacy`) and Loops email platform privacy policy (`https://loops.so/privacy`, external tab).
  - Validation:
    - `pnpm lint` passes with existing Fast Refresh warnings in `src/components/evilcharts/**`.
    - `pnpm build` passes; Vite still reports existing large chunk warnings.
    - Playwright verified `/download?os=windows` still has no 1280px horizontal overflow and the pre-read preview remains present.
    - Playwright verified `/blog` renders the intent copy, Ubik privacy link, Loops privacy link, external target, and no 1280px horizontal overflow.
  - Latest evidence:
    - `verification/download-pre-read-square-ai-icon.png`
    - `verification/blog-trade-notes-privacy-links.png`

- Latest Ubik quality pass: trade memory, case-study proof, and Trade Notes category structure:
  - No commit, push, PR, main merge, or Netlify deploy was performed. OpenSEO and Remotion remain explicitly deferred.
  - Homepage narrative now leads with `Own your trade memory.` and explains that inboxes, documents, meetings, ERP, CRM, and market signals become reviewed decisions the team can find, approve, and reuse.
  - Homepage SEO, root HTML metadata, JSON-LD description, and `public/llms.txt` were aligned to the same trade-memory language.
  - Added a minimal horizontal Seafood RFQ case-study rail with one visible step at a time, touch/trackpad scroll, keyboard controls, reduced-motion handling, and authored fragments for connected apps, recommendation, PO fields, approval, and outcome.
  - The case-study proof is limited to the existing approved `5-7 days -> 6 hours` RFQ-to-quote outcome; no new customer or metric claims were introduced.
  - Added Hemanth founder statement with local asset `public/founders/hemanth.png`; wording is visibly marked draft/pending approval.
  - Added Trade Notes category metadata and shareable filters for Seafood, Agri, Dairy, and Poultry via `/blog?category=<slug>`. Seafood derives from current published posts; Agri, Dairy, and Poultry show useful empty states and are not presented as current proof.
  - Visual direction follows the supplied inbox prototype: hairline surfaces, one primary product artifact, mono evidence labels, and compact signal treatment.
  - The hero's former frozen-food-only badge is now a compact, polite ticker: `Seafood`, `Grains`, `Oils`, `Dairy`, and `Poultry` rotate under `Built for perishable trade`, keeping the broader direction legible without adding a homepage category grid.
  - Validation:
    - `pnpm build` passes; Vite still reports the existing large-chunk warning.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright desktop homepage confirms title `Ubik | Own your trade memory`, hero copy, case-study step content, and no horizontal overflow.
    - Playwright 390px homepage confirms no horizontal overflow (`scrollWidth=390` or narrower depending on browser chrome).
    - Playwright confirms the next case-study control advances to the recommendation step and the outcome step is present.
    - Playwright confirms `/blog?category=agri` renders the unpublished-category empty state with no overflow.
    - Playwright 390px verification confirms the perishable category ticker changes over time and remains within the viewport (`overflow=false`).
  - Visual evidence:
    - Before homepage desktop: `verification/final-home-desktop.png`
    - Before homepage mobile: `verification/final-home-mobile.png`
    - After homepage desktop: `output/playwright/quality-home-desktop.png`
    - After homepage mobile: `output/playwright/quality-home-mobile-390-final.png`
    - After case-study initial state: `output/playwright/quality-case-study-mobile-final.png`
    - After case-study next-step interaction: `output/playwright/quality-case-study-mobile-final-next.png`
    - After Trade Notes Agri empty state: `output/playwright/quality-tradenotes-agri.png`
    - After perishable-category ticker on mobile: `output/playwright/quality-home-category-mobile.png`
  - Local review URL: `http://127.0.0.1:5173/`
  - Review routes: `/`, `/blog`, `/blog?category=seafood`, `/blog?category=agri`, `/blog?category=dairy`, `/blog?category=poultry`.
  - Remaining human approval: Hemanth must approve or revise the founder statement before publication; category placeholder content should remain unpublished until real notes exist.

- Latest browser-comment follow-up: homepage swarm background and How It Works cleanup:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Browser comments came from the live local homepage at `http://127.0.0.1:5173/` and targeted the proof-stat band plus the homepage How It Works rail.
  - Removed the selected left-side detail block from `RailStepPanel`, including the `Accounting acknowledges. Audit-logged.` heading and compact chips such as `COMMITTED AUDIT` / `5H 08M TOTAL`; the active rail now centers the evidence artifact by itself.
  - Expanded the How It Works heading to use the full desktop container width with larger desktop type.
  - Replaced the previous square-grid/dot-matrix background behavior in `MatrixField` with a Motion React cold-swarm field using `motion/react`, `useMotionValue`, `useSpring`, `useTransform`, pointer events, and `useReducedMotion`.
  - The swarm responds to cursor movement and touch/pointer input without React state updates for pointer coordinates; reduced-motion users get a calmer static version.
  - Reworked the proof-stat strip from flat grey cards into a dark kinetic band with the new interactive swarm, stronger contrast, scan-line affordances, and hover motion.
  - Motion docs/patterns were reviewed in a spawned read-only subagent before final validation; guidance used: keep `motion/react`, use Motion Values + springs, pointer events for touch/mobile, and avoid React state for high-frequency cursor tracking.
  - Validation:
    - `pnpm build` passes; Vite still reports existing large-chunk warnings.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright desktop check confirms no horizontal overflow at 1505px, How It Works heading width is 1344px, the selected audit text/chips are gone, and the final `14:22 Audit-logged` tab still renders its centered evidence artifact.
    - Playwright mobile check confirms no horizontal overflow at 390px and the removed audit text remains absent.
  - Visual evidence:
    - Before evidence: user-attached browser-comment screenshots in the current Codex task for comments 1, 2, and 3.
    - After hero/swarm desktop: `output/playwright/homepage-motion-swarm-after-desktop.png`
    - After hero/swarm mobile: `output/playwright/homepage-motion-swarm-after-mobile.png`
    - After proof-stat swarm band: `output/playwright/homepage-proof-swarm-after-desktop.png`
    - After How It Works default rail: `output/playwright/homepage-how-rail-annotations-after-desktop.png`
    - After How It Works final audit tab: `output/playwright/homepage-how-rail-audit-after-desktop.png`
    - After How It Works mobile: `output/playwright/homepage-how-rail-annotations-after-mobile.png`
  - Local review URL remains `http://127.0.0.1:5173/`.

- Latest browser-comment follow-up: square swarm, comparison ticker, logo/founder continuity:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Browser feedback came from screenshot `codex-clipboard-4b850771-59aa-4c05-8664-1593a9caddac.png` and targeted the compare/FAQ transition, circular swarm dots, company ticker strip, and founder bio.
  - Changed the Motion swarm nodes back to the Ubik square-dot mark by removing circular rounding from `.matrix-dot` while preserving cursor/touch interaction.
  - Removed the standalone `Different category` compare label and removed the same phrase from the FAQ answer content so it does not reappear when the accordion opens.
  - Replaced the right-side comparison blurb with a live model-routing ticker using favicon-backed examples: Claude for financial exposure, ChatGPT for execution planning, Gemini for multimodal document review, and Perplexity for market context.
  - Unified the compare, FAQ, company ticker, and founder sections with the same ambient background treatment to reduce abrupt section-color breaks.
  - Flattened the company logo ticker by removing tile backgrounds, strengthening label contrast, and keeping hover as a subtle blue underline/background shift.
  - Expanded the founder section into a longer writeup with inline company-logo chips inside the paragraph plus three compact proof cards. Founder copy remains marked `draft / pending approval`.
  - Validation:
    - `pnpm build` passes; Vite still reports existing large-chunk warnings.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright confirms desktop and 390px mobile have no horizontal overflow.
    - Playwright confirms `.matrix-dot` has `border-radius: 0px`, compare text does not include `Different category`, opening the FAQ still does not reveal `Different category`, logo ticker items are transparent, and the founder paragraph renders five inline logo chips.
  - Visual evidence:
    - After square swarm hero: `output/playwright/homepage-square-swarm-after-desktop.png`
    - After compare/FAQ continuity desktop: `output/playwright/homepage-compare-faq-continuity-after-desktop.png`
    - After compare/FAQ continuity mobile: `output/playwright/homepage-compare-faq-continuity-after-mobile.png`
    - After logo/founder desktop: `output/playwright/homepage-founder-logos-after-desktop.png`
    - After logo/founder mobile: `output/playwright/homepage-founder-logos-after-mobile.png`
  - Local review URL remains `http://127.0.0.1:5173/`.

- Latest browser-comment follow-up: denser rail console, founder cleanup, IP roadmap:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Browser comments targeted the homepage How It Works rail, model-router card, founder block, and Trade Notes preview.
  - Replaced the sparse centered rail artifact with a three-column `rail-console`: task overview, live artifact with bar simulation/metrics, and decision path. This uses the existing tabbed rail interaction but removes much of the empty middle whitespace.
  - Converted the model-router area from a vertical ticker into a static orchestration rail in the original Ubik style: blue square Ubik orchestrator first, then ChatGPT for packaging tracker update, Claude for compliance/verification, Gemini for document/image inspection, and Perplexity for market refresh.
  - Founder section cleanup:
    - Replaced `builder · operator layer` under the photo with `Hemanth Rao`.
    - Removed the founder/draft/pending-approval caption entirely.
    - Removed the three extra cards (`operator context`, `systems taste`, `human review`).
    - Replaced the founder paragraph with the supplied two-decade regulated supply chain, $450M+ P&L, $1B+ scale-up, 2 AM container-decision positioning while keeping inline company-logo accents.
    - Founder photo stays grayscale by default and changes to color on hover.
  - Made Trade Notes preview compact and added a horizontal `Current innovation roadmap` section covering memory graph, trade ontology, agent programs, and decision layer.
  - Validation:
    - `pnpm build` passes; Vite still reports existing large-chunk warnings.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright confirms no horizontal overflow at 1505px desktop and 390px mobile.
    - Playwright confirms rail console is present, founder bad labels are absent, `Hemanth Rao` is present, supplied founder copy is present, founder photo hover computes to `grayscale(0)`, roadmap renders four cards, and the compact Trade Notes card is present.
  - Visual evidence:
    - After How It Works rail console desktop: `output/playwright/homepage-how-rail-console-after-desktop.png`
    - After How It Works rail console mobile: `output/playwright/homepage-how-rail-console-after-mobile.png`
    - After model-router rail desktop: `output/playwright/homepage-model-router-after-desktop.png`
    - After founder cleanup and photo hover desktop: `output/playwright/homepage-founder-copy-hover-after-desktop.png`
    - After roadmap + compact Trade Notes desktop: `output/playwright/homepage-roadmap-tradenotes-after-desktop.png`
    - After roadmap + compact Trade Notes mobile: `output/playwright/homepage-roadmap-tradenotes-after-mobile.png`
  - Local review URL remains `http://127.0.0.1:5173/`.

- Latest browser-comment follow-up: rail cleanup, case-study heading, CTA outline:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Browser comments targeted the homepage How It Works rail, case-study heading/subheading, and final blue CTA card.
  - Adjusted the How It Works `Sent to ERP` step so it no longer forces the generic decision-path graph. That step now uses a two-column layout with the existing task overview plus a conversation-style artifact showing Email, WhatsApp, and Ubik agent updates in one inbox-like panel.
  - Reduced heavy/bold visual treatment in the rail chips, decision rows, and metrics so the rail feels closer to the calmer Ubik card language.
  - Removed the case-study right-side subheading line beginning `A real operating trace...`.
  - Expanded the case-study title width to use the freed horizontal space.
  - Changed the final blue CTA card primary `Try Ubik Now` button from black fill to transparent fill with white border and white text.
  - Validation:
    - `pnpm build` passes; Vite still reports existing large-chunk warnings.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright confirms no horizontal overflow at 1505px desktop and 390px mobile.
    - Playwright confirms the case-study subheading is absent, case-study title width is 1056px at desktop, the ERP rail conversation artifact is present, the forced decision-path graph is absent for the ERP step, and the CTA button computes to transparent background with white text/border.
  - Visual evidence:
    - After ERP conversation rail desktop: `output/playwright/homepage-how-rail-conversation-after-desktop.png`
    - After case-study title desktop: `output/playwright/homepage-case-study-title-after-desktop.png`
    - After case-study title mobile: `output/playwright/homepage-case-study-title-after-mobile.png`
    - After CTA outline desktop: `output/playwright/homepage-cta-outline-after-desktop.png`
  - Local review URL remains `http://127.0.0.1:5173/`.

- Latest browser-comment follow-up: Trade Notes and roadmap stacking:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Browser comment targeted `section#blog` and asked for the Trade Notes card and roadmap to appear one by one instead of side by side, remove the `Browse notes` subheader/link, and shorten the roadmap title.
  - Changed `BlogPreview` so the Trade Notes card and innovation roadmap now stack vertically on desktop and mobile.
  - Removed the right-side `Browse notes` link from the roadmap header.
  - Shortened `Technical IP under the operator layer.` to `This month’s build.` while retaining the smaller `Current innovation roadmap` eyebrow.
  - Validation:
    - `pnpm build` passes; Vite still reports existing large-chunk warnings.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright confirms `This month’s build.` is present, the old long title is absent, `Browse notes` is absent, the Trade Notes card stacks above the roadmap with a 32px desktop gap, and there is no horizontal overflow at 1505px desktop or 390px mobile.
  - Visual evidence:
    - Before evidence: user-attached browser-comment screenshot for the `section#blog` comment in the current Codex task.
    - After stacked Trade Notes/roadmap desktop: `output/playwright/homepage-blog-roadmap-stacked-after-desktop.png`
    - After stacked Trade Notes/roadmap mobile: `output/playwright/homepage-blog-roadmap-stacked-after-mobile.png`
  - Local review URL remains `http://127.0.0.1:5173/`.

- Latest browser-comment follow-up: remove repeated How It Works decision paths:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Browser comment targeted `section#how` and called out that the same decision-path graph was repeating across steps despite prior feedback.
  - Replaced the shared right-side `decision path` panel with step-specific sidecars:
    - `Email arrives`: inbox triage.
    - `Agent reads`: source context.
    - `Margin checked`: guardrail details.
    - `You approve`: approval receipt.
    - `Follow-up queued`: timer logic.
    - `Buyer confirms`: thread sync.
    - `Audit-logged`: audit receipt.
  - Replaced the repeated generic live bar artifact across non-ERP steps with distinct artifacts: inbox rows, memory board, margin guardrail chart, approval card, ERP conversation, follow-up timer, WhatsApp confirmation, and audit receipt.
  - Removed the rail tab crossfade wrapper so active tab content is fully readable immediately after switching.
  - Validation:
    - `pnpm build` passes; Vite still reports existing large-chunk warnings.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright clicked all eight visible desktop tabs and confirmed `decision path`, `read signal`, `join memory`, `check guardrail`, and `prepare action` are absent in every state.
    - Playwright confirmed each tab renders its expected unique label, rail panel opacity is `1`, and there is no horizontal overflow at 1505px desktop or 390px mobile.
  - Visual evidence:
    - Before evidence: user-attached browser-comment screenshot for the `section#how` comment in the current Codex task.
    - After unique email rail desktop: `output/playwright/homepage-how-rail-unique-email-after-desktop.png`
    - After unique margin rail desktop: `output/playwright/homepage-how-rail-unique-margin-after-desktop.png`
    - After unique follow-up rail desktop: `output/playwright/homepage-how-rail-unique-followup-after-desktop.png`
    - After unique audit rail desktop: `output/playwright/homepage-how-rail-unique-audit-after-desktop.png`
    - After unique rail mobile: `output/playwright/homepage-how-rail-unique-mobile-after.png`
  - Local review URL remains `http://127.0.0.1:5173/`.

- Latest browser-comment follow-up: chat rail, smaller Ubik mark, copy reduction:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Browser comments targeted the compare model-router mark, the How It Works rail, and grey helper/subheading copy on the homepage.
  - Replaced the How It Works rail dashboard/task-overview layout with a chat-style thread. Each step now shows short messages from Email, WhatsApp, operator, Ubik, or system sources plus a compact `@ubik` task outcome.
  - Removed the old rail dashboard CSS so task overview, sidecar, chart, and decision-path visual treatments no longer render in the rail.
  - Changed the compare `Ubik orchestrator` mark from a chunky blue tile to a small plain logo-style square.
  - Removed grey helper paragraphs from the homepage hero, security lead, workflow overview, FAQ intro, CTA copy, tools section, and case-study stage body.
  - Validation:
    - `pnpm build` passes; Vite still reports existing large-chunk warnings.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright confirms the rail includes `Email`, `WhatsApp group`, and `@ubik create task`; old rail labels `task overview`, `inbox triage`, and `decision path` are absent.
    - Playwright confirms the compare Ubik mark computes to a small square with no box shadow.
    - Playwright confirms no horizontal overflow at 1780px desktop or 390px mobile.
  - Visual evidence:
    - Before evidence: user-attached browser-comment screenshots for the compare and How It Works comments in the current Codex task.
    - After How chat rail desktop: `output/playwright/homepage-how-chat-rail-after-desktop.png`
    - After How chat rail mobile: `output/playwright/homepage-how-chat-rail-after-mobile.png`
    - After compare Ubik mark desktop: `output/playwright/homepage-compare-ubik-mark-after-desktop.png`
  - Local review URL is running again at `http://127.0.0.1:5173/` via the current dev-server session.

- Latest browser-comment follow-up: restore mixed How It Works rail artifacts:
  - No commit, push, PR, main merge, or Netlify deploy was performed.
  - Scope clarification from user: this pass applies only to the `A whole shipment, one morning, six handoffs` section.
  - Restored variety across that rail:
    - Step 1 remains a chat thread with Email, WhatsApp group, and Operator tagging Ubik.
    - Step 2 is OCR/file read plus value verification.
    - Step 3 is Zoho/pricing-intel/finance table checks plus margin logic.
    - Step 4 is a decision queue with approve/edit controls.
    - Step 5 is a systems queue across Email, Zoho, Tally, and Salesforce.
    - Step 6 is a follow-up timer.
    - Step 7 is a WhatsApp confirmation panel.
    - Step 8 is an evidence trail sent as team email, CEO memo PDF, and client WhatsApp update.
  - Fixed the operator contact tile in the chat step so it renders as a clean `SR` initials square.
  - Fixed the Ubik task/evidence rows so the Ubik logo is a plain blue square on the left with no shadow.
  - Validation:
    - `pnpm build` passes; Vite still reports existing large-chunk warnings.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright clicked all eight visible desktop tabs and confirmed expected labels: `WhatsApp group`, `OCR read`, `pricing tables`, `decision queue`, `Zoho mapped`, `follow-up timer`, `Vinod: looks good`, and `evidence trail`.
    - Playwright confirms the operator tile text is `SR`, the Ubik task squares compute to `16.8px` by `16.8px` with `box-shadow: none`, and there is no horizontal overflow at 1780px desktop or 390px mobile.
  - Visual evidence:
    - Before evidence: user-attached browser-comment screenshots for the operator contact and Ubik task row in the current Codex task.
    - After mixed rail chat desktop: `output/playwright/homepage-how-mixed-chat-after-desktop.png`
    - After mixed rail OCR desktop: `output/playwright/homepage-how-mixed-ocr-after-desktop.png`
    - After mixed rail margin desktop: `output/playwright/homepage-how-mixed-margin-after-desktop.png`
    - After mixed rail decision desktop: `output/playwright/homepage-how-mixed-decision-after-desktop.png`
    - After mixed rail evidence desktop: `output/playwright/homepage-how-mixed-evidence-after-desktop.png`
    - After mixed rail mobile: `output/playwright/homepage-how-mixed-after-mobile.png`
  - Local review URL remains `http://127.0.0.1:5173/`.

- Latest browser-comment follow-up: operator contact and live agent indicator, deployed:
  - Replaced the misaligned `SR` initials glyph in the `Email arrives` chat with a small avatar and a normal `SR Operator` contact line. The Ubik task row remains a plain blue square mark on the left.
  - Replaced the stacked model-router list in `section#compare` with one active routed agent at a time. The active item cycles through Ubik orchestrator, ChatGPT, Claude, Gemini, and Perplexity with its favicon, task label, transition, pulse mark, and a five-square progress cadence.
  - Visual requirements captured from the user annotation:
    - Layout: contact must read as a simple person/message row, not a floating initials marker.
    - Interaction: only one agent is visible in the comparison router at a time; the favicon and agent change through a short transition.
    - Responsive: preserve the rail and compare panel without horizontal overflow at mobile width.
  - Validation:
    - `pnpm build` passes; Vite retains the existing large-chunk warning.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright visual checks confirm the avatar/contact is visible, one progress square is active, the agent changes during the session (Gemini and Ubik orchestrator observed), and there is no horizontal overflow at 1780px or 390px.
  - Visual evidence:
    - Before evidence: user-attached browser-comment screenshots for the contact display and static model-router stack in the current Codex task.
    - After contact desktop: `output/playwright/homepage-how-contact-avatar-after-desktop.png`
    - After contact mobile: `output/playwright/homepage-how-contact-avatar-after-mobile.png`
    - After live agent desktop: `output/playwright/homepage-compare-live-agent-after-desktop.png`
    - After live agent mobile: `output/playwright/homepage-compare-live-agent-after-mobile.png`
  - Production deployment:
    - Netlify production deploy `6a61fdb8255f994400167fd6` is `ready` and published at `https://theubik.com`.
    - Immutable deploy URL: `https://6a61fdb8255f994400167fd6--theubik.netlify.app`.

- 2026-07-24 local-only Motion UI background pass:
  - No commit, push, PR, main merge, or Netlify deploy was performed. Keep this pass local until the user and team approve it.
  - Motion sources reviewed:
    - `https://github.com/motiondivision/motion`
    - `https://motion.dev/magazine/introducing-motion-ui`
    - `https://motion.dev/ui/install`
    - `https://motion.dev/ui`
  - Product/access distinction:
    - The core `motion` package is MIT-licensed and already installed in this repo.
    - Motion UI supports shadcn CLI installation and semantic-token theming, but its current `@motion/...` registry requires a Motion+ token; some sections also depend on private `@motionplus/...` packages.
    - Created the reusable local skill at `/Users/shubhranshujha/.codex/skills/motion-ui-marketing/`, with the public Motion engine/examples as the default implementation reference and the tokenized Motion UI registry as an optional install path.
  - Visual requirements:
    - Layout: preserve the split hero and operating queue, but make the full first viewport feel like one composed product surface.
    - Spacing/copy: remove the grey explanatory paragraph; keep one headline, three compact proof facts, and two actions.
    - Typography: white display headline on blue; IBM Plex Mono for proof facts and operating details.
    - Color: replace the pale grey dot field with full-strength Ubik blue, white hairline structure, and white-on-primary controls.
    - Interaction: retain cursor-responsive matrix cells and add a guarded ambient scan; reduced-motion users receive a static field.
    - Responsive: stack the queue below the headline on mobile with no horizontal overflow.
  - Implementation:
    - Updated `LandingV2Hero` to use the interactive matrix field, blue/white hero treatment, proof strip, and stronger queue framing.
    - Updated the hero field CSS to use a blue grid/scan field with white responsive cells instead of the grey haze.
  - Validation:
    - `pnpm build` passes; Vite retains the existing large-chunk warning.
    - `pnpm lint` passes with the existing seven Fast Refresh warnings in `src/components/evilcharts/**`.
    - `git diff --check` passes.
    - Playwright reports zero console errors, two existing React Router future-flag warnings, and no horizontal overflow at 1280px desktop or 390px mobile.
  - Visual evidence:
    - Before grey motion field desktop: `output/playwright/homepage-motion-swarm-after-desktop.png`
    - After blue Motion-inspired hero desktop: `output/playwright/motion-ui-hero-desktop.png`
    - After blue Motion-inspired hero mobile: `output/playwright/motion-ui-hero-mobile.png`
  - Local review URL: `http://127.0.0.1:5173/`.
## 2026-07-25 homepage annotation recheck

- User reported that not all browser annotations appeared fixed.
- Rechecked the live localhost page and found two remaining visual/copy gaps: the Trade Notes feature still had a subtitle above its title, and the companies strip still used a small `OPERATING EXPERIENCE ACROSS` kicker with low-contrast logos.
- Fixed by removing the remaining Trade Notes subtitle, replacing the ticker label with `Companies our team has worked with`, increasing strip/logo scale and spacing, and increasing logo contrast/saturation to prevent pale marks disappearing on the light background.
- Verified `pnpm build` and `git diff --check` pass. Localhost remains at `http://localhost:5173/`.
- Final visual evidence:
  - `output/playwright/home-annotations-final-desktop.png`
  - `output/playwright/home-annotations-final-founder.png`
# 2026-07-28 local hero motion planning

- Status: first local implementation complete and visually verified.
- Scope is explicitly local only across multiple sessions. Do not commit, push,
  open a PR, or deploy without explicit user approval.
- User correction: retain the existing fisherman, ship, wave, harvest, and
  related hero graphics. The references affect motion and rendering quality
  only; they do not replace the artwork.
- All prototypes begin in Ubik blue. Do not start with a monochrome version.
  The gradient-flow reference should become a restrained multi-tone blue ramp,
  not a rainbow palette.
- Added `PLAN.md` with two separate workstreams:
  - an isolated Canvas 2D sandbox that applies `@yuruyurau`-inspired phase
    continuity to the existing hero scenes,
  - a refinement of the existing `ParticleField` renderer using delta-time
    motion, subpixel coordinates, adaptive smaller cells, tonal Ubik-blue
    bands, coherent flow, and density crossfades.
- The current implementation is Canvas 2D, not Three.js. It rasterizes
  grayscale vector scenes through an 8x8 Bayer matrix at 9/10/13px cells and
  draws pixel-rounded squares in two opacity buckets.
- Current baseline:
  `output/playwright/hero-dither-plan-baseline-desktop.png`.
- Implemented in `src/components/landing/ParticleField.tsx`:
  - retained the existing wave, ship, and fisherman/harvest vector scenes,
  - changed adaptive cell sizes from 9/10/13px to 7/8/10px,
  - removed moving-particle integer pixel snapping,
  - added deterministic coherent phase flow and subtle size breathing,
  - added a four-step tonal ramp derived from the existing `--primary` blue,
  - made pointer spring and heat decay delta-time based,
  - kept ambient flow anchored to home positions and faded it out during the
    scroll-to-footer journey.
- Added a hero stacking guard in `src/index.css` so text and controls remain
  above the denser moving canvas.
- Validation:
  - `pnpm build` passes with the existing Vite chunk warnings,
  - `pnpm lint` passes with eight existing Fast Refresh warnings,
  - `git diff --check` passes,
  - 120-frame desktop sample averaged 9.93ms with 0 frames over 20ms,
  - normal mode changes canvas frames; reduced-motion mode stays static,
  - 390px viewport has zero horizontal overflow and a 390px canvas,
  - all three pinned scenes remain recognizable.
- Visual evidence:
  - before desktop:
    `output/playwright/hero-dither-plan-baseline-desktop.png`,
  - after wave desktop:
    `output/playwright/hero-flow-after-wave-desktop.png`,
  - after ship desktop:
    `output/playwright/hero-flow-after-ship-desktop.png`,
  - after harvest mobile:
    `output/playwright/hero-flow-final-harvest-mobile-390.png`.
- Browser console has no implementation errors. The existing external
  Hapag-Lloyd Google favicon request still returns 404 after several seconds.
- Exact tweet URLs or recordings remain needed before claiming visual parity
  with the `@yuruyurau` and `@its_sslvr` references.
- Local review URL is `http://127.0.0.1:5174/`.

## 2026-07-28 operating-loop and deploy illustration pass

- Status: implemented and visually verified locally. Do not commit, push, open
  a PR, or deploy without explicit user approval.
- Reworked the dither scenes in `src/lib/deploy-scenes.ts`:
  - Organisational Memory is now a layered, time-indexed record vault.
  - Agentic Workflows now shows three input lanes converging on the Ubik core
    and resolving into committed outputs.
  - VPC is a private cloud silhouette wearing a separated spy-style hat.
  - Managed is an athletic android runner with a stable torso and animated
    limbs/speed trails.
- Updated `DitherTile` with viewport-gated, approximately 30fps animation,
  coherent subpixel drift, restrained blue glints, and a static reduced-motion
  state. The same behavior applies on desktop and mobile.
- Managed copy is intentionally fixed to two lines:
  `Frontier speed. No data collection or sharing;` and
  `never used for training, analytics, or ads.`
- Removed the `COMPLIANCE POSTURE` label. GDPR, DPDP, and SOC 2 Type II now
  include compact certificate/issuer favicons and retain `IN PROGRESS`.
- Validation:
  - `pnpm build` passes with the existing Vite chunk warnings.
  - `pnpm lint` passes with eight existing Fast Refresh warnings.
  - `git diff --check` passes.
  - all three deploy canvases change in normal motion mode and remain static
    under reduced motion.
  - the three compliance images load successfully.
  - desktop and 390px mobile checks report zero horizontal overflow.
- Visual evidence:
  - final operating-loop desktop:
    `output/playwright/dither-illustrations-operating-loop-final2-desktop.png`
  - final deploy desktop:
    `output/playwright/dither-illustrations-deploy-final-desktop.png`
  - final operating-loop mobile:
    `output/playwright/dither-illustrations-operating-loop-after-mobile.png`
  - final deploy mobile:
    `output/playwright/dither-illustrations-deploy-final-mobile.png`
- Local review URL remains `http://127.0.0.1:5174/`.

### Compliance-mark correction

- The initial favicon treatment was rejected as inaccurate. `gdpr.eu` is a
  private reference site, MeitY's favicon is not a DPDP certification badge,
  and AICPA's corporate favicon is not a SOC 2 Type II certification mark.
- Replaced all three external favicons with neutral `EU`, `IN`, and `SOC`
  identifiers. These distinguish jurisdiction/report family without implying
  that Ubik holds a certification or has permission to use an issuer mark.
- Verified the corrected strip contains no images, has zero horizontal
  overflow, and builds successfully.
- Corrected visual evidence:
  `output/playwright/compliance-neutral-marks-after.png`.

### Final Decision Intelligence width annotation

- Removed the desktop-only width caps from the Decision Intelligence heading
  wrapper, title, and caption. At wide desktop the title and unchanged caption
  now each fit on one line; the existing mobile wrapping is unchanged.
- Desktop and 390px mobile checks report zero horizontal overflow.
- Visual evidence:
  - before: user browser annotation supplied on 2026-07-28,
  - after desktop:
    `output/playwright/decision-intelligence-width-after-desktop.png`,
  - after mobile:
    `output/playwright/decision-intelligence-width-after-mobile.png`.
- User approved this accumulated local direction for a push to `main` and a
  production Netlify deployment after this annotation fix.

## 2026-08-03 Mintlify interactive product guide

- Target repository: `solarpunk-tech/the-ubik-landing`.
- Target branch: `admin-mcp/read-watch-journeys-a653373` (PR 21).
- Preserved the Mintlify dashboard editor commit `8c82e459c38bf4c61fd760bebce88a602bfd2873`
  before applying this pass.
- Replaced screenshot-led Read pages with reusable interactive JSX surfaces in
  `docs/snippets/product-prototypes.jsx` for Ask ubik, Inbox, Tasks, Workflows,
  and the Watch journey.
- Compressed public navigation to seven entries: Start; four Read pages; one
  stateful Watch page; and Workspace basics under Help.
- Deleted five redundant Watch child pages and added redirects from their old
  URLs to `/getting-started/watch`.
- Removed all public `coming soon` copy and all product screenshot references.
  Product screenshots remain historical source material only.
- Applied the canonical `ubik-design` contract: Noto Sans and IBM Plex Mono,
  zero radii, hairline borders, paper `#FBFAF7`, ink `#10182B`, shell
  `#F4F2EC`, well `#F2F0EA`, muted ink-blue `#35426B`, action blue `#315CF4`,
  border `#BFCEE8`, and dark background `#0B1220`.
- Audited public docs for visible `Ubik`, `UBIK`, `coming soon`, em dashes, en
  dashes, and `/images/product/` references; none remain.
- Validation passes from `docs/`: `mintlify validate`, `mintlify broken-links`,
  and `mintlify a11y`. All 13 MDX files pass accessibility checks; canonical
  blue meets WCAG AA but not AAA against the configured surfaces.
- The remote Mintlify deployment check was skipped and the existing Netlify
  preview checks failed before this pass, which explains a stale editor
  preview. Do not claim visual completion until the editor refreshes this
  branch and a new screenshot confirms the seven-entry nav and interactive
  states.
- Visual status: INCOMPLETE. Before evidence is the user's Mintlify editor
  screenshot from 2026-08-03. After evidence is still required from the
  refreshed Mintlify editor; local preview was intentionally not used.

### Mintlify editor runtime repair

- The editor ingested `<OperatorPrototype />` but reported that it could not be
  rendered. The imported JSX snippet relied on `useState`, while Mintlify only
  guarantees automatic React hooks in MDX pages.
- Created branch `cleanup-changes` from the pushed interactive-guide commit and
  replaced all hook-driven states with native radio inputs and CSS selectors.
  Ask ubik, Inbox, Tasks, Workflows, and Watch remain interactive without a
  React hook runtime dependency.
- `mintlify validate`, `mintlify broken-links`, `mintlify a11y`, and
  `git diff --check` pass after the repair.
- Visual status remains INCOMPLETE until the Mintlify editor ingests the new
  branch and supplies after evidence.

### Product visuals and Watch lessons restored

- Kept the CSS-native interactive components and restored every product image
  under `docs/images/product/` to an appropriate current page.
- Getting started and Ask ubik now show both composer screenshots. Ask ubik also
  restores the Morning brief, Slack catch-up, and PR review artifact examples.
- Inbox now pairs the interactive surface with the evidence-first thread and
  meeting follow-through frames. Tasks restores the full obligations board.
- Workflows now pairs its interactive rendition with Library, Live workflow,
  and Workflow map screenshot tabs before the Week 1 founder-led playbook.
- Watch is again six short pages: Ask ubik, Inbox, Tasks, Workflows, Trade
  memory, and Finetuning. Only the Watch group grew; Start, Read, and Help retain
  the compact navigation contract.
- Inbox and Trade memory use the existing hosted product clips. Both clip and
  poster endpoints returned HTTP 200 before inclusion.
- `llms.txt` and `MINTLIFY_AUTHORING.md` now match the restored lesson structure.
- Validation passes: Mintlify build, broken links, accessibility across 18 MDX
  files, JSON parsing, and `git diff --check`.
- Visual status remains INCOMPLETE until the Mintlify editor renders this branch
  and supplies after screenshots. Do not substitute a local preview because the
  user reviews through the connected Mintlify editor.

### Login surface, Meetings, and Watch route repair

- Removed the repeated `Product UI` headings from Getting started, Ask ubik,
  Inbox, Tasks, and Workflows.
- Getting started now uses a Mintlify-native rendition of the current login
  right panel from `ubik-webapp` staging commit
  `aedad967bd5545c5cc5a506ff4e35f2e76871cec`: three proof stats, seven
  switchable surfaces, and the trust/download rail.
- Removed `meetings-workspace.jpg` from rendered docs because it is not the
  current Meetings UI. The unused tracked asset remains in Git history only.
- Added a current Meetings rendition inside the Inbox page: filter chips,
  List/Calendar states, Coming up and Past rows, a follow-through rail, and a
  canonical `https://theubik.com/download` action.
- There is no live or historical PR head named `redesign/meetings-rail` on the
  webapp remote. The current staging Meetings source and merged desktop prompt
  work were used instead; do not claim branch-specific parity unless that ref
  becomes available.
- Watch lesson files moved from nested `/getting-started/watch/*` routes to
  flat `/getting-started/watch-*` routes. Old nested URLs now redirect to the
  flat pages. This avoids stale editor redirects that previously sent every
  Next action back to the first lesson or produced a missing page.
- Mintlify build, broken links, accessibility across 18 MDX files, JSON parsing,
  lowercase copy audit, and `git diff --check` pass after the change.
- Visual status remains INCOMPLETE until the connected Mintlify editor renders
  the updated branch and the user supplies an after screenshot.

### Production publication and visual verification

- Fixed Mintlify JSX snippet compilation by moving `StateTabs`, `AppChip`, and
  product-surface data into the exported component closures. Mintlify was
  compiling exported snippets independently, so module-level helpers appeared
  as missing MDX components even though CLI validation passed.
- Published commit `3a0bb138609dc4da05cae2594092faddb4d448ca` to both
  `cleanup-changes` and production `main`. Mintlify Activity reports the update
  as **Successful** and identifies the same commit as the live source.
- Production checks passed at `https://docs.theubik.com`: the Getting started
  Operator and product-surface prototypes render, the flat Watch Inbox route
  returns a real lesson rather than a 404, and neither page contains a component
  render error.
- Before evidence: the user's Mintlify editor screenshots from 2026-08-03,
  including the `<OperatorPrototype /> could not be rendered` state.
- After evidence: `/tmp/ubik-docs-production-3a0bb13.png` and
  `/tmp/ubik-docs-watch-inbox-production-3a0bb13.png`.
- Visual delta: broken component placeholders are replaced by working native
  product-state controls; the compact Start/Read/Watch/Help navigation is live;
  and Watch Inbox loads its video lesson with working previous/next navigation.
- Visual status: COMPLETE for this publication pass.
