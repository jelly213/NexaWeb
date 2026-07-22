# Website — nexaweb.dev

> **System tools** (agents, tasks, lessons) live at `../system/`. Log lessons and tasks there from the root PORTFOLIO workspace.


Main portfolio and agency site for NexaWebDev.

## Project Location
`website/portofolionx/` — React/Vite SPA.

**Hosting (verified 2026-07-09 from response headers — this file previously said Cloudflare Pages,
which was wrong and cost a debugging cycle):**

| What | Where |
|---|---|
| `nexaweb.dev` | **Vercel**, auto-deploying from `github.com/jelly213/NexaWeb` on push to `main` |
| DNS for `nexaweb.dev` | Cloudflare (proxied) — hence `Server: cloudflare`; the origin is Vercel |
| `events.nexaweb.dev` | Cloudflare Worker (`website/events-worker/`) — the event sink |
| `nexaweb-czn.pages.dev` | A stale Cloudflare Pages project on the same repo. **Not production.** |

Check with `curl -sI https://nexaweb.dev/ | grep -i vercel`. Do **not** add Cloudflare Pages
Functions (`functions/`) to this project — Vercel ignores that directory.

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
- **Animations:** Motion (renamed Framer Motion; `motion` package, import from `motion/react` — migrated 2026-07-22), `whileInView` + `viewport={{ once: true }}` in sections
- **Path alias:** `@` → `src/`

## Analytics & Consent (added 2026-07-09)

Three layers, two consent rules. Get this wrong and it is a legal problem, not a bug.

| Layer | What | Consent |
|---|---|---|
| A | Cloudflare Web Analytics + our own beacon (`src/lib/analytics.ts` → `events.nexaweb.dev/e`, a Worker in `../events-worker/`) | **None needed** — cookieless, no identifier, no IP |
| B | GA4 (`src/lib/ga.ts`) | **Explicit opt-in.** `gtag.js` is never injected until Accept |
| C | Read-only APIs (`../analytics/*.mjs`) | Server-side, no browser impact |

- **Quebec Law 25 is opt-in.** The banner (`src/components/ConsentBanner.tsx`) must name "Google
  Analytics", render in French for FR visitors, and keep **Refuse exactly as easy as Accept**.
- We gate by *not loading the script*, not by Consent Mode v2 — its `denied` state still pings Google.
- Layer A's lawfulness rests on storing nothing that identifies a person. **If you ever add a visitor
  ID to `/api/e`, it must move behind the gate.**
- Event storage is **Workers KV** (namespace `EVENTS_KV`), not Analytics Engine — the account
  returned code 10089 ("enable Analytics Engine") in a loop, and KV is free + ample at this volume.
- `VITE_GA4_ID` and `VITE_EVENTS_URL` are public and safe (set them in **Vercel** → Project →
  Settings → Environment Variables). The Worker's only secret is `STATS_BEARER`, set via
  `npx wrangler secret put` — **never** with a `VITE_` prefix (Vite inlines those into the public
  bundle). `CF_API_TOKEN` / `CF_ACCOUNT_ID` / `CF_SITE_TAG` are for `analytics/cf_rum.mjs` only and
  live in the local shell, not on the Worker.
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
