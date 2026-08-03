# Mintlify authoring contract

This file governs the ubik guide. It records the product structure, the Mintlify patterns that fit it, and the checks required before a branch is ready for review.

## Product contract

- Write `ubik` in lowercase. Use `Ask ubik` for the product surface.
- Use the configured Lucide `message-square` icon for Ask ubik. Do not use the blue square-dot mark as its icon.
- Keep product wordmarks in the navbar configuration. Do not repeat a logo inside a lesson or feature page.
- Document what exists in the app. Label a mockup as a proposed workflow, sample workflow, or prototype.
- A screenshot must prove a product state, action, or result. Crop browser and editor chrome unless that chrome is part of the instruction.
- The public guide teaches Inbox, Tasks, and Ask ubik. Workflows, Trade Memory, and Finetuning explain the operating model without pretending every screen is live.

## Navigation

`docs/docs.json` is a route map, not an inventory. A page may exist without occupying a permanent sidebar row.

Use this visible structure:

1. **Start**: Getting started.
2. **Read**: Ask ubik, Inbox, Tasks, Workflows.
3. **Watch**: Ask ubik, Inbox, Tasks, Workflows, Trade Memory, Finetuning.
4. **Help**: Operator habits.

Keep these out of the main sidebar:

- Sign in. The app owns authentication.
- Future product pages.
- Users and access.
- Generic product comparisons.
- Separate admin, component, logo, and reference-workflow sections.

Link settings from the relevant instruction. End Good operator habits with two actions: `Open settings` and `Talk to founders` or `Raise a request`. The second action uses the approved calendar or support URL.

Read is the compact product reference plus the Week 1 workflow playbook. Watch is one page with six switchable states: Ask ubik, Inbox, Tasks, Workflows, Trade Memory, and Finetuning. Old Watch lesson URLs redirect to that page.

Use one root navigation pattern. Mintlify permits groups, tabs, anchors, dropdowns, and nesting, but more controls do not make a small guide easier to scan. Groups are enough here. Use a group `root` only when its title must open a real overview. Disable inherited directory cards when the page already supplies its own choices.

When a file moves, add a `redirects` entry in `docs.json`. Run the broken-link check before deleting the old route.

## Page architecture

### Getting started

Use one sentence, one interactive product prototype, and Read or Watch links. The prototype must show a state change that screenshots cannot.

### Read lesson

Use this order:

1. One-sentence outcome.
2. One current product frame or two-state interaction.
3. Two to four operator actions.
4. A result or artifact.
5. One next lesson link.

The four operator habits are source-first review, named ownership, explicit approval, and closure evidence. Workspace basics becomes this short habits page. It is not a tour of every navigation item.

### Watch

Use this order:

1. Keep all six lessons on one page.
2. Use one keyboard-accessible switcher.
3. Change the lesson copy and product state in place.
4. Keep old lesson routes redirected to the switcher.

### Week 1 workflow playbook

Describe the forward-deployed sequence, not a generic automation catalogue:

1. Map two or three workflows across the people who request, decide, execute, and verify the work.
2. Build a sample from the systems and artifacts already used by the customer.
3. Run it for one week with Shubhranshu and Hemanth.
4. Update the workflow from observed exceptions, then connect it to a measurable operating result.

Show the workflow library as a compact snapshot. A selected card may open a screenshot or a dedicated detail page. Distinguish green `live` workflows from blue `designed` workflows with text as well as color. The workflow detail must name inputs, checks, alerts, the human decision, and the resulting artifact.

## Components and media

### ubik-design parity

Interactive product surfaces live in `/snippets/product-prototypes.jsx`; pages import them instead of flattening the interface into screenshots. Their CSS must consume the canonical `ubik-design` values: paper `#FBFAF7`, ink `#10182B`, shell `#F4F2EC`, well `#F2F0EA`, action blue `#315CF4`, dark action blue `#5B82FF`, rule blue `#BFCEE8`, Noto Sans, IBM Plex Mono, zero radius, and no shadow outside overlays.

Each prototype needs keyboard-accessible controls, a useful initial state without interaction, and a mobile layout. Keep product copy inside the component lowercase for `ubik`.

Prefer Mintlify's native MDX components. They inherit the theme, survive Mintlify updates, and remain readable in source form.

- `Frame`: one screenshot with a caption that says why it matters.
- `Tabs` and `Tab`: alternate states of the same surface, such as Start and Apps connected. Keep titles short.
- `Card` and `Columns`: a small set of links or workflow choices. Every clickable card needs an `href`.
- `Steps` and `Step`: actions that must happen in order.
- `Accordion`: secondary detail, transcripts, or failure recovery. Do not hide the page's main instruction inside it.
- Markdown tables: exact mappings and comparisons. Avoid wide prose tables on mobile.

Use this pattern for the Ask ubik state change:

```mdx
<Tabs>
  <Tab title="Start" icon="message-square">
    <Frame caption="Choose a task or write a question.">
      <img src="/images/product/ask-operator-start.png" alt="Ask ubik composer before apps are attached" />
    </Frame>
  </Tab>
  <Tab title="Apps connected" icon="plug">
    <Frame caption="GitHub, Notion, and Slack are attached to the prompt.">
      <img src="/images/product/ask-operator-connected.png" alt="Ask ubik composer with GitHub, Notion, and Slack attached" />
    </Frame>
  </Tab>
</Tabs>
```

