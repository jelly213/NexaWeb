#!/usr/bin/env node
/**
 * First-party event stream — cta_click, section_view, scroll_depth, call_booked, lang_toggle.
 *
 * Usage:  node analytics/events.mjs [--days 7]
 * Needs:  STATS_BEARER, STATS_URL (defaults to https://events.nexaweb.dev/stats)
 *
 * The sink is a standalone Cloudflare Worker (`website/events-worker/`), not a route on the
 * site — nexaweb.dev is hosted on Vercel, and Analytics Engine only accepts Cloudflare bindings.
 *
 * THIS is the source you compute conversion rates from. It fires for every visitor, consented
 * or not. GA4 only ever sees the subset who clicked Accept, so a GA4 numerator over a
 * Cloudflare denominator is a meaningless ratio.
 */

import { requireEnv } from './lib/env.mjs';

function argDays() {
  const i = process.argv.indexOf('--days');
  const n = i === -1 ? 7 : Number(process.argv[i + 1]);
  return Number.isFinite(n) && n > 0 && n <= 90 ? Math.floor(n) : 7;
}

async function main() {
  const [bearer] = requireEnv('STATS_BEARER');
  const base = process.env.STATS_URL ?? 'https://events.nexaweb.dev/stats';
  const days = argDays();

  const res = await fetch(`${base}?days=${days}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });

  if (res.status === 401) throw new Error('401 Unauthorized — STATS_BEARER does not match the Pages secret.');
  if (!res.ok) throw new Error(`${base} returned ${res.status}: ${await res.text()}`);

  const raw = await res.json();
  const rows = raw.data ?? [];

  const byEvent = {};
  for (const row of rows) {
    const count = Number(row.count ?? 0);
    byEvent[row.event] ??= { total: 0, by_label: {} };
    byEvent[row.event].total += count;
    if (row.label) byEvent[row.event].by_label[row.label] = count;
  }

  const clicks = byEvent.cta_click?.total ?? 0;
  const booked = byEvent.call_booked?.total ?? 0;

  console.log(
    JSON.stringify(
      {
        source: 'first_party_events',
        window_days: days,
        events: byEvent,
        // Ratio of booking to intent. Not a site conversion rate — that needs the Cloudflare
        // pageview count as a denominator, and these two sources sample differently.
        click_to_book:
          clicks > 0 ? `${booked}/${clicks} (${((booked / clicks) * 100).toFixed(1)}%)` : 'no cta_click events yet',
      },
      null,
      2,
    ),
  );
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
