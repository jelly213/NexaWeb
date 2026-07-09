# Website — nexaweb.dev

> **System tools** (agents, tasks, lessons) live at `../system/`. Log lessons and tasks there from the root PORTFOLIO workspace.


Main portfolio and agency site for NexaWebDev.

## Project Location
`website/portofolionx/` — React/Vite SPA deployed on Cloudflare Pages

## Commands
```bash
cd website/portofolionx
npm run dev       # dev server with hot reload
npm run build     # type-check (tsc) + Vite production build
npm run lint      # ESLint on all TS/TSX files
npm run preview   # preview production build locally
```

## Architecture
Single scrollable page: `Navbar → Hero → Problem → HowItWorks → TechStack → FinalCTA → Footer`

- **Content/copy:** All bilingual strings live in `src/context/LanguageContext.tsx` — edit there, not in components
- **Sections:** `src/sections/` — full-width page sections, each calls `useLanguage()` for copy
- **UI primitives:** `src/components/` — Button, Badge (shadcn/ui), ContactForm
- **i18n:** `language` toggle in Navbar; `t(key)`, `toggleLanguage()`, `tProblemLeft()`, `tProblemRight()` from `useLanguage()`
- **Styling:** Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config.ts`, tokens are CSS custom properties in `src/index.css` (OKLCH colors)
- **Animations:** Framer Motion, `whileInView` + `viewport={{ once: true }}` in sections
- **Path alias:** `@` → `src/`

## Analytics & Consent (added 2026-07-09)

Three layers, two consent rules. Get this wrong and it is a legal problem, not a bug.

| Layer | What | Consent |
|---|---|---|
| A | Cloudflare Web Analytics + our `/api/e` beacon (`src/lib/analytics.ts` → `functions/api/e.ts`) | **None needed** — cookieless, no identifier, no IP |
| B | GA4 (`src/lib/ga.ts`) | **Explicit opt-in.** `gtag.js` is never injected until Accept |
| C | Read-only APIs (`../analytics/*.mjs`) | Server-side, no browser impact |

- **Quebec Law 25 is opt-in.** The banner (`src/components/ConsentBanner.tsx`) must name "Google
  Analytics", render in French for FR visitors, and keep **Refuse exactly as easy as Accept**.
- We gate by *not loading the script*, not by Consent Mode v2 — its `denied` state still pings Google.
- Layer A's lawfulness rests on storing nothing that identifies a person. **If you ever add a visitor
  ID to `/api/e`, it must move behind the gate.**
- `VITE_GA4_ID` is public and safe. `STATS_BEARER` / `CF_API_TOKEN` / `CF_ACCOUNT_ID` are secrets and
  **must never carry a `VITE_` prefix** — Vite inlines those into the client bundle.
- With `VITE_GA4_ID` unset, GA4 tree-shakes out of the bundle entirely and the banner does not render.
  That is the correct default, not a broken state.

Events: `cta_click` (hero|nav|footer|final), `section_view`, `scroll_depth`, `call_booked`, `lang_toggle`.
The conversion is `call_booked`, fired from Calendly's `event_scheduled` postMessage.

To read real numbers, see `../analytics/README.md`. For conversion work, see `../system/agents/cro.md`.

## Standards
- TypeScript strict — no `any`
- Bilingual (FR/EN) required on all copy — every EN string needs its FR pair in `LanguageContext.tsx`
- Mobile-first, Core Web Vitals must stay green
- shadcn/ui new-york style, neutral base, CSS variables enabled
- The portfolio distinguishes **client work** from **demo builds** (`kind` on `PortfolioItem`).
  Do not relabel demo mockups as delivered client work.
