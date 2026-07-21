# Cashmere Storefront Demo — "Maison Lune"

A self-contained, single-file demo storefront for a **women's contemporary cashmere brand**,
built to answer a specific brief: an SKU-heavy, photo-heavy shop that has to stay elegant and
fast. It's a NexaWebDev portfolio/pitch piece — proof-of-concept for the Shopify build, not a
live store. Everything runs from one `index.html` with **zero dependencies, zero build step,
zero network requests**.

> **Maison Lune is a fictional brand.** Nothing here represents a real company, and no images
> of real products or people are used — every "photo" is generated in-browser from SVG (see below).

## Run it

```bash
npx serve cashmere-demo -l 4173
# open http://localhost:4173
```

Or just open `cashmere-demo/index.html` in a browser — no server required.

## What it demonstrates (mapped to the brief)

The client wanted a Shopify designer who can **"effectively manage and display a wide range of
products and images"** for a **"large number of SKUs and extensive photo assets."** Each of
those maps to something concrete here:

| Client need | In the demo |
|---|---|
| Large number of SKUs | 24-SKU catalogue driven by a single `products` array — the grid, collection counts, filters and colour swatches all derive from it, so scaling to 240 SKUs is a data change, not a redesign |
| Merchandising / findability | Live **collection filtering**, **colour filtering**, and **sort** (featured / price / newest) with a result count — all client-side, instant |
| Extensive photo assets | Every card has a **hover-swap** front/detail "photo," quick-add on hover, wishlist, colour swatches, and sale/new/bestseller badges — the interaction pattern real product photography would slot into |
| Shopping experience | Sticky header, slide-in **cart drawer** with quantity steppers, a free-shipping progress bar, toast confirmations, newsletter capture, and a mobile menu |
| Luxury feel | Editorial serif/sans pairing, warm cashmere palette, generous whitespace, scroll reveals, hand-tuned motion |

## The "no real photos" trick

A cashmere demo lives or dies on its imagery, but shipping stock photos of someone else's
products would be dishonest for a portfolio piece. So every product image is **generated at
runtime**: a warm two-stop gradient in the product's colourway + an SVG knit-stitch texture
(the `#knit` / `#knitDark` patterns) + a line-art garment silhouette. The hover "detail" shot
is the same garment zoomed and colour-shifted. It reads as intentional editorial art, weighs
nothing, and is trivially swapped for the client's real photography later.

## How it maps to a real Shopify build

The demo is deliberately structured to mirror Shopify's own primitives, so the front-end port
is mechanical:

- `products` array → **Storefront / Admin API** (or Liquid `{% for product in collection.products %}`)
- product grid → a **collection template** section
- `quickAdd()` → `POST /cart/add.js`
- cart drawer / `renderCart()` → `/cart.js` + a **cart drawer section** re-rendered from the Section Rendering API
- colour swatches / sizes → **variants** and option sets
- filters → Shopify's native **Search & Discovery** filtering (or `collection` + `filter.v.*` params)
- newsletter → a **Klaviyo** embedded form / flow (the client's companion job posting is for Klaviyo — this hooks straight into it)

## Performance notes

- One HTML file, inline CSS/JS, **no external fonts, scripts, or images** → no third-party DNS,
  no render-blocking requests.
- All imagery is inline SVG (a few KB total) → negligible payload, zero image CLS
  (fixed `aspect-ratio` on every media box).
- Animations are transform/opacity only (compositor-friendly); scroll reveals use
  `IntersectionObserver`; everything respects `prefers-reduced-motion`.
- Fully responsive, mobile-first (4-col → 2-col → 2-col grid; drawer and menu adapt).

## Where this is NOT production

It's a front-end pitch, so by design there's no real cart persistence, no checkout, no inventory,
no PDP route, and sizes default to "M" on quick-add (a real PDP would let the shopper choose).
Those are the exact pieces the paid Shopify build would deliver.
