/**
 * Layer A — first-party, cookieless event stream.
 *
 * Fires for every visitor, with or without consent. That is only lawful because it stores no
 * cookie, no identifier, no IP, and nothing that could re-identify a person across requests.
 * If you ever add a visitor id here, this stops being true and the whole module has to move
 * behind the consent gate. See system/agents/cro.md.
 *
 * Layer B (GA4) is mirrored from here, but only once the visitor has explicitly accepted.
 */

import { gtagEvent } from './ga';

// The site is hosted on Vercel; the sink is a Cloudflare Worker (Analytics Engine only accepts
// writes through a Cloudflare binding). So this is a cross-origin POST. Override per-environment
// with VITE_EVENTS_URL; see website/events-worker/.
const ENDPOINT = import.meta.env.VITE_EVENTS_URL ?? 'https://events.nexaweb.dev/e';

// text/plain keeps this a CORS "simple request", so the browser sends it straight through with
// no preflight. application/json would trigger an OPTIONS round-trip that sendBeacon cannot make.
const CONTENT_TYPE = 'text/plain;charset=UTF-8';

export type CtaLocation = 'hero' | 'nav' | 'footer' | 'final';
export type ScrollDepth = 25 | 50 | 75 | 100;

export type AnalyticsEvent =
  | { name: 'cta_click'; location: CtaLocation }
  | { name: 'section_view'; section: string }
  | { name: 'scroll_depth'; depth: ScrollDepth }
  | { name: 'call_booked' }
  | { name: 'lang_toggle'; to: 'EN' | 'FR' };

let gaConsent = false;

/** Called by ConsentContext. Keeps this module free of any React import. */
export function setGaConsent(granted: boolean): void {
  gaConsent = granted;
}

/**
 * Deduped once per page load. Guards against React StrictMode's double-invoke in dev and
 * against an IntersectionObserver re-firing on a section the visitor scrolls past twice.
 */
const fired = new Set<string>();

function dedupeKey(e: AnalyticsEvent): string | null {
  if (e.name === 'section_view') return `section_view:${e.section}`;
  if (e.name === 'scroll_depth') return `scroll_depth:${e.depth}`;
  if (e.name === 'call_booked') return 'call_booked';
  return null; // cta_click and lang_toggle are legitimately repeatable
}

function send(body: string): void {
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: CONTENT_TYPE });
    if (navigator.sendBeacon(ENDPOINT, blob)) return;
  }
  // keepalive lets the request outlive a page that is unloading, which sendBeacon
  // gives us for free and plain fetch does not.
  void fetch(ENDPOINT, {
    method: 'POST',
    body,
    keepalive: true,
    mode: 'cors',
    headers: { 'Content-Type': CONTENT_TYPE },
  }).catch(() => {
    /* analytics must never break the page */
  });
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  const key = dedupeKey(event);
  if (key !== null) {
    if (fired.has(key)) return;
    fired.add(key);
  }

  const { name, ...props } = event;
  send(JSON.stringify({ n: name, ...props }));

  if (gaConsent) {
    gtagEvent(name, props);
  }
}
