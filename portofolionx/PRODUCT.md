# Product

## Register

brand

## Users

Founders and ops leads of small marketing/design/SEO agencies (US + Canada, often Quebec — FR/EN
bilingual) evaluating a white-label dev partner. They arrive from cold email, Upwork, or a demo
link, on desktop or phone, deciding in under two minutes whether this team can build things their
own clients will pay for. Secondary: direct small-business owners shopping for a Shopify store.

## Product Purpose

nexaweb.dev is NexaWebDev's proof-of-competence surface. It sells white-label web development
(Shopify-led; premium "Scroll Story" tier at $5k) by demonstrating craft rather than claiming it.
Success = a booked discovery call (`call_booked` conversion via Calendly). The portfolio section is
the shared sales asset for Upwork bids and cold outreach.

## Brand Personality

Technical, invisible, margin-focused. "Your invisible dev team. Your full margin." The terminal
aesthetic (mono labels, `//` slashes, `book_a_call()` CTAs) is literal, not costume — the buyer is
hiring a dev shop and the UI speaks dev. Dark-first with a committed blue accent and green reserved
for money/results. Space Grotesk display + JetBrains Mono utility are shipped brand identity —
identity-preservation wins over reflex-reject lists.

## Anti-references

- Template agency sites (generic SaaS hero-metric layouts, stock-photo teams, purple gradients).
- Anything that relabels demo builds as delivered client work — client work and demos are split
  on purpose and must stay visibly distinct (`kind` on `PortfolioItem`).
- Flashy continuous background effects (particles, auroras, beams-on-loop) — they burn the Core
  Web Vitals budget the site itself brags about.

## Design Principles

1. **Practice what we preach** — the site sells scroll craft, so its own interactions must
   demonstrate it; every motion is a portfolio piece.
2. **Proof over claims** — real screenshots, real Lighthouse numbers, real store links; specifics
   beat adjectives.
3. **Motion is scroll-driven or feedback, never ambient** — user-driven scrub and entrance
   reveals yes; self-playing loops no. CWV stays green (mobile 86+, desktop 100).
4. **Bilingual is structural** — every EN string has an FR pair in `LanguageContext.tsx`; no
   copy lives in components.
5. **Two lanes, visible** — pipeline volume (Shopify) vs custom premium (Scroll Story) so buyers
   self-select upward.

## Accessibility & Inclusion

- Quebec Law 25: GA4 strictly opt-in behind the consent banner; Refuse as easy as Accept; FR
  banner for FR visitors.
- prefers-reduced-motion: scroll-scrubbed (user-driven) motion may run; self-playing entrance
  tweens get a reduced alternative. Both branches must be tested — the operator's own machine
  runs with reduced motion ON.
- Keyboard focus visible; aria labels on icon-only controls; contrast ≥4.5:1 body text in both
  themes.
