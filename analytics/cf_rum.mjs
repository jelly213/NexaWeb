#!/usr/bin/env node
/**
 * Cloudflare Web Analytics (RUM) — pageviews, visits, referrers, countries.
 *
 * Usage:  node analytics/cf_rum.mjs [--days 7]
 * Needs:  CF_API_TOKEN (Account · Account Analytics · Read), CF_ACCOUNT_ID, CF_SITE_TAG
 *
 * The wrangler OAuth token CANNOT do this — it has no analytics scope. Mint a dedicated
 * API token at https://dash.cloudflare.com/profile/api-tokens.
 *
 * `rumPageloadEventsAdaptiveGroups` is ACCOUNT-scoped (viewer.accounts, not viewer.zones),
 * which is why this works even though nexaweb.dev is served by Pages rather than a proxied zone.
 */

import { requireEnv } from './lib/env.mjs';

const GRAPHQL = 'https://api.cloudflare.com/client/v4/graphql';

function argDays() {
  const i = process.argv.indexOf('--days');
  const n = i === -1 ? 7 : Number(process.argv[i + 1]);
  return Number.isFinite(n) && n > 0 && n <= 90 ? Math.floor(n) : 7;
}

const QUERY = `
query Rum($accountTag: String!, $siteTag: String!, $since: Time!, $until: Time!) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      total: rumPageloadEventsAdaptiveGroups(
        filter: { siteTag: $siteTag, datetime_geq: $since, datetime_leq: $until }
        limit: 1
      ) {
        count
        sum { visits }
      }
      byReferrer: rumPageloadEventsAdaptiveGroups(
        filter: { siteTag: $siteTag, datetime_geq: $since, datetime_leq: $until }
        limit: 20
        orderBy: [count_DESC]
      ) {
        count
        dimensions { refererHost }
      }
      byCountry: rumPageloadEventsAdaptiveGroups(
        filter: { siteTag: $siteTag, datetime_geq: $since, datetime_leq: $until }
        limit: 20
        orderBy: [count_DESC]
      ) {
        count
        dimensions { countryName }
      }
    }
  }
}`;

async function main() {
  const [token, accountTag, siteTag] = requireEnv('CF_API_TOKEN', 'CF_ACCOUNT_ID', 'CF_SITE_TAG');
  const days = argDays();
  const until = new Date();
  const since = new Date(until.getTime() - days * 86400_000);

  const res = await fetch(GRAPHQL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        accountTag,
        siteTag,
        since: since.toISOString(),
        until: until.toISOString(),
      },
    }),
  });

  const body = await res.json();

  if (!res.ok) throw new Error(`Cloudflare API ${res.status}: ${JSON.stringify(body)}`);
  if (body.errors?.length) {
    // The most common cause by far is a token without Account Analytics:Read.
    throw new Error(`GraphQL errors: ${JSON.stringify(body.errors, null, 2)}`);
  }

  const account = body.data?.viewer?.accounts?.[0];
  if (!account) {
    console.log(JSON.stringify({ days, note: 'No account returned — check CF_ACCOUNT_ID.' }, null, 2));
    return;
  }

  console.log(
    JSON.stringify(
      {
        source: 'cloudflare_web_analytics',
        window_days: days,
        since: since.toISOString(),
        until: until.toISOString(),
        pageviews: account.total?.[0]?.count ?? 0,
        visits: account.total?.[0]?.sum?.visits ?? 0,
        top_referrers: (account.byReferrer ?? []).map(r => ({
          referrer: r.dimensions.refererHost || '(direct)',
          pageviews: r.count,
        })),
        top_countries: (account.byCountry ?? []).map(r => ({
          country: r.dimensions.countryName,
          pageviews: r.count,
        })),
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
