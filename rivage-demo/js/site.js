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
const POSTER_ALT = { fr: 'Terrain vague au bord du canal de Lachine', en: 'Empty lot on the Lachine Canal' };

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
  document.getElementById('poster-ch1').alt = POSTER_ALT[lang];
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
/* One continuous scrub: 4 clips × 80 frames = one virtual 320-frame sequence on a
   single pinned canvas. Consecutive clips share their boundary still (each was
   generated start_image→end_image off the same design), so the seams are cuts on
   near-identical frames. Frames load lazily in 80-frame chunks as the scrub
   approaches them. */
const SEG_DIRS = ['frames/ch1', 'frames/ch2', 'frames/ch3', 'frames/ch4'];
const SEG_FRAMES = 80;
const TOTAL_FRAMES = SEG_DIRS.length * SEG_FRAMES; // 320
const PIN_LENGTH = 8800; // px of scroll for the full 12 months (~27 px/frame)

const DPR_CAP = 2;

const storyEl = document.getElementById('story');
const cv = storyEl.querySelector('.chapter__canvas');
const ctx = cv.getContext('2d');
const loader = storyEl.querySelector('.chapter__loader');
const bar = storyEl.querySelector('.chapter__loader-bar');

const state = {
  frame: 0,                 // scrubbed global frame position (float, tweened by GSAP)
  frames: new Array(TOTAL_FRAMES).fill(null),
  loaded: 0,
  chunkStarted: [false, false, false, false],
  firstDrawn: false,
};

function fit() {
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  cv.width = Math.max(1, Math.round(storyEl.clientWidth * dpr));
  cv.height = Math.max(1, Math.round(storyEl.clientHeight * dpr));
}
fit();

/* Nearest ready frame at or before index — late or missing files never blank the
   canvas or throw. Returns null while nothing is loaded (poster stays visible). */
function frameAt(idx) {
  const want = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(idx)));
  for (let j = want; j >= 0; j--) {
    const f = state.frames[j];
    if (f && f.complete && f.naturalWidth > 0) return f;
  }
  return null;
}

/* Paint with an optional camera push-in (scale about the film's center).
   Landscape: cover-fit, centered, but never cropping more than OVERCROP beyond
   contain. Portrait: the FULL 16:9 frame, anchored just below the nav — captions
   and the brand block live in the dark area under the film (CSS mirrors the same
   geometry: NAV_H + 56.25vw). A raw cover-fit on phones showed a center slice. */
const OVERCROP = 1.15;
const NAV_H = 64; // css px — matches the fixed nav bar
function paint(img, alpha, scale) {
  const cw = cv.width;
  const ch = cv.height;
  const portrait = ch > cw;
  const cover = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const contain = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
  const base = portrait ? contain : Math.min(cover, contain * OVERCROP);
  const s = base * scale;
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  let y;
  if (portrait) {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const filmCenter = NAV_H * dpr + (img.naturalHeight * base) / 2;
    y = filmCenter - h / 2; // seam zoom breathes around the film's own center
  } else {
    y = (ch - h) / 2;
  }
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, (cw - w) / 2, y, w, h);
  ctx.globalAlpha = 1;
}

/* Seam transitions: the 4 clips meet at frames 80/160/240. Each pair was generated
   off the same boundary still, so the residual jump is only camera drift — hidden
   here with a scrubbed push-in zoom + crossfade: the outgoing clip freezes on its
   last frame while the incoming one fades over it, both zooming through the cut. */
const SEAM_SPAN = 8;   // frames of transition on each side of a seam
const SEAM_ZOOM = 0.14; // peak extra scale at the cut
const smooth = (t) => t * t * (3 - 2 * t);

