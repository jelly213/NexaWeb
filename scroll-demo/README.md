# Scroll-Story Demo (wearebrand.io-style scroll scrubbing)

One self-contained page proving the "scroll = video playhead" effect: GSAP ScrollTrigger
(`scrub` + `pin`) + Lenis smooth scroll + layered AI-generated art (Higgsfield, nano-banana
+ background remover). No video file, no WordPress plugins.

## Run it

```bash
npx serve -l 4173 .
# open http://localhost:4173
```

## How it works (the whole trick)

- **`assets/`** — 4 layers: sky (opaque backdrop), clouds / city / rocket (transparent WebP cutouts).
- **One pinned timeline** (`index.html`, the `tl` block): `pin: true` freezes the scene for
  3200px of scrolling; `scrub: 1.2` maps scroll position → timeline time with a smoothing lag.
- Each layer gets different `yPercent` / `scale` moves on the same timeline = parallax depth.
- Lenis provides scroll inertia; it's driven from GSAP's ticker so both stay in sync.

## Reusing in client work

- **WordPress**: paste the `<style>`, markup, and `<script>` blocks into a page template or an
  HTML block; upload the assets to the media library and fix the 4 paths. GSAP/Lenis load from CDN.
- **React (nexaweb.dev)**: same timeline inside `useGSAP` from `@gsap/react`, or reproduce with
  Framer Motion `useScroll` + `useTransform`.

## Hard-won gotchas (cost real debugging time — keep)

1. **AI cutouts must be defringed.** Background removers output transparent pixels as *white*
   `rgba(255,255,255,0)`. Some GPU/compositor paths blend that RGB additively → a ghostly veil
   over the image's bounding box. Fix in the pipeline: set fully-transparent pixels to black and
   premultiply semi-transparent edges (see git history for the Pillow one-liner).
2. **`lenis.resize()` after `ScrollTrigger.refresh()`.** Lenis measures the page before the pin
   spacer exists; without the resync users can never scroll past the pinned scene.
3. **`history.scrollRestoration = "manual"`** — Chrome's late scroll restoration otherwise
   teleports the visitor mid-timeline on reload.
4. Cut-off cloud strips: dissolve the hard bottom row with a CSS `mask-image` gradient instead
   of editing pixels.

## Pagespeed status (audited 2026-07-19)

- Images: right-sized WebP, 96 KB total (was 2.1 MB PNG). Hero is pure text → fast LCP.
- All animation is transform/opacity (compositor-only); layers are `will-change: transform`.
- Scene images are absolutely positioned → zero CLS.
- CDN `<script>` tags sit at end of `<body>` (non-blocking). For production, self-host the three
  libs (~60 KB gzipped total) to drop the third-party DNS hit.
