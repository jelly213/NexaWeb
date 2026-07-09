/**
 * POST /api/e — first-party, cookieless event sink.
 *
 * Same-origin by virtue of being a Pages Function, so `navigator.sendBeacon` reaches it with
 * no CORS preflight. Stores no IP, no cookie, no identifier — see src/lib/analytics.ts.
 *
 * Writes to Cloudflare Analytics Engine rather than KV: KV's free tier caps writes at ~1/sec
 * per key, and a `day + event` counter is exactly one hot key, so bursts would silently drop.
 */

interface AnalyticsEngineDataset {
  writeDataPoint(event: { indexes?: string[]; blobs?: string[]; doubles?: number[] }): void;
}

interface Env {
  AE: AnalyticsEngineDataset;
}

const ALLOWED_EVENTS = new Set([
  'cta_click',
  'section_view',
  'scroll_depth',
  'call_booked',
  'lang_toggle',
]);

interface Payload {
  n?: unknown;
  location?: unknown;
  section?: unknown;
  to?: unknown;
  depth?: unknown;
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.slice(0, 64) : '';
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  let payload: Payload;
  try {
    payload = (await context.request.json()) as Payload;
  } catch {
    return new Response(null, { status: 400 });
  }

  const name = str(payload.n);
  // Unknown names are dropped rather than rejected — a stale client should not see errors,
  // and an open sink is an invitation to fill our dataset with junk.
  if (!ALLOWED_EVENTS.has(name)) return new Response(null, { status: 204 });

  // One label per event type; blank when the event carries none.
  const label = str(payload.location) || str(payload.section) || str(payload.to);
  const depth = typeof payload.depth === 'number' ? payload.depth : 0;

  context.env.AE.writeDataPoint({
    indexes: [name],
    blobs: [name, label],
    doubles: [depth],
  });

  return new Response(null, { status: 204 });
};
