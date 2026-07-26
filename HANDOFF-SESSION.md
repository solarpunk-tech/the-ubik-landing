# Ubik landing — session handoff

**Branch:** `jex/mintlify-deploy-options` (HEAD `88902aa`)
**State:** everything below is **uncommitted**. `tsc -b`, `eslint` (0 errors, 8 pre-existing
`react-refresh` warnings) and `npm run build` all pass.
**Dev server:** `.claude/launch.json` → `ubik-landing-dev`, port 5173.

---

## 1. How to verify anything on this page

Two things will waste your time if you don't know them up front.

**The in-app browser pane freezes the animation timeline intermittently.** CSS animations
and transitions strand mid-flight, `requestAnimationFrame` stops advancing, and screenshots
return stale frames. Symptoms look exactly like real bugs. Before believing a visual defect,
disable transitions and re-measure:

```js
const st = document.createElement('style');
st.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}';
document.head.appendChild(st);
```

**`scrollTo()` in the pane changes scroll position but fires no scroll event.** Anything
driven by a scroll listener will not update. Always follow with:

```js
scrollTo(0, y); window.dispatchEvent(new Event('scroll'));
```

### The contrast audit

Run this to check both themes. It resolves colours through a canvas probe using
`clearRect` — **do not** pre-fill the probe with black, which makes every background read
as opaque and silently inverts the results (this produced 157 fake failures and one fake
all-clear before it was caught).

Current baseline: **0 failures in both themes, 0 text below 11px, 192 nodes checked.**

```js
const cv=document.createElement('canvas');cv.width=cv.height=1;
const cc=cv.getContext('2d',{willReadFrequently:true});
const toRGB=c=>{cc.clearRect(0,0,1,1);cc.fillStyle=c;cc.fillRect(0,0,1,1);
  const d=cc.getImageData(0,0,1,1).data;return [d[0],d[1],d[2],d[3]/255];};
const L=([r,g,b])=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
  return .2126*f(r)+.7152*f(g)+.0722*f(b);};
const R=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
// ...walk `body *`, skip `.closest('.particle-field')`, blend author alpha over
// the resolved backdrop, require 4.5:1 (3:1 for >=24px or >=18.66px bold).
```

Pin a hero scene for stable screenshots: `?scene=wave|ship|harvest`.

---

## 2. Two rules that were learned the hard way

**Never gate content visibility on the animation clock.** `animation-fill-mode: both` and
CSS transitions on `opacity` both hold their *start* value when the timeline is paused or
throttled — which strands content at `opacity: 0` permanently, with no way back. This
caused the "empty panel" bug the user originally reported. Six declarations were fixed and
three keyframes rewritten to animate **transform only, never opacity**. The hero field has
no reveal fade at all for this reason. Don't add one.

**Never stack alpha on alpha.** The work-ledger status text had `opacity: 0.62` on a colour
that was already `/0.64` — an effective 0.40 alpha, unreadable. Set the colour outright.

---

## 3. Architecture of the new work

### `src/lib/hero-scenes.ts` — hero artwork

Three scenes (`wave`, `ship`, `harvest`) drawn with plain Canvas2D vector commands. No SVG,
no image requests, zero asset bytes. Picked at random per load; `?scene=` pins one.

**The thing that makes these work is gradients, not flat fills.** A flat tone dithers to a
solid slab of squares; a gradient dithers to a density falloff. Every scene that reads well
uses `createLinearGradient`/`createRadialGradient` for its main masses. The wave also punches
its barrel back out with `globalCompositeOperation = "destination-out"` — without that it
renders as a blue disc.

### `src/components/landing/ParticleField.tsx` — the page field

One fixed, viewport-sized canvas that owns every square on the page. Mounted once in
`Index.tsx`, sits at `z-index: 25` (above content bands, below the sticky header).

- A scene is sampled at grid resolution and ordered-dithered through an 8×8 Bayer matrix.
- Positions live in **document** space, converted to viewport at draw time, so the canvas
  is only ever window-sized however long the page gets.
- Scroll dispersal is a **pure function of scroll progress**, not an integrated velocity.
  That is what makes scroll-up an *exact* reversal (verified: 15,168 squares at
  `meanY 548` before and after a full round trip).
- ~22% of squares survive the fall (`keep`); the rest dissolve on the way down. Survivors
  settle into three rows resting on the footer's top edge.
- In transit they render at 0.07 alpha over the content column and 0.2 in the gutters.
  Once landed they return to full strength.
- Pointer collision uses swept segment tests with per-frame spatial bucketing, so a fast
  flick can't tunnel between two `pointermove` samples. Touch devices respond to finger
  position instead (there is no hover to follow).