function draw(pos) {
  pos = Math.max(0, Math.min(TOTAL_FRAMES - 1, pos));
  let seam = 0;
  for (let k = 1; k < SEG_DIRS.length; k++) {
    if (Math.abs(pos - k * SEG_FRAMES) < SEAM_SPAN) { seam = k * SEG_FRAMES; break; }
  }

  let outImg = null;
  let inImg = null;
  let mix = 0;
  let zoom = 1;
  if (!seam) {
    outImg = frameAt(pos);
  } else {
    const d = pos - seam; // -SPAN … +SPAN through the cut
    mix = smooth((d + SEAM_SPAN) / (2 * SEAM_SPAN));
    zoom = 1 + SEAM_ZOOM * smooth(1 - Math.abs(d) / SEAM_SPAN);
    outImg = frameAt(Math.min(pos, seam - 1));
    inImg = frameAt(Math.max(pos, seam));
  }
  if (!outImg) return; // nothing loaded yet — poster stays visible underneath

  /* The film no longer always covers the canvas (letterboxed on portrait), so
     paint the section background behind it — never let the cover-fit poster
     bleed through the bars. */
  ctx.fillStyle = '#1a1815';
  ctx.fillRect(0, 0, cv.width, cv.height);
  paint(outImg, 1, zoom);
  if (inImg && inImg !== outImg) paint(inImg, mix, zoom);

  if (!state.firstDrawn) {
    state.firstDrawn = true;
    gsap.to(loader, { autoAlpha: 0, duration: 0.4 });
  }
}

/* Lazy chunk loading — chunk 0 near page start, chunk k+1 as the scrub plays chunk k. */
function loadChunk(k) {
  if (k < 0 || k >= SEG_DIRS.length || state.chunkStarted[k]) return;
  state.chunkStarted[k] = true;
  for (let i = 0; i < SEG_FRAMES; i++) {
    const g = k * SEG_FRAMES + i;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      state.loaded++;
      bar.style.transform = `scaleX(${state.loaded / TOTAL_FRAMES})`;
      // repaint when the newly arrived frame is at (or just before) the scrub position
      if (state.loaded === 1 || Math.round(state.frame) >= g) draw(state.frame);
    };
    img.onerror = () => {}; // missing frame: skip silently, draw() falls back
    img.src = `${SEG_DIRS[k]}/f${String(i + 1).padStart(3, '0')}.webp`;
    state.frames[g] = img;
  }
}

/* Caption choreography in timeline units — the frame tween spans 0→40 (10 per clip).
   autoAlpha for BOTH directions — never mix with opacity-only. */
const CAPTION_WINDOWS = [
  ['#scroll-hint', 'out', 0.7],
  ['#brand', 'out', 0.9],
  ['#hero-scrim', 'out', 0.9],
  ['#cap-ch1', 'in', 3.2],
  ['#cap-ch1', 'out', 8.6],
  ['#cap-ch2', 'in', 11.6],
  ['#cap-ch2', 'out', 18.6],
  ['#cap-ch3', 'in', 21.6],
  ['#cap-ch3', 'out', 28.6],
  ['#cap-ch4', 'in', 31.2],
  ['#cap-ch4', 'out', 35.6],
  ['#cap-final', 'in', 37.4],
];

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: storyEl,
    start: 'top top',
    end: `+=${PIN_LENGTH}`,
    scrub: reduced ? true : 1.2,
    pin: true,
    onEnter: () => track('chapter_view', { chapter: 'ch1' }, 'c:ch1'),
  },
  defaults: { ease: 'none' },
});

tl.to(state, {
  frame: TOTAL_FRAMES - 1,
  duration: 40,
  onUpdate: () => {
    draw(state.frame);
    const seg = Math.min(SEG_DIRS.length - 1, Math.floor(state.frame / SEG_FRAMES));
    loadChunk(seg);
    loadChunk(seg + 1); // warm the next clip while this one plays
    if (seg > 0) track('chapter_view', { chapter: `ch${seg + 1}` }, `c:ch${seg + 1}`);
  },
}, 0);

for (const [sel, dir, at] of CAPTION_WINDOWS) {
  tl.to(sel, { autoAlpha: dir === 'in' ? 1 : 0, duration: dir === 'in' ? 0.5 : 0.4 }, at);
}

/* Hero-scrim tween starts from visible even after a mid-page reload */
gsap.set('#hero-scrim', { autoAlpha: 1 });

/* Chunk 0 loads near page start — after first paint so it never competes with LCP. */
requestAnimationFrame(() => requestAnimationFrame(() => loadChunk(0)));

/* No ScrollTrigger.refresh() on load: every layout is dimension-reserved (CLS 0),
   the pin is a fixed pixel length, and a late refresh would repaint the pinned h1
   and drag the measured LCP. ScrollTrigger's own resize handling covers the rest. */
window.addEventListener('resize', () => {
  fit();
  draw(state.frame);
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
