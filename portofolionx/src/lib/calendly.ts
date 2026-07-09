/**
 * The site's single conversion. Every CTA routes through here so that `cta_click` carries
 * a location and the booking itself is observable.
 */

import { track, type CtaLocation } from './analytics';

const CALENDLY_URL = 'https://calendly.com/contact-nexawebdev/partner-discovery-call';
const CALENDLY_ORIGIN = 'https://calendly.com';

function ensureWidgetCss(): void {
  if (document.querySelector('link[data-calendly]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://assets.calendly.com/assets/external/widget.css';
  link.dataset.calendly = '1';
  document.head.appendChild(link);
}

export function openCalendly(location: CtaLocation, language: 'EN' | 'FR'): void {
  track({ name: 'cta_click', location });
  ensureWidgetCss();
  const locale = language === 'FR' ? 'fr' : 'en';
  window.Calendly?.initPopupWidget({ url: `${CALENDLY_URL}?locale=${locale}` });
}

interface CalendlyMessage {
  event?: unknown;
}

/**
 * Calendly posts four events to the parent window; `calendly.event_scheduled` is the booking.
 * Other libraries post strings and arrays on this channel, so the shape is checked before
 * any property access.
 */
export function onCalendlyBooked(callback: () => void): () => void {
  const handler = (e: MessageEvent<unknown>): void => {
    if (e.origin !== CALENDLY_ORIGIN) return;
    if (typeof e.data !== 'object' || e.data === null) return;
    const { event } = e.data as CalendlyMessage;
    if (event === 'calendly.event_scheduled') callback();
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}
