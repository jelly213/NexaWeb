/**
 * Layer B — Google Analytics 4, behind the consent gate.
 *
 * This is the ONLY file allowed to touch gtag/dataLayer. Nothing here runs, and no byte
 * reaches a Google server, until ConsentContext calls `loadGtag()` after an explicit Accept.
 *
 * Why not Consent Mode v2: its `denied` state still sends cookieless pings to Google. Under
 * Quebec's Law 25 that is arguably still a transfer, and it breaks the promise the banner
 * makes — that nothing fires before a choice. So we gate the script tag itself.
 */

const MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA4_ID;

/** Without a Measurement ID there is nothing to load, and the banner should not claim otherwise. */
export function isGaConfigured(): boolean {
  return typeof MEASUREMENT_ID === 'string' && MEASUREMENT_ID.startsWith('G-');
}

let loaded = false;

export function loadGtag(): void {
  if (loaded || !isGaConfigured() || typeof document === 'undefined') return;
  loaded = true;

  window.dataLayer = window.dataLayer ?? [];
  // gtag.js identifies a command by `Object.prototype.toString.call(item) === '[object Arguments]'`.
  // Pushing a rest array would stringify as '[object Array]' and be read as a variable push, not a
  // command — so `arguments` is load-bearing here, not a style choice.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer?.push(arguments); };

  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: true });

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(s);
}

export function gtagEvent(name: string, params: Record<string, unknown>): void {
  window.gtag?.('event', name, params);
}
