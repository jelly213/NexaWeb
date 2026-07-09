#!/usr/bin/env node
/**
 * Google Search Console — the search queries a vetting prospect uses to find you.
 *
 * Usage:  node analytics/gsc.mjs [--days 28]
 * Needs:  GOOGLE_APPLICATION_CREDENTIALS (service-account JSON), GSC_SITE_URL
 *
 * The service account must be added as a delegated OWNER of the property in
 * Search Console → Settings → Users and permissions. A key alone is not enough.
 *
 * Data has a 16-month window but lags ~2 days; asking for "yesterday" usually returns nothing.
 */

import { getAccessToken } from './lib/google-auth.mjs';
import { requireEnv } from './lib/env.mjs';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

function argDays() {
  const i = process.argv.indexOf('--days');
  const n = i === -1 ? 28 : Number(process.argv[i + 1]);
  return Number.isFinite(n) && n > 0 && n <= 480 ? Math.floor(n) : 28;
}

const iso = d => d.toISOString().slice(0, 10);
const rowsEmpty = rows => rows.length === 0;

async function query(token, siteUrl, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        `403 from Search Console. The service account is authenticated but not authorised on ${siteUrl}. ` +
          'Add its email as a delegated owner in GSC → Settings → Users and permissions.',
      );
    }
    throw new Error(`Search Console ${res.status}: ${JSON.stringify(json)}`);
  }
  return json.rows ?? [];
}

async function main() {
  const [siteUrl] = requireEnv('GSC_SITE_URL');
  const token = await getAccessToken(SCOPE);
  const days = argDays();

  // Two days of lag; asking past it just returns an empty tail.
  const endDate = iso(new Date(Date.now() - 2 * 86400_000));
  const startDate = iso(new Date(Date.now() - (days + 2) * 86400_000));

  const shared = { startDate, endDate, rowLimit: 25 };
  const [queries, pages] = await Promise.all([
    query(token, siteUrl, { ...shared, dimensions: ['query'] }),
    query(token, siteUrl, { ...shared, dimensions: ['page'] }),
  ]);

  const shape = rows =>
    rows.map(r => ({
      key: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: `${(r.ctr * 100).toFixed(2)}%`,
      position: r.position.toFixed(1),
    }));

  console.log(
    JSON.stringify(
      {
        source: 'google_search_console',
        site: siteUrl,
        start_date: startDate,
        end_date: endDate,
        note: rowsEmpty(queries) ? 'No rows. Either the property is newly verified, or nobody is finding this site via search — which is expected for a cold-email business.' : undefined,
        top_queries: shape(queries),
        top_pages: shape(pages),
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
