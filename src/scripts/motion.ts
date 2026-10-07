// Site-wide motion engine (GSAP + ScrollTrigger + SplitText + Lenis).
//
// Rules that keep GEO intact:
//  - Every word stays in the HTML. Motion only changes transforms and opacity at runtime.
//  - Hidden start states exist only under html.motion, which an inline head script adds
//    when JS runs and the user has not asked for reduced motion. Crawlers that don't run
//    JS never get that class, so they see everything. A failsafe removes it if this file
//    fails to load.
//  - prefers-reduced-motion: nothing animates, nothing is hidden.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';

declare global { interface Window { __motionReady?: boolean; __lenis?: Lenis } }

const root = document.documentElement;
// Bots (Googlebot, Bingbot, AI crawlers) get the static page: no half-counted numbers
// or mid-animation states in a rendered snapshot. Same content, no motion.
const BOT = /bot|crawl|spider|slurp|googleother|google-extended|headlesschrome\/.*lighthouse|chatgpt|perplexity|claude|gptbot/i;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || BOT.test(navigator.userAgent);
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (reduced) {
  root.classList.remove('motion');
  window.__motionReady = true;
} else {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
  gsap.defaults({ ease: 'expo.out', duration: 0.8 });
  window.__motionReady = true;

  // ------------------------------------------------------------ smooth scroll
  const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, smoothWheel: true });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute('href')!;
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 0.9 });
    history.replaceState(null, '', id);
  });

  // ------------------------------------------------------------ progress bar + nav
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (nav) {
    let last = 0;
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      const down = scroll > last && scroll > 240 && !nav.classList.contains('open');
      nav.classList.toggle('hide', down);
      nav.classList.toggle('scrolled', scroll > 24);
      last = scroll;
    });
  }

  // ------------------------------------------------------------ headings: line mask reveal
  const heads = gsap.utils.toArray<HTMLElement>('h1, .h1, .h2, [data-split]').filter((el) => !el.closest('[data-nosplit]'));
  heads.forEach((el) => {
    const inHero = !!el.closest('.hero, [data-hero]') || el.getBoundingClientRect().top < window.innerHeight;
    SplitText.create(el, {
      type: 'lines,words', mask: 'lines', linesClass: 'sl', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          yPercent: 115, rotate: 3, duration: 0.8, stagger: 0.02, ease: 'expo.out',
          delay: inHero ? 0.05 : 0,
          scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 88%', once: true },
          onStart: () => el.classList.add('in'),
        });
      },
    });
  });

  // ------------------------------------------------------------ eyebrows: scramble in
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/';
  gsap.utils.toArray<HTMLElement>('.eyebrow').forEach((el) => {
    const target = el.textContent ?? '';
    if (target.length > 80 || el.children.length) return; // keep <time> and other markup intact
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => {
        const len = target.length; const obj = { p: 0 };
        el.classList.add('in');
        gsap.to(obj, {
          p: 1, duration: 0.5, ease: 'power2.out',
          onUpdate: () => {
            const n = Math.floor(obj.p * len);
            let out = target.slice(0, n);
            for (let i = n; i < len; i++) out += target[i] === ' ' ? ' ' : glyphs[(Math.random() * glyphs.length) | 0];
            el.textContent = out;
          },
          onComplete: () => { el.textContent = target; },
        });
      },
    });
  });

  // ------------------------------------------------------------ batched reveals
  const REVEAL = [
    '[data-reveal]', '.lead', '.stat', '.cells > *', '.steps > *', '.fact', '.qa', '.checklist li',
    '.btn-row', '.row-item', '.table-wrap', '.short', '.points', '.prose > *', '.guarantee', '.facts-wrap',
    '.pl', '.ev', '.chip', '.cl-item', '.run', '.srcl', '.side-card', '.small.meta', '.promise', '.tile', '.vs tbody tr',
  ].join(',');
  const revealEls = gsap.utils.toArray<HTMLElement>(REVEAL).filter((el) => !el.closest('[data-noreveal]'));
  gsap.set(revealEls, { autoAlpha: 0, y: 22 });
  ScrollTrigger.batch(revealEls, {
    start: 'top 92%', once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.045, ease: 'expo.out', overwrite: true }),
  });

  // ------------------------------------------------------------ count-up numerals
  const NUM = /^([^\d]*?)(\d[\d,]*\.?\d*)(.*)$/s;
  gsap.utils.toArray<HTMLElement>('.numeral, [data-count]').forEach((el) => {
    if (el.children.length) return;
    const text = (el.textContent ?? '').trim();
    const m = text.match(NUM);
    if (!m) return;
    const [, pre, numStr, post] = m;
    const target = parseFloat(numStr.replace(/,/g, ''));
    // Skip ranges (55-77%), bounds (<1%) and tiny values: counting those up reads as a glitch.
    if (!isFinite(target) || target < 2 || /[<>~]/.test(pre) || /\d/.test(post)) return;
    const decimals = (numStr.split('.')[1] ?? '').length;
    const pad = numStr.startsWith('0') && numStr.length > 1 && !numStr.includes('.') ? numStr.length : 0;
    const commas = numStr.includes(',');
    const fmt = (v: number) => {
      let s = decimals ? v.toFixed(decimals) : Math.round(v).toString();
      if (commas) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      if (pad) s = s.padStart(pad, '0');
      return pre + s + post;
    };
    const obj = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(obj, {
      v: target, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 94%', once: true },
      onUpdate: () => { el.textContent = fmt(obj.v); },
      onComplete: () => { el.textContent = text; },
    });
  });

  // ------------------------------------------------------------ marquees (scroll-velocity aware)
  gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((wrap) => {
    const track = wrap.querySelector<HTMLElement>('[data-track]');
    if (!track) return;
    // seamless loop: clone the items once, hidden from assistive tech so the text is read once
    Array.from(track.children).forEach((c) => { const k = c.cloneNode(true) as HTMLElement; k.setAttribute('aria-hidden', 'true'); track.appendChild(k); });
    const dir = wrap.dataset.reverse ? 1 : -1;
    const speed = Number(wrap.dataset.speed ?? 40);
    const tween = gsap.fromTo(track, { xPercent: dir === -1 ? 0 : -50 }, { xPercent: dir === -1 ? -50 : 0, ease: 'none', duration: speed, repeat: -1 });
    let boost = 1;
    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      boost = 1 + Math.min(Math.abs(velocity) / 6, 5);
      gsap.to(tween, { timeScale: boost, duration: 0.2, overwrite: true });
      gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.2 });
    });
  });

  // ------------------------------------------------------------ parallax
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amt = Number(el.dataset.parallax || 0.2);
    gsap.to(el, { yPercent: -100 * amt, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // ------------------------------------------------------------ SVG line drawing
  gsap.utils.toArray<SVGGeometryElement>('[data-draw]').forEach((el) => {
    gsap.fromTo(el, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // ------------------------------------------------------------ scrubbed vertical progress lines
  gsap.utils.toArray<HTMLElement>('[data-line]').forEach((el) => {
    gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: true } });
  });

  // ------------------------------------------------------------ light up steps as the line reaches them
  gsap.utils.toArray<HTMLElement>('[data-activate]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 62%', onEnter: () => el.classList.add('on'), onLeaveBack: () => el.classList.remove('on') });
  });

  // ------------------------------------------------------------ horizontal scroll rails (desktop)
  ScrollTrigger.matchMedia({
    '(min-width: 1024px)': () => {
      gsap.utils.toArray<HTMLElement>('[data-hscroll]').forEach((sec) => {
        const track = sec.querySelector<HTMLElement>('[data-htrack]');
        if (!track) return;
        const dist = () => track.scrollWidth - sec.clientWidth + 48;
        gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
        });
      });
    },
  });

  // ------------------------------------------------------------ 3D tilt (cards lean toward the pointer) and idle float
  if (finePointer) {
    gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((el) => {
      const max = Number(el.dataset.tilt || 6);
      gsap.set(el, { transformPerspective: 900 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * max * 2); rx(-py * max * 2);
        el.style.setProperty('--gx', `${(px + 0.5) * 100}%`); el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }
  gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el, i) => {
    const amt = Number(el.dataset.float || 10);
    gsap.to(el, { y: -amt, duration: 2.6 + (i % 3) * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.2 });
  });

  // ------------------------------------------------------------ magnetic buttons + cell spotlight
  if (finePointer) {
    gsap.utils.toArray<HTMLElement>('.btn, [data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
    document.addEventListener('pointermove', (e) => {
      const cell = (e.target as HTMLElement).closest<HTMLElement>('.cell, .row-item, .pl');
      if (!cell) return;
      const r = cell.getBoundingClientRect();
      cell.style.setProperty('--mx', `${e.clientX - r.left}px`);
      cell.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });

    // cursor
    const dot = document.querySelector<HTMLElement>('[data-cursor]');
    if (dot) {
      root.classList.add('has-cursor');
      const cx = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' });
      const cy = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' });
      window.addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
      document.addEventListener('pointerover', (e) => {
        const t = (e.target as HTMLElement).closest('a, button, input, textarea, label, [data-hover]');
        dot.classList.toggle('big', !!t);
      });
    }
  }

  // ------------------------------------------------------------ done: fonts can shift lines, so refresh once they load
  root.classList.add('motion-ready');
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
