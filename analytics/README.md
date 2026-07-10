# analytics/ — how the CRO agent reads real numbers

Four read-only scripts. No dependencies; Node 18+ only. Run them from `website/`.

```bash
node analytics/events.mjs --days 7     # our own events — cta_click, call_booked, …
node analytics/cf_rum.mjs  --days 7    # Cloudflare Web Analytics — pageviews, referrers
node analytics/gsc.mjs     --days 28   # Search Console — queries, impressions, position
node analytics/ga4.mjs     --days 28   # GA4 — consented visitors only
```

Each prints JSON to stdout and exits non-zero with a specific message when a credential is
missing. **A missing credential is a fact to report, not a reason to guess a number.**

## Which source answers which question

| Question | Script | Why |
|---|---|---|
| How many people saw the page? | `cf_rum` | Fires for everyone, cookieless |
| How many clicked a CTA? Which one? | `events` | `cta_click` carries `hero`/`nav`/`footer`/`final` |
| How many booked a call? | `events` | `call_booked`, from Calendly's `event_scheduled` |
| How far do people scroll? | `events` | `scroll_depth`, `section_view` |
| What do people search to find us? | `gsc` | The only source for query terms |
| Funnel / attribution detail | `ga4` | Consented subset only |

### The denominator trap

GA4 only sees visitors who clicked **Accept**. Cloudflare and `events` see everyone. Dividing a
GA4 numerator by a Cloudflare denominator produces a number that describes nobody. For any rate,
use `events.mjs` alone — it is one consistent population.

## Credentials

`*` marks the ones **only the operator can create** — they need an authenticated Google or
Cloudflare session.

### Cloudflare

| Var | How |
|---|---|
| `CF_ACCOUNT_ID` | `c03d3d92284dac3986c4e79fec1ba417` (from `npx wrangler whoami`) |
| `CF_API_TOKEN` * | https://dash.cloudflare.com/profile/api-tokens → Create Custom Token → **Account · Account Analytics · Read** |
| `CF_SITE_TAG` * | Web Analytics → the `nexaweb.dev` site → **Manage site → Advanced Options**. (Already enabled; don't create a second site for `nexaweb-czn.pages.dev`.) |
| `STATS_BEARER` * | Any long random string. Set it as a **Worker secret** *and* export it locally. |

The `wrangler` OAuth token **cannot** read analytics. Its scopes are `account:read, user:read,
workers:*, workers_tail:read` — `account:read` is account *metadata*, not analytics. A dedicated
API token is required.

### Where the sink lives

`nexaweb.dev` is hosted on **Vercel**. The beacon is a standalone Cloudflare Worker,
`website/events-worker/` → `events.nexaweb.dev`, and it stores events in **Workers KV** (namespace
`EVENTS_KV`, id `2adcfe78f2a3495ebbf715dbc914807f`). It reads/writes KV directly, so the only
secret it needs is `STATS_BEARER`:

```bash
cd ../events-worker
npx wrangler secret put STATS_BEARER   # the same value you export locally for events.mjs
npx wrangler deploy
```

`CF_API_TOKEN`, `CF_ACCOUNT_ID` and `CF_SITE_TAG` are **not** used by the Worker. They belong to
`cf_rum.mjs` only (reading Cloudflare Web Analytics), and stay in your local shell.

> **Never give these a `VITE_` prefix.** Vite inlines every `VITE_*` value into the public client
> bundle, which would publish the secret to anyone who opens devtools. Only `VITE_GA4_ID` and
> `VITE_EVENTS_URL` are safe there — and those go in **Vercel's** env vars, not Cloudflare's.

### Google (both scripts share one service account)

1. * Create a GCP project, then a **service account**, then a **JSON key**. Save it outside the
   repo and point `GOOGLE_APPLICATION_CREDENTIALS` at the file path.
2. * Enable both APIs:
   - https://console.cloud.google.com/apis/library/searchconsole.googleapis.com
   - https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com
3. * **Search Console:** verify `nexaweb.dev` (DNS TXT), then Settings → Users and permissions →
   add the service-account email as a **delegated owner**. A key alone gets you a 403.
   Set `GSC_SITE_URL` to exactly the property string — `sc-domain:nexaweb.dev` for a Domain
   property, or `https://nexaweb.dev/` for a URL-prefix property. They are not interchangeable.
4. * **GA4:** create the property, take the Measurement ID (`G-…`) → `VITE_GA4_ID` (Pages env var),
   take the numeric Property ID → `GA4_PROPERTY_ID`. Admin → Property Access Management → add the
   service-account email as **Viewer**.

Until `VITE_GA4_ID` is set, GA4 is dead code, the consent banner does not render, and the
cookieless layers keep working. That is a safe, lawful default — not a broken state.

### Local shell

```bash
export CF_ACCOUNT_ID=c03d3d92284dac3986c4e79fec1ba417
export CF_API_TOKEN=…
export CF_SITE_TAG=…
export STATS_BEARER=…
export GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/service-account.json
export GSC_SITE_URL=sc-domain:nexaweb.dev
export GA4_PROPERTY_ID=…
```

On Windows PowerShell use `$env:CF_API_TOKEN = '…'`.

## Law 25

The cookieless layers (Cloudflare Web Analytics, `/api/e`) store no cookie, no identifier, no IP,
no fingerprint, so they run without consent. GA4 does not: `gtag.js` is never injected until the
visitor clicks Accept.

If anyone ever adds a visitor ID to `/api/e`, that legal position collapses and the beacon has to
move behind the gate. See `system/agents/cro.md`.
