(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* Contact form → mailto draft (nothing is sent by the site) */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const message = form.elements.message.value;
      const subject = encodeURIComponent('RoboTec — ' + name);
      const body = encodeURIComponent('Name: ' + name + '\r\nEmail: ' + email + '\r\n\r\n' + message);
      window.location.href = 'mailto:Robotec.app@gmail.com?subject=' + subject + '&body=' + body;
      if (status) status.textContent = status.getAttribute('data-message');
    });
  }

  if (!document.body) return;

  /* Language select */
  const lang = $('.lang__select');
  if (lang) {
    const here = root.lang;
    $$('option', lang).forEach(o => { if (o.value.replace(/\/$/, '').endsWith(here)) o.selected = true; });
    lang.addEventListener('change', () => { window.location.href = lang.value; });
  }

  /* Theme switch */
  const theme = $('.theme');
  if (theme) {
    theme.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
    theme.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      theme.setAttribute('aria-pressed', String(next === 'light'));
      try { localStorage.setItem('robotec-theme', next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* Mobile menu */
  const burger = $('.burger');
  const links = $('#main-navigation');
  const closeMenu = () => { burger.setAttribute('aria-expanded', 'false'); links.classList.remove('is-open'); };
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
    });
    $$('a', links).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* Split headings into words for the reveal */
  $$('.split, .section h2').forEach((el, n) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((word, i) => {
      const outer = document.createElement('span');
      outer.className = 'w';
      const inner = document.createElement('span');
      inner.textContent = word;
      outer.style.setProperty('--i', i);
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    if (el.classList.contains('split')) el.style.setProperty('--d', (n * 260 + 250) + 'ms');
  });
  $$('.hero .split').forEach(el => $$('.w', el).forEach(w => w.style.setProperty('--d', el.style.getPropertyValue('--d'))));
  requestAnimationFrame(() => setTimeout(() => $('.hero') && $('.hero').classList.add('is-in'), 60));

  /* Reveal on scroll */
  const groups = new Map();
  $$('[data-reveal]').forEach(el => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    groups.set(parent, i + 1);
    el.style.setProperty('--rd', Math.min(i, 6) * 90 + 'ms');
  });
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        $$('.w', entry.target).forEach(w => w.classList.add('is-in'));
        io.unobserve(entry.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    $$('[data-reveal], .section h2').forEach(el => io.observe(el));
  } else {
    $$('[data-reveal], .w').forEach(el => el.classList.add('is-in'));
  }

  /* Counters */
  const counters = $$('.count');
  const runCount = el => {
    const to = +el.dataset.to;
    if (reduce) { el.textContent = to; return; }
    const start = performance.now();
    const dur = 1600;
    const tick = now => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } }), { threshold: .6 });
    counters.forEach(c => co.observe(c));
  } else counters.forEach(c => (c.textContent = c.dataset.to));

  /* Nav: scrolled state, hide on scroll down, progress bar, active link, process line */
  const nav = $('.nav');
  const bar = $('.progress span');
  const steps = $('.steps');
  const stepItems = $$('.step');
  const navLinks = $$('.nav__links a');
  const sections = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 30);
      const menuOpen = links && links.classList.contains('is-open');
      nav.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 500);
    }
    lastY = y;
    let current = null;
    sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
    if (steps) {
      const r = steps.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * .75 - r.top) / (r.height + innerHeight * .2)));
      steps.style.setProperty('--p', p.toFixed(3));
      stepItems.forEach((s, i) => s.classList.toggle('is-lit', p >= i / Math.max(1, stepItems.length - 1) - .02 || (innerWidth <= 960 && s.getBoundingClientRect().top < innerHeight * .7)));
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Portfolio filter */
  const filterButtons = $$('[data-filter]');
  const works = $$('.work');
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    let shown = 0;
    works.forEach(w => {
      w.getAnimations && w.getAnimations().forEach(a => a.cancel());
      const match = f === '*' || w.dataset.cat === f;
      w.hidden = !match;
      if (match && !reduce && w.animate) {
        w.animate([{ opacity: 0, transform: 'translateY(30px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: Math.min(shown, 6) * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      }
      if (match) shown++;
    });
  }));

  const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduce) {
    /* Cursor glow */
    const glow = $('.cursor-glow');
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy, glowing = false;
    window.addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!glowing) { glowing = true; root.classList.add('has-pointer'); loop(); }
    }, { passive: true });
    const loop = () => {
      gx += (tx - gx) * .12; gy += (ty - gy) * .12;
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
      requestAnimationFrame(loop);
    };

    /* Spotlight cards */
    $$('.spot').forEach(card => card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--y', (e.clientY - r.top) + 'px');
    }));

    /* Tilt work cards */
    $$('.work__link').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--ry', (px * 8).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-py * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });

    /* Magnetic buttons */
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * .25).toFixed(1) + 'px');
        btn.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * .35).toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', () => { btn.style.setProperty('--mx', '0px'); btn.style.setProperty('--my', '0px'); });
    });
  }

  /* Logi phone chat loop */
  const chat = $('.chat');
  if (chat) {
    const msgs = $$('.msg', chat);
    if (reduce) msgs.forEach(m => m.classList.add('show'));
    else {
      let running = false;
      const play = () => {
        running = true;
        msgs.forEach(m => m.classList.remove('show'));
        msgs.forEach((m, i) => setTimeout(() => m.classList.add('show'), 500 + i * 1100));
        setTimeout(play, 500 + msgs.length * 1100 + 3500);
      };
      const po = new IntersectionObserver(es => { if (es[0].isIntersecting && !running) { play(); po.disconnect(); } }, { threshold: .3 });
      po.observe(chat);
    }
  }

  /* AI terminal: type the command, then reveal the steps (loops while visible) */
  const term = $('.term');
  if (term) {
    const typeEl = $('.type', term);
    const lines = $$('.tl:not(.tl--cmd)', term);
    const text = typeEl.dataset.text;
    if (reduce || !('IntersectionObserver' in window)) { typeEl.textContent = text; lines.forEach(l => l.classList.add('show')); }
    else {
      let timers = [];
      const run = () => {
        timers.forEach(clearTimeout); timers = [];
        typeEl.textContent = ''; lines.forEach(l => l.classList.remove('show'));
        [...text].forEach((ch, i) => timers.push(setTimeout(() => { typeEl.textContent += ch; }, 300 + i * 45)));
        const after = 300 + text.length * 45 + 400;
        lines.forEach((l, i) => timers.push(setTimeout(() => l.classList.add('show'), after + i * 750)));
        timers.push(setTimeout(run, after + lines.length * 750 + 4000));
      };
      new IntersectionObserver(es => { if (es[0].isIntersecting) run(); else { timers.forEach(clearTimeout); timers = []; } }, { threshold: .35 }).observe(term);
    }
  }

  /* Hero canvas: electric particle network */
  const canvas = $('.hero__canvas');
  if (canvas && canvas.getContext && !reduce) {
    const ctx = canvas.getContext('2d');
    const hero = $('.hero');
    let w, h, dpr, pts = [], mouse = { x: -9999, y: -9999 }, visible = true, raf;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, (w * h) / 14000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6 }));
    };
    const color = () => (root.dataset.theme === 'light' ? '24,138,3' : '34,246,3');
    let sparks = [];
    const spark = () => {
      if (pts.length < 2) return;
      const a = pts[Math.floor(Math.random() * pts.length)];
      let best = null, bd = 1e9;
      pts.forEach(b => { const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2; if (b !== a && d < bd && d > 900) { bd = d; best = b; } });
      if (best) sparks.push({ a, b: best, t: 0 });
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const c = color();
      const link = 130;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y, md = Math.hypot(dx, dy);
        if (md < 180) { p.x -= dx * .012; p.y -= dy * .012; }
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < link) {
            ctx.strokeStyle = 'rgba(' + c + ',' + (0.16 * (1 - d / link)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(' + c + ',' + (md < 180 ? .9 : .5) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (Math.random() < .03) spark();
      sparks = sparks.filter(s => {
        s.t += .05;
        const k = Math.min(1, s.t);
        ctx.strokeStyle = 'rgba(' + c + ',' + (1 - Math.max(0, s.t - 1)) + ')';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgb(' + c + ')'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y);
        const mx = s.a.x + (s.b.x - s.a.x) * k, my = s.a.y + (s.b.y - s.a.y) * k;
        ctx.lineTo((s.a.x + mx) / 2 + (Math.random() - .5) * 14, (s.a.y + my) / 2 + (Math.random() - .5) * 14);
        ctx.lineTo(mx, my); ctx.stroke();
        ctx.shadowBlur = 0;
        return s.t < 2;
      });
      if (visible) raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); if (visible) draw(); });
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(es => { visible = es[0].isIntersecting; cancelAnimationFrame(raf); if (visible) draw(); }).observe(hero);
    document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); visible = !document.hidden; if (visible) draw(); });
  }

})();
