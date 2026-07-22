/**
 * RIVAGE — site behaviour. No build step: vendored GSAP / ScrollTrigger / Lenis are
 * loaded as classic scripts before this module and expose globals.
 *
 * Core: a config-driven, 4-chapter scroll-scrubbed construction story. Each chapter
 * is a pinned 100vh section with its own <canvas>; scrolling scrubs through a
 * pre-extracted frame sequence (frames/chN/f001.webp … f080.webp). Frames may be
 * absent (asset drop comes later): every draw call is guarded, so the engine never
 * crashes — posters and captions still work.
 */

import { copy, leaf } from './copy.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;

gsap.registerPlugin(ScrollTrigger);
history.scrollRestoration = 'manual';
document.documentElement.classList.add('js');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  && !new URLSearchParams(location.search).has('motion');

/* ==================== analytics (first-party, cookieless — same sink as nexaweb.dev) ==================== */
const ENDPOINT = 'https://events.nexaweb.dev/e';
const fired = new Set();
function track(name, props = {}, once) {
  if (once) {
    if (fired.has(once)) return;
    fired.add(once);
  }
  const body = JSON.stringify({ n: name, site: 'rivage', ...props });
  const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
  if (!navigator.sendBeacon || !navigator.sendBeacon(ENDPOINT, blob)) {
    void fetch(ENDPOINT, { method: 'POST', body, keepalive: true, mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=UTF-8' } }).catch(() => {});
  }
}

/* ==================== i18n ==================== */
let lang = localStorage.getItem('rivage-lang') || 'fr';
if (lang !== 'fr' && lang !== 'en') lang = 'fr';

const UNIT_IMG_IDS = ['u-0', 'u-1', 'u-2'];
const POSTER_ALTS = [
  { fr: 'Terrain vague au bord du canal de Lachine', en: 'Empty lot on the Lachine Canal' },
  { fr: 'Structure de béton en construction', en: 'Concrete structure under construction' },
  { fr: 'Façades et finitions de la résidence', en: 'Façades and finishes of the residence' },
  { fr: 'Rivage terminé au crépuscule, fenêtres allumées', en: 'Rivage complete at dusk, windows lit' },
];

function render() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-copy]').forEach((el) => {
    const l = leaf(el.dataset.copy);
    if (l) el.textContent = l[lang];
  });
  const toggle = document.getElementById('lang-toggle');
  toggle.textContent = lang === 'fr' ? 'EN' : 'FR';
  document.title = copy.meta.title[lang];
  copy.residences.units.forEach((u, i) => {
    const img = document.getElementById(UNIT_IMG_IDS[i]);
    if (img) img.alt = u.name[lang];
  });
  POSTER_ALTS.forEach((alt, i) => {
    const img = document.getElementById(`poster-ch${i + 1}`);
    if (img) img.alt = alt[lang];
  });
}
render();

document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('rivage-lang', lang);
  render();
  track('lang_toggle', { to: lang.toUpperCase() });
});

/* ==================== smooth scroll (inertia skipped under reduced motion) ==================== */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', () => lenis.resize());
}

/* ==================== story engine ==================== */
/* Chapter config — `count` frames named f001.webp…f{count}.webp inside `dir`,
   `pin` is the scroll distance (px) the chapter stays pinned. */
const CHAPTERS = [
  { id: 'ch1', dir: 'frames/ch1', count: 80, pin: 2400 },
  { id: 'ch2', dir: 'frames/ch2', count: 80, pin: 2400 },
  { id: 'ch3', dir: 'frames/ch3', count: 80, pin: 2400 },
  { id: 'ch4', dir: 'frames/ch4', count: 80, pin: 2400 },
];

const DPR_CAP = 2;

function createChapter(cfg) {
  const el = document.getElementById(cfg.id);
  const cv = el.querySelector('.chapter__canvas');
  const ctx = cv.getContext('2d');
  const loader = el.querySelector('.chapter__loader');
  const bar = el.querySelector('.chapter__loader-bar');

  const state = {
    frame: 0,        // scrubbed frame position (float, tweened by GSAP)
    frames: [],      // Image objects, filled once load() runs
    loaded: 0,
    started: false,  // load() called
    firstDrawn: false,
  };

  function fit() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    cv.width = Math.max(1, Math.round(el.clientWidth * dpr));
    cv.height = Math.max(1, Math.round(el.clientHeight * dpr));
  }
  fit();

  /* Cover-fit draw, centered. Guarded twice over: bail while no frame is ready,
     and fall back to the nearest earlier loaded frame so late/missing files never
     blank the canvas or throw. */
  function draw(idx) {
    const want = Math.max(0, Math.min(cfg.count - 1, Math.round(idx)));
    let img = null;
    for (let j = want; j >= 0; j--) {
      const f = state.frames[j];
      if (f && f.complete && f.naturalWidth > 0) { img = f; break; }
    }
    if (!img) return; // nothing loaded yet — poster stays visible underneath
    const cw = cv.width;
    const ch = cv.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    if (!state.firstDrawn) {
      state.firstDrawn = true;
      gsap.to(loader, { autoAlpha: 0, duration: 0.4 });
    }
  }

  /* Lazy frame loading — called near page start for ch1, and for chN+1 when chN's
     pin begins or the section comes within 1.5 viewports. */
  function load() {
    if (state.started) return;
    state.started = true;
    for (let i = 0; i < cfg.count; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        state.loaded++;
        bar.style.transform = `scaleX(${state.loaded / cfg.count})`;
        // repaint when the newly arrived frame is at (or just before) the scrub position
        if (state.loaded === 1 || Math.round(state.frame) >= i) draw(state.frame);
      };
      img.onerror = () => {}; // missing frame: skip silently, draw() falls back
      img.src = `${cfg.dir}/f${String(i + 1).padStart(3, '0')}.webp`;
      state.frames.push(img);
    }
  }

  return { cfg, el, state, fit, draw, load };
}

