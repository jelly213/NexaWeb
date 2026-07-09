import { useEffect } from 'react';
import { track, type ScrollDepth } from '../lib/analytics';
import { onCalendlyBooked } from '../lib/calendly';

const SECTION_IDS = ['hero', 'problem', 'how-it-works', 'tech-stack', 'final-cta'] as const;
const DEPTHS: readonly ScrollDepth[] = [25, 50, 75, 100];

/**
 * Headless. This is a one-page site with no router, so a pageview-per-route model tells us
 * nothing — what a section actually reached, and how far someone scrolled, is the real signal.
 *
 * Renders nothing.
 */
export default function PageAnalytics() {
  useEffect(() => {
    // A ratio threshold can never fire on a section taller than the viewport (common on
    // mobile). Shrinking the root to a band across the viewport's middle means "this section
    // crossed the centre of the screen", which works at any height.
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          track({ name: 'section_view', section: entry.target.id });
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    const attached = new Set<string>();
    const attach = () => {
      for (const id of SECTION_IDS) {
        if (attached.has(id)) continue;
        const el = document.getElementById(id);
        if (el) {
          observer.observe(el);
          attached.add(id);
        }
      }
      return attached.size === SECTION_IDS.length;
    };

    // Four of the five sections are lazy-loaded, so they do not exist on first paint.
    let mutationObserver: MutationObserver | undefined;
    if (!attach()) {
      mutationObserver = new MutationObserver(() => {
        if (attach()) mutationObserver?.disconnect();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;
      for (const depth of DEPTHS) {
        if (pct >= depth) track({ name: 'scroll_depth', depth });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const offBooked = onCalendlyBooked(() => track({ name: 'call_booked' }));

    return () => {
      observer.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      offBooked();
    };
  }, []);

  return null;
}
