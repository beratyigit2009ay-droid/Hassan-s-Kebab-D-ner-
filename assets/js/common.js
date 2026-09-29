/* Hasan's — gemeinsame Funktionen für Startseite und Speisekarte */
(() => {
  const html = document.documentElement;
  const desktop = matchMedia('(min-width: 900px)');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

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

  /* ---------- Fortschrittsbalken ---------- */
  const progress = $('.progress');
  const updateProgress = (y) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      updateNav(y);
      updateProgress(y);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

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

  /* ---------- Live-Status: geöffnet / geschlossen (täglich 11–22 Uhr, Zeitzone Europe/Berlin) ----------
     Setzt außerdem html.is-open-now – daran hängt, ob sich der Döner-Spieß dreht (siehe CSS). */
  const OPENS = 11 * 60;
  const CLOSES = 22 * 60;
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const statusEls = $$('[data-open-status]');
  const dayRows = $$('[data-day]');
  const berlinNow = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    return { minutes: Number(get('hour')) * 60 + Number(get('minute')), weekday: WEEKDAYS.indexOf(get('weekday')) + 1 };
  };
  const updateOpenStatus = () => {
    let now;
    try {
      now = berlinNow();
    } catch {
      return; // Fallback: statischer Text bleibt stehen, Spieß steht still
    }
    const open = now.minutes >= OPENS && now.minutes < CLOSES;
    html.classList.toggle('is-open-now', open);
    let long;
    if (open) long = CLOSES - now.minutes <= 30 ? 'Jetzt geöffnet · schließt bald (22:00 Uhr)' : 'Jetzt geöffnet · bis 22:00 Uhr';
    else long = now.minutes < OPENS ? 'Gerade geschlossen · öffnet um 11:00 Uhr' : 'Gerade geschlossen · öffnet morgen um 11:00 Uhr';
    const short = open ? 'Jetzt geöffnet' : 'Geschlossen';
    statusEls.forEach((el) => {
      el.classList.toggle('is-open', open);
      el.classList.toggle('is-closed', !open);
      const text = el.dataset.openStyle === 'short' ? short : long;
      const target = $('[data-open-text]', el);
      if (target.textContent !== text) target.textContent = text;
    });
    dayRows.forEach((row) => {
      const today = Number(row.dataset.day) === now.weekday;
      row.classList.toggle('is-today', today);
      if (today) row.setAttribute('aria-current', 'date');
      else row.removeAttribute('aria-current');
    });
  };
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateOpenStatus(); });

  /* ---------- Jahr im Footer ---------- */
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