const chapters = CHAPTERS.map(createChapter);

/* Caption choreography per chapter, in timeline units (frame tween spans 0→10).
   autoAlpha for BOTH directions — never mix with opacity-only. */
const CAPTION_WINDOWS = {
  ch1: [
    ['#brand', 'out', 0.9],
    ['#scroll-hint', 'out', 0.7],
    ['#cap-ch1', 'in', 3.2],
    ['#cap-ch1', 'out', 8.4],
  ],
  ch2: [
    ['#cap-ch2', 'in', 1.4],
    ['#cap-ch2', 'out', 8.4],
  ],
  ch3: [
    ['#cap-ch3', 'in', 1.4],
    ['#cap-ch3', 'out', 8.4],
  ],
  ch4: [
    ['#cap-ch4', 'in', 1.0],
    ['#cap-ch4', 'out', 5.4],
    ['#cap-final', 'in', 6.8],
  ],
};

chapters.forEach((ch, k) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ch.el,
      start: 'top top',
      end: `+=${ch.cfg.pin}`,
      scrub: reduced ? true : 1.2,
      pin: true,
      onEnter: () => {
        track('chapter_view', { chapter: ch.cfg.id }, `c:${ch.cfg.id}`);
        ch.load();
        if (chapters[k + 1]) chapters[k + 1].load(); // next chapter starts loading when this pin begins
      },
    },
    defaults: { ease: 'none' },
  });

  tl.to(ch.state, { frame: ch.cfg.count - 1, duration: 10, onUpdate: () => ch.draw(ch.state.frame) }, 0);

  for (const [sel, dir, at] of CAPTION_WINDOWS[ch.cfg.id] || []) {
    tl.to(sel, { autoAlpha: dir === 'in' ? 1 : 0, duration: dir === 'in' ? 0.5 : 0.4 }, at);
  }

  /* Early-warmup trigger: start loading when the chapter is within 1.5 viewports
     of the bottom edge ('top 250%' = section top at 2.5× viewport height). */
  if (k > 0) {
    ScrollTrigger.create({
      trigger: ch.el,
      start: 'top 250%',
      once: true,
      onEnter: () => ch.load(),
    });
  }
});

/* Chapter 1 loads near page start — after first paint so it never competes with LCP. */
requestAnimationFrame(() => requestAnimationFrame(() => chapters[0].load()));

/* No ScrollTrigger.refresh() on load: every layout is dimension-reserved (CLS 0),
   pins are fixed pixel lengths, and a late refresh would repaint the pinned h1
   and drag the measured LCP. ScrollTrigger's own resize handling covers the rest. */
window.addEventListener('resize', () => {
  for (const ch of chapters) {
    ch.fit();
    ch.draw(ch.state.frame);
  }
});

/* ==================== anchor navigation (must go through Lenis — native jumps misplace against pin spacers) ==================== */
function scrollToHash(hash, immediate) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -64, immediate });
  else el.scrollIntoView();
}
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href.length < 2) return;
    e.preventDefault();
    history.pushState(null, '', href);
    scrollToHash(href, false);
  });
});
window.addEventListener('load', () => {
  if (location.hash) scrollToHash(location.hash, true);
});

/* ==================== below-the-fold reveals + section tracking ==================== */
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealIO.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

/* Safety net: anything at or above the viewport must never stay hidden — deep links and
   fast jumps teleport PAST elements, so the observer never sees them intersect. */
function sweepReveals() {
  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-visible');
      revealIO.unobserve(el);
    }
  });
}
let sweepQueued = false;
window.addEventListener('scroll', () => {
  if (sweepQueued) return;
  sweepQueued = true;
  setTimeout(() => { sweepQueued = false; sweepReveals(); }, 120);
}, { passive: true });
window.addEventListener('load', sweepReveals);

const sectionIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) track('section_view', { section: e.target.id }, `s:${e.target.id}`);
    }
  },
  { threshold: 0.35 }
);
document.querySelectorAll('main section[id]:not(.chapter)').forEach((el) => sectionIO.observe(el));

/* ==================== nav state ==================== */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ==================== lead form (demo: no backend, tracked as conversion) ==================== */
const form = document.getElementById('lead-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (!String(data.get('name')).trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(data.get('email')))) {
    form.reportValidity();
    return;
  }
  document.getElementById('form-success').hidden = false;
  form.querySelector('button[type="submit"]').disabled = true;
  track('cta_click', { location: 'rivage_lead' });
});

/* ==================== CTA tracking ==================== */
document.getElementById('demo-badge').addEventListener('click', () => track('cta_click', { location: 'rivage_badge' }));
document.getElementById('nexa-cta').addEventListener('click', () => track('cta_click', { location: 'rivage_nexa' }));
document.getElementById('story-cta').addEventListener('click', () => track('cta_click', { location: 'rivage_story' }));
