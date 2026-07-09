/**
 * GET /api/stats?days=7 — what the CRO agent reads.
 *
 * Bearer-protected. STATS_BEARER, CF_API_TOKEN and CF_ACCOUNT_ID are Pages *encrypted* env
 * vars. None of them may ever be given a VITE_ prefix: that would inline the secret into the
 * public client bundle.
 */

interface Env {
  STATS_BEARER: string;
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
}

const DATASET = 'nexaweb_events';

export const onRequestGet = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  const auth = request.headers.get('Authorization');
  if (!env.STATS_BEARER || auth !== `Bearer ${env.STATS_BEARER}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const raw = Number(url.searchParams.get('days'));
  const days = Number.isFinite(raw) && raw > 0 && raw <= 90 ? Math.floor(raw) : 7;

  const sql = `
    SELECT blob1 AS event, blob2 AS label, SUM(_sample_interval) AS count
    FROM ${DATASET}
    WHERE timestamp > NOW() - INTERVAL '${days}' DAY
    GROUP BY event, label
    ORDER BY count DESC
    FORMAT JSON
  `;

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/analytics_engine/sql`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` },
      body: sql,
    },
  );

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'analytics_engine_query_failed', status: res.status }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(res.body, {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
