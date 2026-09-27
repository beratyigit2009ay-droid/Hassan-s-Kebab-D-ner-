/* Hasan's — Speisekarte: Kategorien-Leiste (springt & markiert) und Suche */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const karte = $('.karte--full');
  if (!karte) return;

  const tabs = $$('.karte__tab', karte);
  const tabBar = $('.karte__tabs', karte);
  const tools = $('.karte__tools', karte);
  const cats = $$('.kat', karte);
  const catsWrap = $('.karte__cats', karte);
  const search = $('.karte__search input', karte);
  const empty = $('.karte__empty', karte);
  const norm = (str) => str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  cats.forEach((c) => $$('.gericht', c).forEach((g, i) => {
    g.style.setProperty('--i', i);
    g.dataset.text = norm(g.textContent);
  }));

  /* ---------- Kategorien einblenden, sobald sie ins Bild kommen ---------- */
  const catObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        catObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -6% 0px' });
  cats.forEach((c) => catObserver.observe(c));

  /* ---------- Aktive Kategorie in der Leiste markieren ---------- */
  let current = '';
  const setActive = (id) => {
    if (id === current) return;
    current = id;
    tabs.forEach((t) => {
      const on = t.hash === `#${id}`;
      t.classList.toggle('is-active', on);
      if (on) {
        t.setAttribute('aria-current', 'true');
        tabBar.scrollTo({ left: t.offsetLeft - tabBar.clientWidth / 2 + t.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        t.removeAttribute('aria-current');
      }
    });
  };
  const spy = () => {
    // gleiche Linie, an der Kategorien nach einem Sprung landen (scroll-margin-top im CSS)
    const margin = parseFloat(getComputedStyle(cats[0]).scrollMarginTop) || 0;
    const line = Math.max(tools.getBoundingClientRect().bottom + 24, margin + 20);
    const visible = cats.filter((c) => c.offsetParent !== null);
    if (!visible.length) return;
    let id = visible[0].id;
    for (const c of visible) {
      if (c.getBoundingClientRect().top <= line) id = c.id;
      else break;
    }
    setActive(id);
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { spy(); ticking = false; });
  }, { passive: true });

  /* ---------- Suche ---------- */
  const runSearch = () => {
    const q = norm(search.value.trim());
    const searching = q.length > 0;
    catsWrap.classList.toggle('is-searching', searching);
    let hits = 0;
    cats.forEach((c) => {
      let catHits = 0;
      $$('.gericht', c).forEach((g) => {
        const ok = !searching || g.dataset.text.includes(q);
        g.classList.toggle('is-hidden', !ok);
        if (ok) catHits++;
      });
      c.classList.toggle('no-hits', searching && catHits === 0);
      hits += catHits;
    });
    empty.hidden = !searching || hits > 0;
    // Treffer direkt unter der Leiste zeigen
    if (searching) {
      const offset = tools.getBoundingClientRect().bottom + 12;
      const top = catsWrap.getBoundingClientRect().top;
      if (top < offset - 1) scrollTo({ top: scrollY + top - offset, behavior: 'auto' });
    }
    spy();
  };
  search.addEventListener('input', runSearch);

  /* ---------- Klick auf Kategorie: hinspringen ---------- */
  tabs.forEach((t) => t.addEventListener('click', (e) => {
    const target = document.getElementById(t.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    if (search.value) { search.value = ''; runSearch(); }
    target.classList.add('is-in');
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', t.hash);
    setActive(target.id);
  }));

  /* ---------- Von der Startseite mit #kategorie gekommen ---------- */
  const fromHash = () => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains('kat')) {
      target.classList.add('is-in');
      target.scrollIntoView({ block: 'start' });
      setActive(target.id);
    } else {
      spy();
    }
  };
  addEventListener('hashchange', fromHash);
  if (document.fonts?.ready) document.fonts.ready.then(fromHash);
  else fromHash();
})();
