/**
 * nexaweb-events — first-party, cookieless event sink for nexaweb.dev.
 *
 * The site runs on Vercel; this Worker runs on Cloudflare. Storage is **Workers KV**, not
 * Analytics Engine: at this site's volume (a few visits a day) KV is free, simpler, and the
 * per-key write ceiling that would matter at scale never comes close.
 *
 * Stores no cookie, no identifier, no IP, no fingerprint — only per-day counters. That is what
 * lets it run without consent under Quebec Law 25. If anyone ever adds a visitor ID, it must
 * move behind the consent gate.
 *
 *   POST /e      → record an event. 204. Open to the site's origins.
 *   GET  /stats  → aggregate read for the CRO agent. Bearer-protected.
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { metadata?: unknown; expirationTtl?: number }): Promise<void>;
  list(options?: { prefix?: string; cursor?: string; limit?: number }): Promise<{
    keys: { name: string; metadata?: unknown }[];
    list_complete: boolean;
    cursor?: string;
  }>;
}

interface Env {
  EVENTS_KV: KVNamespace;
  STATS_BEARER: string;
}

// Keep raw day-counters for ~4 months, then let KV expire them so the store never grows forever.
const KEY_TTL_SECONDS = 60 * 60 * 24 * 120;

const ALLOWED_ORIGINS = new Set([
  'https://nexaweb.dev',
  'https://www.nexaweb.dev',
  'https://story.nexaweb.dev',
  'http://localhost:5173',
  'http://localhost:4173',
]);

const ALLOWED_EVENTS = new Set([
  'cta_click',
  'section_view',
  'scroll_depth',
  'booking_step',
  'call_booked',
  'lang_toggle',
]);

interface Payload {
  n?: unknown;
  location?: unknown;
  section?: unknown;
  to?: unknown;
  step?: unknown;
  depth?: unknown;
}

interface KeyMeta {
  count: number;
  event: string;
  label: string;
  day: number;
}

const str = (v: unknown): string => (typeof v === 'string' ? v.slice(0, 64) : '');
const dayNumber = (ts: number): number => Math.floor(ts / 86_400_000);

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

async function handleEvent(request: Request, env: Env): Promise<Response> {
  const cors = corsHeaders(request.headers.get('Origin'));

  let payload: Payload;
  try {
    payload = JSON.parse(await request.text()) as Payload;
  } catch {
    return new Response(null, { status: 400, headers: cors });
  }

  const name = str(payload.n);
  // Unknown names are dropped, not rejected: a stale client should not see errors, and an open
  // sink is an invitation to fill the store with junk.
  if (!ALLOWED_EVENTS.has(name)) return new Response(null, { status: 204, headers: cors });

  let label = str(payload.location) || str(payload.section) || str(payload.to) || str(payload.step);
  if (name === 'scroll_depth' && typeof payload.depth === 'number') label = String(payload.depth);

  const day = dayNumber(Date.now());
  const key = `e:${day}:${name}:${label}`;

  // Read-modify-write. Two truly simultaneous writes to the same key could drop one increment,
  // but at this traffic that is effectively impossible — and a lost tick is not worth a heavier store.
  const current = await env.EVENTS_KV.get(key);
  const count = (current ? parseInt(current, 10) : 0) + 1;
  const metadata: KeyMeta = { count, event: name, label, day };
  await env.EVENTS_KV.put(key, String(count), { metadata, expirationTtl: KEY_TTL_SECONDS });

  return new Response(null, { status: 204, headers: cors });
}

async function handleStats(request: Request, env: Env): Promise<Response> {
  if (!env.STATS_BEARER || request.headers.get('Authorization') !== `Bearer ${env.STATS_BEARER}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const raw = Number(new URL(request.url).searchParams.get('days'));
  const days = Number.isFinite(raw) && raw > 0 && raw <= 90 ? Math.floor(raw) : 7;
  const minDay = dayNumber(Date.now()) - (days - 1);

  // Counts live in each key's metadata, so one list() sweep aggregates everything with no per-key gets.
  const agg: Record<string, { event: string; label: string; count: number }> = {};
  let cursor: string | undefined;
  do {
    const res = await env.EVENTS_KV.list({ prefix: 'e:', cursor });
    for (const k of res.keys) {
      const m = k.metadata as KeyMeta | undefined;
      if (!m || typeof m.day !== 'number' || m.day < minDay) continue;
      const id = `${m.event}::${m.label}`;
      agg[id] ??= { event: m.event, label: m.label, count: 0 };
      agg[id].count += m.count;
    }
    cursor = res.list_complete ? undefined : res.cursor;
  } while (cursor);

  const data = Object.values(agg).sort((a, b) => b.count - a.count);

  return new Response(JSON.stringify({ meta: { window_days: days }, data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin')) });
    }
    if (request.method === 'POST' && pathname === '/e') return handleEvent(request, env);
    if (request.method === 'GET' && pathname === '/stats') return handleStats(request, env);

    return new Response('Not found', { status: 404 });
  },
};
