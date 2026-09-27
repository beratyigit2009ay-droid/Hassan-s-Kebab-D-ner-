/* Hasan's — Pom Döner · Animationen */
(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = matchMedia('(min-width: 900px)');

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t) => {
    const c1 = 1.5, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  const pageTop = (el) => el.getBoundingClientRect().top + scrollY;

  let vw = innerWidth;
  let vh = innerHeight;

  /* ---------- Text in Buchstaben / Wörter zerlegen ---------- */
  let charIndex = 0;
  $$('[data-split]').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.setProperty('--i', charIndex++);
      el.appendChild(span);
    }
  });

  const words = [];
  $$('[data-words]').forEach((el) => {
    const wrap = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              const w = document.createElement('span');
              w.className = 'w';
              w.textContent = part;
              words.push(w);
              frag.appendChild(w);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrap(child);
        }
      });
    };
    wrap(el);
  });

  /* ---------- Navigation ---------- */
  const nav = $('.nav');
  const burger = $('.nav__burger');
  const mobileMenu = $('#mobile-menu');
  let menuOpen = false;

  const setMenu = (open) => {
    menuOpen = open;
    html.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    mobileMenu.inert = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menuOpen));
  $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setMenu(false); });
  desktop.addEventListener('change', (e) => { if (e.matches && menuOpen) setMenu(false); });

  let navLastY = scrollY;
  const updateNav = (y) => {
    nav.classList.toggle('is-scrolled', y > 30);
    const dy = y - navLastY;
    if (Math.abs(dy) > 8) {
      nav.classList.toggle('is-hidden', dy > 0 && y > 500 && !menuOpen);
      navLastY = y;
    }
  };

  /* ---------- Reveal beim Scrollen ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  $$('[data-reveal], .footer__big').forEach((el) => revealObserver.observe(el));

  /* ---------- Marquee (reagiert auf Scroll-Tempo) ---------- */
  const marquees = $$('.marquee__track').map((track) => {
    const group = $('.marquee__group', track);
    return { track, group, dir: Number(track.dataset.dir) || -1, x: 0, w: 0, visible: true };
  });
  const setupMarquees = () => {
    marquees.forEach((m) => {
      $$('.marquee__group', m.track).slice(1).forEach((g) => g.remove());
      m.w = m.group.getBoundingClientRect().width;
      if (!m.w) return;
      const copies = Math.ceil((vw * 1.2) / m.w) + 1;
      for (let i = 0; i < copies; i++) m.track.appendChild(m.group.cloneNode(true));
      m.x = m.dir > 0 ? -m.w : 0;
    });
  };
  const marqueeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const m = marquees.find((mq) => mq.track === entry.target);
      if (m) m.visible = entry.isIntersecting;
    });
  });
  marquees.forEach((m) => marqueeObserver.observe(m.track));

  /* ---------- Pom Döner Baukasten ---------- */
  const build = {
    el: $('.build'),
    layers: $$('.build [data-layer]').sort((a, b) => a.dataset.layer - b.dataset.layer),
    steps: $$('.build .step'),
    meter: $('.build__meter span'),
    top: 0,
    h: 0,
    active: -1,
  };
  const updateBuild = (y) => {
    if (!build.el || reduce) return;
    // Start, sobald die Sektion zur Hälfte im Bild ist
    const start = build.top - vh * 0.5;
    const dist = build.h - vh + vh * 0.5;
    const p = clamp((y - start) / dist);
    const n = build.layers.length;
    const span = 0.88 / n;

    build.layers.forEach((layer, i) => {
      const t = clamp((p - i * span) / span);
      const e = easeOutBack(t);
      layer.style.transform = `translate(0px, ${((1 - e) * -240).toFixed(1)}px)`;
      layer.style.opacity = clamp(t * 2.5).toFixed(3);
    });

    const phase = Math.min(n - 1, Math.floor(p / span));
    const active = Math.min(build.steps.length - 1, phase);
    if (active !== build.active) {
      build.steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === active);
        s.classList.toggle('is-done', i < active);
      });
      build.active = active;
    }
    build.el.classList.toggle('is-complete', p >= 0.9);
    if (build.meter) build.meter.style.transform = `scaleX(${p.toFixed(4)})`;
  };

  /* ---------- Menü: horizontales Scrollen ---------- */
  const menu = {
    el: $('.menu'),
    track: $('.menu__track'),
    cards: $$('.menu .card'),
    count: $('.menu__count'),
    bar: $('.menu__bar i'),
    enabled: false,
    top: 0,
    dist: 0,
  };
  const setupMenu = () => {
    menu.enabled = !reduce && desktop.matches;
    if (!menu.enabled) {
      menu.el.style.height = '';
      menu.track.style.transform = '';
      menu.cards.forEach((c) => $('img', c).style.removeProperty('--px'));
      return;
    }
    menu.dist = Math.max(0, menu.track.scrollWidth - vw);
    menu.el.style.height = `${menu.dist + vh}px`;
    menu.top = pageTop(menu.el);
  };
  const updateMenu = (y) => {
    if (!menu.enabled) return;
    const p = clamp((y - menu.top) / (menu.dist || 1));
    const x = -p * menu.dist;
    menu.track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    if (menu.bar) menu.bar.style.transform = `scaleX(${(0.2 + p * 0.8).toFixed(4)})`;
    if (menu.count) {
      const idx = Math.min(menu.cards.length, Math.floor(p * (menu.cards.length - 0.01)) + 1);
      menu.count.textContent = String(idx).padStart(2, '0');
    }
    // Parallax der Bilder in den Karten
    menu.cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const offset = (r.left + r.width / 2 - vw / 2) / vw;
      $('img', card).style.setProperty('--px', `${(offset * -40).toFixed(1)}px`);
    });
  };

  /* ---------- Statement: Wörter leuchten auf ---------- */
  const statement = { el: $('.statement__text'), top: 0, h: 0, lit: -1 };
  const updateStatement = (y) => {
    if (!statement.el || reduce || !words.length) return;
    const rectTop = statement.top - y;
    const p = clamp((vh * 0.85 - rectTop) / (vh * 0.5 + statement.h * 0.6));
    const lit = Math.round(p * words.length);
    if (lit === statement.lit) return;
    words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    statement.lit = lit;
  };

  /* ---------- Galerie-Parallax ---------- */
  const cols = $$('.gallery__col').map((el) => ({ el, speed: Number(el.dataset.speed) || 0, top: 0, h: 0 }));
  const updateGallery = (y) => {
    if (reduce || !desktop.matches) return;
    cols.forEach((c) => {
      const center = c.top + c.h / 2 - y - vh / 2;
      c.el.style.transform = `translate3d(0, ${(center * c.speed).toFixed(1)}px, 0)`;
    });
  };

  /* ---------- Hero-Parallax ---------- */
  const hero = { el: $('.hero'), frame: $('.hero__frame'), content: $('.hero__content'), floaters: $$('.floater') };
  const resetHeroScroll = () => {
    hero.frame.style.translate = '';
    hero.content.style.translate = '';
    hero.content.style.opacity = '';
  };
  const updateHeroScroll = (y) => {
    // Am Handy ist der Hero höher als der Bildschirm – dort keine Parallaxe
    if (reduce || !desktop.matches || y > vh * 1.2) return;
    hero.frame.style.translate = `0 ${(y * 0.12).toFixed(1)}px`;
    hero.content.style.translate = `0 ${(y * 0.22).toFixed(1)}px`;
    hero.content.style.opacity = String(clamp(1 - y / (vh * 0.9)));
  };
  if (finePointer && !reduce) {
    hero.el.addEventListener('pointermove', (e) => {
      const mx = e.clientX / vw - 0.5;
      const my = e.clientY / vh - 0.5;
      hero.floaters.forEach((f) => {
        const d = Number(getComputedStyle(f).getPropertyValue('--depth')) || 1;
        f.style.translate = `${(mx * 60 * d).toFixed(1)}px ${(my * 60 * d).toFixed(1)}px`;
      });
    });
    hero.el.addEventListener('pointerleave', () => hero.floaters.forEach((f) => { f.style.translate = ''; }));
  }

  /* ---------- Fortschrittsbalken ---------- */
  const progress = $('.progress');
  const updateProgress = (y) => {
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
  };

  /* ---------- Custom Cursor ---------- */
  const cursor = { el: $('.cursor'), dot: $('.cursor__dot'), ring: $('.cursor__ring'), label: $('.cursor__label'), x: -100, y: -100, rx: -100, ry: -100 };
  if (finePointer && !reduce) {
    html.classList.add('has-cursor');
    addEventListener('pointermove', (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.dot.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`;
      cursor.el.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.el.classList.add('is-hidden'));
    document.addEventListener('pointerover', (e) => {
      const target = e.target.closest('a, button, [data-cursor]');
      const label = target?.dataset.cursor || '';
      cursor.el.classList.toggle('is-hover', !!target && !label);
      cursor.el.classList.toggle('has-label', !!label);
      cursor.label.textContent = label;
    });
  }
  const updateCursor = () => {
    if (!html.classList.contains('has-cursor')) return;
    cursor.rx = lerp(cursor.rx, cursor.x, 0.18);
    cursor.ry = lerp(cursor.ry, cursor.y, 0.18);
    cursor.ring.style.transform = `translate(${cursor.rx.toFixed(1)}px, ${cursor.ry.toFixed(1)}px)`;
  };

  /* ---------- Magnetische Buttons ---------- */
  if (finePointer && !reduce) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  /* ---------- 3D-Tilt ---------- */
  if (finePointer && !reduce) {
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', `${((px - 0.5) * 10).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${((0.5 - py) * 10).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = $('.lightbox');
  const shots = $$('.shot');
  let shotIndex = 0;
  const showShot = (i) => {
    shotIndex = (i + shots.length) % shots.length;
    const shot = shots[shotIndex];
    const img = $('img', lightbox);
    img.src = shot.dataset.full;
    img.alt = $('img', shot).alt;
  };
  if (lightbox && typeof lightbox.showModal === 'function') {
    shots.forEach((shot, i) => shot.addEventListener('click', () => { showShot(i); lightbox.showModal(); }));
    $('.lightbox__close', lightbox).addEventListener('click', () => lightbox.close());
    $('.lightbox__prev', lightbox).addEventListener('click', () => showShot(shotIndex - 1));
    $('.lightbox__next', lightbox).addEventListener('click', () => showShot(shotIndex + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') showShot(shotIndex - 1);
      if (e.key === 'ArrowRight') showShot(shotIndex + 1);
    });
  }

  /* ---------- Live-Status: geöffnet / geschlossen (täglich 11–22 Uhr) ---------- */
  const OPENS = 11 * 60;
  const CLOSES = 22 * 60;
  const statusEls = $$('[data-open-status]');
  const updateOpenStatus = () => {
    let minutes;
    try {
      const parts = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      }).formatToParts(new Date());
      const get = (type) => Number(parts.find((p) => p.type === type).value);
      minutes = get('hour') * 60 + get('minute');
    } catch {
      return; // Fallback: statischer Text „Täglich 11:00–22:00 Uhr“ bleibt stehen
    }
    const open = minutes >= OPENS && minutes < CLOSES;
    let text;
    if (open) text = CLOSES - minutes <= 30 ? 'Jetzt geöffnet · schließt bald (22:00 Uhr)' : 'Jetzt geöffnet · bis 22:00 Uhr';
    else text = minutes < OPENS ? 'Gerade geschlossen · öffnet um 11:00 Uhr' : 'Gerade geschlossen · öffnet morgen um 11:00 Uhr';
    statusEls.forEach((el) => {
      el.classList.toggle('is-open', open);
      el.classList.toggle('is-closed', !open);
      $('[data-open-text]', el).textContent = text;
    });
  };
  if (statusEls.length) {
    updateOpenStatus();
    setInterval(updateOpenStatus, 60 * 1000);
  }

  /* ---------- Jahr im Footer ---------- */
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Messen & Haupt-Loop ---------- */
  function measure() {
    vw = innerWidth;
    vh = innerHeight;
    if (!desktop.matches) resetHeroScroll();
    setupMenu();
    if (build.el) {
      build.top = pageTop(build.el);
      build.h = build.el.offsetHeight;
    }
    if (statement.el) {
      statement.top = pageTop(statement.el);
      statement.h = statement.el.offsetHeight;
    }
    cols.forEach((c) => {
      c.el.style.transform = '';
      c.top = pageTop(c.el);
      c.h = c.el.offsetHeight;
    });
    setupMarquees();
    lastY = -1;
  }

  let lastY = -1;
  let velocity = 0;
  let prevTime = performance.now();

  const frame = (now) => {
    const dt = Math.min(64, now - prevTime);
    prevTime = now;
    const y = scrollY;

    velocity = lerp(velocity, lastY < 0 ? 0 : y - lastY, 0.12);
    if (y !== lastY) {
      updateNav(y);
      updateProgress(y);
      updateHeroScroll(y);
      updateBuild(y);
      updateMenu(y);
      updateStatement(y);
      updateGallery(y);
      lastY = y;
    }

    if (!reduce) {
      const boost = 1 + Math.min(8, Math.abs(velocity) * 0.35);
      marquees.forEach((m) => {
        if (!m.visible || !m.w) return;
        m.x += m.dir * 0.055 * dt * boost;
        if (m.x <= -m.w) m.x += m.w;
        if (m.x > 0) m.x -= m.w;
        m.track.style.transform = `translate3d(${m.x.toFixed(2)}px, 0, 0)`;
      });
    }

    updateCursor();
    requestAnimationFrame(frame);
  };

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  });
  addEventListener('load', measure);
  if (document.fonts?.ready) document.fonts.ready.then(measure);

  measure();

  /* ---------- Loader ---------- */
  const countEl = $('[data-count]');
  const startedAt = performance.now();
  const MIN_TIME = reduce ? 0 : 1400;
  const MAX_TIME = 4000;
  let pageLoaded = document.readyState === 'complete';
  addEventListener('load', () => { pageLoaded = true; }, { once: true });

  const finishLoading = () => {
    html.classList.remove('is-loading');
    html.classList.add('is-loaded');
    requestAnimationFrame(measure);
  };

  if (reduce) {
    finishLoading();
  } else {
    const tickLoader = (now) => {
      const elapsed = now - startedAt;
      let t = clamp(elapsed / MIN_TIME);
      if (!pageLoaded && elapsed < MAX_TIME) t = Math.min(t, 0.92);
      if (countEl) countEl.textContent = Math.round(easeOutCubic(t) * 100);
      if (t >= 1) finishLoading();
      else requestAnimationFrame(tickLoader);
    };
    requestAnimationFrame(tickLoader);
  }

  requestAnimationFrame(frame);
})();