**Critical detail — journey values are stored as fractions, not pixels.** Three carousels
on this page (2.4s / 3.6s / 4.2s) swap panels of differing heights, which changes document
height. Anything pinned to a snapshot of that height drifts a row at a time. `startFrac`,
`endFrac` and `settleRow` are resolved each frame against `field.footerTop` /
`field.maxScroll`, which a `ResizeObserver` on `document.body` keeps live. Drift centroid is
now stable within **1.4px** across many seconds; before the fix it jumped a full row.

### `src/components/landing/DitherTile.tsx` + `src/lib/deploy-scenes.ts`

Static dithered tiles (4×4 Bayer) for the Deploy cards. One draw at mount, no rAF.

### Dark mode

`.dark` token block in `index.css`, no-flash inline script in `index.html`, dependency-free
`ThemeToggle.tsx` (`next-themes` is no longer installed).

⚠️ **`--primary` and `--primary-foreground` are deliberately identical in both themes.**
`--primary-foreground` does double duty — the label on blue fills *and* the text colour on
every dark `--shell` band. Those diverge if the blue lifts, and the shell bands go
dark-on-dark. Don't "fix" this by lifting the dark-mode blue.

⚠️ **Recurring trap:** there is a *generated* block of `.dark <selector> { color:
hsl(var(--primary-text)); }` overrides at the bottom of `index.css`, covering ~47 selectors
that paint text with raw `--primary` (3.83:1 on the dark canvas). **Any new selector that
uses `--primary` as a text colour needs its own override appended.** This was missed three
separate times. Re-run the contrast audit in dark mode after adding any section.

---

## 4. What changed, by area

**Readability (the original brief).** 105 sub-11px `font-size` declarations (min `0.36rem`
= 5.8px) raised to an 11px floor; 72 hardcoded `text-[8/9/10px]` raised; 51 alpha-faded text
declarations raised. Two invisible header controls fixed (mobile menu button and language
select were both **1.05:1** at rest — white on paper — because they were styled for the
scrolled dark header only).

**Copy.** "Chief of Staffs" (user's preferred form; note the standard plural is "Chiefs of
Staff"), "Audit decisions, not data", hero subhead de-jargoned, footer credit, ASCII `->`
→ `→`. Closing CTA is "One desk. One bill."

**Sections.** Deploy moved between "No bots" and "Audit decisions", rebuilt with dither
tiles, third option is now Managed, compliance strip added (typographic marks, **not** the
certification bodies' logos — we aren't certified). "Own your data and intelligence" replaced
by `OperatingLoop` — a three-slab cross-section, deliberately unlike both the deck layout and
the Deploy card grid.

**Team order** in the No-bots section: Sales Ops → Warehouse & Inventory → Compliance &
Quality → Packaging → Procurement → Finance & Logistics. Packaging and Procurement were
*kept* though the brief named only four desks — confirm whether they should be folded in.

**Performance.** Main bundle **620 KB → 515 KB** by making the 24 locale files lazy
(`import.meta.glob` was `eager: true`, so every visitor downloaded 24 languages to read one).
English is inlined; the rest are 23 on-demand chunks. Verified EN → DE → EN still works.

Note: the font subsets are **already** correctly gated by `unicode-range` — Devanagari never
downloads despite appearing in `dist/`. Not an optimisation opportunity.

---

## 5. Open items

1. **Decision-queue panels aren't optimised for mobile/desktop** — specifically panel 02
   (allocation memory) of Warehouse & Inventory. The user also wants **swipeable cards** so
   you can cycle through each step's panels on mobile. *Not started.*
2. **1,708 lines of dead components** — none imported anywhere: `LandingV2Sections.tsx`
   (1341), `LiveQueuePreview.tsx` (142), `ProductSurface.tsx` (109), `BlogPreview.tsx` (46),
   `SoftBlurText.tsx` (38), `VerticalTicker.tsx` (32). Left in place deliberately —
   `LandingV2Sections` is actively edited and may be intended WIP. Needs a decision.
3. **`HANDOFF.md` is 189 KB.** Separate from this file. Probably wants archiving.
4. **`public/founders/hemanth.png` is 517 KB** — staged and needed (the homepage references
   it) but worth compressing.
5. **Blog chunk is 755 KB** (recharts + visx + d3-geo + world-atlas). Route-split already,
   so it only loads on `/blog`, but it's the largest remaining chunk.
6. **Repo cleanup is staged, not committed:** 208 `verification/` files (96 MB) untracked
   via `git rm --cached`, `.gitignore` extended, `public/founders/` added.

---

## 6. Files added this session

```
src/lib/hero-scenes.ts                      hero artwork (3 scenes)
src/lib/deploy-scenes.ts                    deploy tile artwork (3 scenes)
src/components/landing/ParticleField.tsx    the page-wide square field
src/components/landing/DitherTile.tsx       static dithered tile
src/components/landing/SquareLoader.tsx     route loader (replaced dot-matrix)
src/components/landing/ThemeToggle.tsx      rewritten without next-themes
```

Deleted: `HeroParticleField.tsx` (superseded by `ParticleField`).
