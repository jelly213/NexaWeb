#!/usr/bin/env node
/**
 * GA4 — Google Analytics Data API v1beta, properties.runReport.
 *
 * Usage:  node analytics/ga4.mjs [--days 28]
 * Needs:  GOOGLE_APPLICATION_CREDENTIALS (service-account JSON), GA4_PROPERTY_ID
 *
 * The service account must be added as a Viewer under GA4 Admin → Property Access Management.
 *
 * ⚠️  CONSENTED VISITORS ONLY. gtag.js is not injected until someone clicks Accept on the
 * Law 25 banner, so every number here describes a self-selected subset. Never divide a GA4
 * count by a Cloudflare pageview count. For rates, use analytics/events.mjs.
 */

import { getAccessToken } from './lib/google-auth.mjs';
import { requireEnv } from './lib/env.mjs';

const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

function argDays() {
  const i = process.argv.indexOf('--days');
  const n = i === -1 ? 28 : Number(process.argv[i + 1]);
  return Number.isFinite(n) && n > 0 && n <= 365 ? Math.floor(n) : 28;
}

async function main() {
  const [propertyId] = requireEnv('GA4_PROPERTY_ID');
  const token = await getAccessToken(SCOPE);
  const days = argDays();

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 50,
      }),
    },
  );

  const json = await res.json();
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        `403 from GA4. Add the service-account email as a Viewer on property ${propertyId} ` +
          '(GA4 Admin → Property Access Management).',
      );
    }
    throw new Error(`GA4 Data API ${res.status}: ${JSON.stringify(json)}`);
  }

  const rows = (json.rows ?? []).map(r => ({
    event: r.dimensionValues[0].value,
    count: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
  }));

  console.log(
    JSON.stringify(
      {
        source: 'ga4',
        property: propertyId,
        window_days: days,
        population: 'CONSENTED VISITORS ONLY — not the full audience. Do not use as a denominator.',
        events: rows,
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