Tabs are the default for a two-state click demonstration. Use a muted, looping, inline video when timing or pointer movement carries information:

```mdx
<video
  autoPlay
  muted
  loop
  playsInline
  aria-label="Ask ubik connects three apps to a daily brief prompt"
  className="w-full aspect-video"
  src="/videos/ask-ubik-connect-apps.mp4"
>
  Ask ubik connects GitHub, Notion, and Slack to a daily brief prompt.
</video>
```

Do not ship a GIF when Tabs express the same two states. A loop is useful only when motion explains the transition. Do not autoplay audio. Keep critical instructions in text beside the media.

Use an iframe for a real hosted prototype only when its source permits embedding and it works on mobile. Give every iframe a descriptive `title`. Provide a screenshot and link if the embed fails.

Reusable snippets belong in `/snippets`. Mintlify accepts MDX snippets, variables, JSX snippets, and React hooks, but a custom interactive component must earn its maintenance cost. Use one only when Tabs, Cards, Steps, video, or an iframe cannot express the interaction. Custom CSS should target project classes or Mintlify's stable `data-component-name` hooks. Do not depend on undocumented internal class names.

## Accessibility

- Give every image specific alt text that explains the visible state. Do not start with `Image of`.
- Give every iframe a `title`; give each video an accessible label or title and fallback text.
- Caption spoken video and place a transcript beside it or inside a nearby Accordion.
- Repeat any status conveyed by color with a word such as `live`, `designed`, `safe`, or `critical`.
- Preserve keyboard access and visible focus for tabs, cards, buttons, and embedded prototypes.
- Test the light and dark themes. Confirm body text, links, status chips, and focus rings meet contrast requirements.
- Check the narrow layout. Columns must stack without clipped tables, controls, or screenshots.

## `llms.txt`

Mintlify generates `/llms.txt`, `/llms-full.txt`, and a Markdown version of each page. A custom `llms.txt` overrides the generated index, so the repository file must match the visible guide.

The custom file needs:

- One H1 site title.
- One concrete blockquote summary.
- Sections that mirror the public navigation.
- Absolute Markdown links to live pages.
- One distinct description per page.

Do not list deleted, hidden, future, or duplicate lessons. After deployment, open `/llms.txt`, `/llms-full.txt`, and two representative `.md` page URLs. Run `mint score docs.theubik.com` when the deployed site is reachable.

## Validation and review

Run from `docs/` with the current Mintlify CLI:

```bash
npx --yes mintlify@latest validate
npx --yes mintlify@latest broken-links --check-anchors --check-redirects --check-snippets
npx --yes mintlify@latest a11y
```

Then check the branch preview at desktop and mobile widths. Review light and dark themes, every sidebar label, the prototype controls, action buttons, and redirected routes. The source checks prove that the build is valid. The branch preview proves that the guide reads and behaves correctly.

## Common mistakes

- Publishing the file tree as navigation.
- Giving setup, future work, and admin reference the same weight as daily product actions.
- Repeating one lesson across Getting started, Read, Watch, and Features.
- Using a component because Mintlify supplies it. The content decides the component.
- Showing a screenshot without naming the action or result it proves.
- Making a static card look clickable without linking it.
- Using an animated loop where two labeled states would be clearer.
- Writing custom CSS against Mintlify's internal classes.
- Moving a page without a redirect.
- Maintaining a custom `llms.txt` that lists stale routes.
- Treating CLI success as visual approval.

## Authoring checklist

- [ ] The page answers one operator question.
- [ ] The title names the product surface or task.
- [ ] The description adds information instead of repeating the title.
- [ ] The first sentence states the outcome.
- [ ] Every screenshot or clip proves a state change, action, or artifact.
- [ ] Ask ubik uses `message-square`, not the square-dot mark.
- [ ] No inline logo repeats the navbar wordmark.
- [ ] No future page occupies the main sidebar.
- [ ] No paragraph repeats another page's explanation.
- [ ] Links, redirects, alt text, contrast, keyboard use, and mobile layout pass.
- [ ] `llms.txt` matches the visible guide.
- [ ] A reviewer has checked the branch preview.

## Official Mintlify references

- Navigation: https://www.mintlify.com/docs/organize/navigation
- Site structure and `docs.json`: https://www.mintlify.com/docs/organize/settings-structure
- Images, videos, and iframes: https://www.mintlify.com/docs/create/image-embeds
- Tabs: https://www.mintlify.com/docs/components/tabs
- Cards: https://www.mintlify.com/docs/components/cards
- Steps: https://www.mintlify.com/docs/components/steps
- Accordions: https://www.mintlify.com/docs/components/accordions
- Reusable snippets: https://www.mintlify.com/docs/reusable-snippets
- Custom CSS and scripts: https://www.mintlify.com/docs/customize/custom-scripts
- Accessibility: https://www.mintlify.com/docs/guides/accessibility
- `llms.txt`: https://www.mintlify.com/docs/ai/llmstxt
- CLI commands: https://www.mintlify.com/docs/cli/commands
- Redirects and broken links: https://www.mintlify.com/docs/create/redirects
