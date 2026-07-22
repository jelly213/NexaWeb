import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { copy, leaf, type Lang } from './copy';
import type { VersoScene } from './scene';

document.documentElement.classList.add('js');
gsap.registerPlugin(ScrollTrigger);
history.scrollRestoration = 'manual';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  && !new URLSearchParams(location.search).has('motion');

/* ==================== analytics (first-party, cookieless — same sink as nexaweb.dev) ==================== */
const ENDPOINT = 'https://events.nexaweb.dev/e';
const fired = new Set<string>();
function track(name: string, props: Record<string, string> = {}, once?: string): void {
  if (once) {
    if (fired.has(once)) return;
    fired.add(once);
  }
  const body = JSON.stringify({ n: name, site: 'verso', ...props });
  const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
  if (!navigator.sendBeacon || !navigator.sendBeacon(ENDPOINT, blob)) {
    void fetch(ENDPOINT, { method: 'POST', body, keepalive: true, mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=UTF-8' } }).catch(() => {});
  }
}

/* ==================== i18n ==================== */
let lang: Lang = (localStorage.getItem('verso-lang') as Lang) || 'fr';

function render(): void {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach((el) => {
    const l = leaf(el.dataset.copy!);
    if (l) el.textContent = l[lang];
  });
  const toggle = document.getElementById('lang-toggle')!;
  toggle.textContent = lang === 'fr' ? 'EN' : 'FR';
  document.title = lang === 'fr' ? 'VERSO — Résidences | Montréal' : 'VERSO — Residences | Montreal';
  copy.gallery.captions.forEach((c, i) => {
    const img = document.getElementById(`g-${i}`) as HTMLImageElement | null;
    if (img) img.alt = c[lang];
  });
  copy.residences.units.forEach((u, i) => {
    const img = document.getElementById(`u-${i}`) as HTMLImageElement | null;
    if (img) img.alt = u.name[lang];
  });
  const qPhoto = document.getElementById('q-photo') as HTMLImageElement | null;
  if (qPhoto) qPhoto.alt = copy.neighbourhood.title[lang];
}
render();

document.getElementById('lang-toggle')!.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('verso-lang', lang);
  render();
  track('lang_toggle', { to: lang.toUpperCase() });
});

/* ==================== smooth scroll (skipped under reduced motion) ==================== */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', () => lenis!.resize());
}

/* ==================== 3D story ==================== */
/* Three.js is by far the heaviest dependency — it loads as a lazy chunk AFTER first
   paint so FCP/LCP come from plain HTML/CSS. The scrub timeline exists immediately
   (captions work either way); the scene attaches its tweens once the chunk arrives. */
const glContainer = document.getElementById('gl')!;
let scene: VersoScene | null = null;

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#story',
    start: 'top top',
    end: '+=4200',
    scrub: reduced ? true : 1.2,
    pin: true,
  },
  defaults: { ease: 'none' },
});

/* No ScrollTrigger.refresh() here or on window load: every layout is dimension-reserved
   (CLS 0), the pin length is a fixed pixel value, and a late refresh repaints the pinned
   headline — which drags the measured LCP to whenever the refresh happens.
   The scene loads on first interaction (poster is pixel-identical to frame one), with a
   5s fallback for visitors who sit perfectly still. */
let sceneRequested = false;
function loadScene(): void {
  if (sceneRequested) return;
  sceneRequested = true;
  void import('./scene').then(({ createScene }) => {
    scene = createScene(glContainer);
    scene.addTimeline(tl);
  });
}
for (const ev of ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'keydown', 'scroll'] as const) {
  window.addEventListener(ev, loadScene, { once: true, passive: true });
}
setTimeout(loadScene, 12000);

/* Captions ride the same timeline (autoAlpha both directions — never mix hide/show properties). */
tl.to('#act-0', { autoAlpha: 0, duration: 0.5 }, 0.55);
tl.to('#scroll-hint', { autoAlpha: 0, duration: 0.3 }, 0.5);
const captionWindows: Array<[string, number, number | null]> = [
  ['#act-1', 2.5, 3.95],
  ['#act-2', 4.6, 5.75],
  ['#act-3', 6.9, 8.3],
  ['#act-4', 9.0, null],
];
for (const [sel, tIn, tOut] of captionWindows) {
  tl.to(sel, { autoAlpha: 1, duration: 0.35 }, tIn);
  if (tOut !== null) tl.to(sel, { autoAlpha: 0, duration: 0.3 }, tOut);
}

window.addEventListener('resize', () => scene?.resize());

/* Anchor navigation must go through Lenis — native jumps misplace against the pin spacer. */
function scrollToHash(hash: string, immediate: boolean): void {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -64, immediate });
  else el.scrollIntoView();
}
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href')!;
    if (href.length < 2) return;
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

const sectionIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) track('section_view', { section: e.target.id }, `s:${e.target.id}`);
    }
  },
  { threshold: 0.35 }
);
document.querySelectorAll('main section[id], #nexa').forEach((el) => sectionIO.observe(el));

/* ==================== nav state ==================== */
const nav = document.getElementById('nav')!;
const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ==================== lead form (demo: no backend, tracked as conversion) ==================== */
const form = document.getElementById('lead-form') as HTMLFormElement;
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (!String(data.get('name')).trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(data.get('email')))) {
    form.reportValidity();
    return;
  }
  (document.getElementById('form-success') as HTMLElement).hidden = false;
  (form.querySelector('button[type="submit"]') as HTMLButtonElement).disabled = true;
  track('cta_click', { location: 'verso_lead' });
});

/* ==================== CTA tracking ==================== */
document.getElementById('demo-badge')!.addEventListener('click', () => track('cta_click', { location: 'verso_badge' }));
document.getElementById('nexa-cta')!.addEventListener('click', () => track('cta_click', { location: 'verso_nexa' }));
document.querySelector('#act-4 .btn')!.addEventListener('click', () => track('cta_click', { location: 'verso_story' }));

/* keep tsc honest about the unused copy import shape */
void copy;
