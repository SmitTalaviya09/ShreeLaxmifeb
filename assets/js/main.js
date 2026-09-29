/* ============================================================
   SHREE LAXMIFEB — main.js
   GSAP + ScrollTrigger + Lenis
   ============================================================ */
(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const SVGNS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => { const e = document.createElementNS(SVGNS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };

  /* ==========================================================
     1. SMOOTH SCROLL
     ========================================================== */
  let lenis = null;
  if (!REDUCED && window.Lenis) {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }
  const goTo = target => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  /* ==========================================================
     4. NAV
     ========================================================== */
  function nav() {
    const el = $('#nav'), burger = $('#burger'), links = $('#navLinks');
    ScrollTrigger.create({ start: 90, onUpdate: s => el.classList.toggle('is-stuck', s.scroll() > 90) });

    burger.addEventListener('click', () => {
      burger.classList.toggle('is-x');
      links.classList.toggle('is-open');
    });

    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      e.preventDefault();
      burger.classList.remove('is-x'); links.classList.remove('is-open');
      goTo(id);
    }));

    // scroll progress bar
    const fill = $('#scrollFill');
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: s => { fill.style.width = (s.progress * 100).toFixed(2) + '%'; }
    });
  }

  /* ==========================================================
     5. HERO — animated loom background (video fallback)
     ========================================================== */
  function loomCanvas() {
    const cv = $('#loomCanvas');
    if (!cv || REDUCED) return;
    // If real videos were uncommented, skip the canvas.
    if ($('.hero-video')) { cv.style.display = 'none'; return; }

    const ctx = cv.getContext('2d');
    let w, h, dpr;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0, raf, visible = true;
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

    // weft lines already "woven" into the cloth
    const woven = [];

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      t += 0.016;

      ctx.clearRect(0, 0, w, h);

      // deep base
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#17130F'); g.addColorStop(1, '#241C17');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      const midY = h * 0.5;
      const shedAmp = h * 0.10;
      const cycle = (t * 1.15) % 1;               // one full pick cycle
      const open = Math.sin(cycle * Math.PI);      // shed opening 0..1..0
      const fellX = w * 0.66;

      // ---- warp threads ----
      const count = Math.max(20, Math.floor(h / 16));
      for (let i = 0; i < count; i++) {
        const up = i % 2 === 0;
        const base = midY + (i - count / 2) * 13;
        const off = (up ? -1 : 1) * shedAmp * open * (1 - Math.abs(base - midY) / (h * 0.9));
        ctx.beginPath();
        ctx.moveTo(-20, base);
        ctx.lineTo(w * 0.32, base);
        ctx.quadraticCurveTo(w * 0.5, base + off, fellX, base);
        ctx.lineTo(w + 20, base);
        ctx.strokeStyle = up ? 'rgba(200,190,178,0.13)' : 'rgba(150,138,120,0.10)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ---- the water jet firing across the shed ----
      const jetP = Math.min(1, cycle / 0.55);
      if (cycle < 0.6) {
        const x0 = w * 0.30;
        const x1 = x0 + (fellX - x0) * jetP;
        const grd = ctx.createLinearGradient(x0, 0, x1, 0);
        grd.addColorStop(0, 'rgba(193,98,45,0)');
        grd.addColorStop(0.55, 'rgba(224,138,82,0.75)');
        grd.addColorStop(1, 'rgba(255,225,195,0.95)');
        ctx.strokeStyle = grd;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(x0, midY); ctx.lineTo(x1, midY); ctx.stroke();

        // head glow
        ctx.beginPath();
        ctx.arc(x1, midY, 5 + Math.sin(t * 22) * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,225,195,0.85)'; ctx.fill();
        ctx.beginPath(); ctx.arc(x1, midY, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(193,98,45,0.13)'; ctx.fill();

        // spray
        for (let s = 0; s < 12; s++) {
          const sp = Math.random();
          const px = x1 - sp * 90;
          const py = midY + (Math.random() - .5) * 22 * sp;
          ctx.beginPath();
          ctx.arc(px, py, Math.random() * 1.5 + .3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(224,138,82,' + (0.5 * (1 - sp)).toFixed(3) + ')';
          ctx.fill();
        }
      } else if (woven.length < 400 && cycle > 0.6 && cycle < 0.62) {
        woven.push(1);
      }

      // ---- fabric already woven (right side) ----
      const clothW = w - fellX + 20;
      ctx.save();
      ctx.beginPath(); ctx.rect(fellX, midY - h * 0.30, clothW, h * 0.60); ctx.clip();
      ctx.fillStyle = 'rgba(58,50,42,0.55)';
      ctx.fillRect(fellX, midY - h * 0.30, clothW, h * 0.60);
      const shift = (t * 26) % 9;
      for (let y = midY - h * 0.30; y < midY + h * 0.30; y += 9) {
        ctx.beginPath(); ctx.moveTo(fellX, y + shift); ctx.lineTo(w + 20, y + shift);
        ctx.strokeStyle = 'rgba(200,190,175,0.10)'; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();

      // ---- reed sweep (beat-up) ----
      const beat = cycle > 0.62 ? (cycle - 0.62) / 0.38 : 0;
      if (beat > 0) {
        const rx = fellX - 60 + 60 * Math.sin(beat * Math.PI);
        ctx.strokeStyle = 'rgba(212,175,55,' + (0.30 * (1 - beat)).toFixed(3) + ')';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(rx, midY - h * 0.26); ctx.lineTo(rx, midY + h * 0.26); ctx.stroke();
      }

      // vignette
      const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(13,10,8,0.85)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    }
    frame();
  }

  /* ==========================================================
     6. HERO — droplet particles
     ========================================================== */
  function droplets() {
    const cv = $('#dropCanvas');
    if (!cv || REDUCED) return;
    const ctx = cv.getContext('2d');
    let w, h, dpr, parts = [], mouse = { x: -999, y: -999 }, visible = true;

    const N = () => (window.innerWidth < 768 ? 120 : 480);

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = [];
      for (let i = 0; i < N(); i++) {
        parts.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.7 + .3,
          v: Math.random() * 1.5 + .25,
          o: Math.random() * .17 + .08
        });
      }
    }
    build();
    window.addEventListener('resize', build);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

    // stop burning CPU once the hero has scrolled away
    let onScreen = true;
    ScrollTrigger.create({
      trigger: '.hero', start: 'top bottom', end: 'bottom top',
      onToggle: s => { onScreen = s.isActive; }
    });

    (function loop() {
      requestAnimationFrame(loop);
      if (!visible || !onScreen) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.v;
        if (p.x - p.r > w) { p.x = -p.r; p.y = Math.random() * h; }

        // gentle repel from cursor
        const ddx = p.x - mouse.x, ddy = p.y - mouse.y;
        const d2 = ddx * ddx + ddy * ddy;
        let ox = 0, oy = 0;
        if (d2 < 16000) { const f = (16000 - d2) / 16000; const d = Math.sqrt(d2) || 1; ox = (ddx / d) * f * 24; oy = (ddy / d) * f * 24; }

        ctx.beginPath();
        ctx.ellipse(p.x + ox, p.y + oy, p.r * 2.4, p.r, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(224,138,82,' + p.o + ')';
        ctx.fill();
      }
    })();
  }

  /* ==========================================================
     7. HERO — video cross-fade (only if videos exist)
     ========================================================== */
  /* Only ONE video ever decodes at a time, and everything pauses the moment the
     hero leaves the screen or the tab is hidden. This is what keeps the page
     from bogging down a modest PC. */
  let heroPaused = false;
  function heroVideos() {
    const vids = $$('.hero-video');
    if (!vids.length) return;

    const activate = n => {
      vids.forEach((v, k) => {
        const on = k === n;
        v.classList.toggle('is-active', on);
        if (on && !heroPaused) {
          if (v.readyState < 2) v.load();
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    };

    let i = 0, timer = null;
    const start = () => { if (!timer && vids.length > 1 && !REDUCED) timer = setInterval(() => { i = (i + 1) % vids.length; activate(i); }, 6000); };
    const stop = () => { clearInterval(timer); timer = null; vids.forEach(v => v.pause()); };

    activate(0); start();

    ScrollTrigger.create({
      trigger: '.hero', start: 'top bottom', end: 'bottom top',
      onToggle: s => {
        heroPaused = !s.isActive;
        if (s.isActive) { activate(i); start(); } else stop();
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { heroPaused = true; stop(); }
      else { heroPaused = false; activate(i); start(); }
    });
  }

  /* ==========================================================
     8. HERO — text reveal + counters
     ========================================================== */
  function heroIntro() {
    const title = $('#heroTitle');
    title.innerHTML = title.textContent.trim().split(' ')
      .map(word => '<span class="w"><span>' + word + '</span></span>').join(' ');

    if (REDUCED) { gsap.set('.hero-title .w span, .reveal-up', { y: 0, opacity: 1 }); countUp(document); return; }

    const tl = gsap.timeline({ delay: .15 });
    tl.to('.hero .eyebrow', { opacity: 1, y: 0, duration: .8, ease: 'expo.out' })
      .to('.hero-title .w span', { y: '0%', duration: 1.05, stagger: .12, ease: 'expo.out' }, '-=.45')
      .to('#heroLine', { width: 180, duration: .9, ease: 'expo.out' }, '-=.5')
      .to('.hero-sub', { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, '-=.55')
      .to('.hero-cta', { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, '-=.6')
      .from('.stat', { opacity: 0, y: 18, duration: .7, stagger: .09, ease: 'expo.out' }, '-=.4')
      .add(() => countUp(document), '-=.4');
  }

  function countUp(scope) {
    $$('.count', scope).forEach(el => {
      const to = parseFloat(el.dataset.to);
      const sep = el.dataset.sep === '1';
      const suffix = el.dataset.suffix || '';
      const o = { v: 0 };
      gsap.to(o, {
        v: to, duration: 2, ease: 'power2.out',
        onUpdate: () => {
          const n = Math.round(o.v);
          el.textContent = (sep ? n.toLocaleString('en-IN') : n) + suffix;
        }
      });
    });
  }

  /* ==========================================================
     10. PRODUCTS
     ========================================================== */
  const FABRICS = [
    { n: 'Polyester Greige', f: 'greige', tag: 'Greige', d: 'Our core product. Clean, consistent base cloth ready for dyeing and printing.',
      s: { Width: '58" / 63"', GSM: '55 – 120', Denier: '50D – 300D', MOQ: '5,000 m' }, c: ['#3B4A5A', '#55677A'], img: 'fab-greige.jpg' },
    { n: 'Taffeta', f: 'lining', tag: 'Lining', d: 'Crisp, tightly woven and smooth — the workhorse for linings, umbrellas and bags.',
      s: { Width: '58"', GSM: '58 – 75', Denier: '50D × 50D', MOQ: '3,000 m' }, c: ['#2E5C6E', '#4E8FA3'], img: 'fab-taffeta.jpg' },
    { n: 'Crepe Satin', f: 'apparel', tag: 'Apparel', d: 'Lustrous face, matte back, beautiful fall. Built for dress material and saree base.',
      s: { Width: '58" / 60"', GSM: '85 – 135', Denier: '75D – 150D', MOQ: '3,000 m' }, c: ['#6B4B6E', '#9C7BA0'], img: 'fab-satin.jpg' },
    { n: 'Chiffon', f: 'apparel', tag: 'Apparel', d: 'Fine, sheer and light with a soft drape. Popular for dupatta and ethnic wear.',
      s: { Width: '58"', GSM: '35 – 60', Denier: '50D – 75D', MOQ: '3,000 m' }, c: ['#7A6A55', '#B49C7C'], img: 'fab-chiffon.jpg' },
    { n: 'Georgette', f: 'apparel', tag: 'Apparel', d: 'Slightly grainy handle with excellent flow — takes print exceptionally well.',
      s: { Width: '58"', GSM: '45 – 70', Denier: '50D – 100D', MOQ: '3,000 m' }, c: ['#4A5F52', '#748D7C'], img: 'fab-georgette.jpg' },
    { n: 'Micro Polyester', f: 'apparel', tag: 'Apparel', d: 'Dense micro-filament construction. Soft, breathable, ideal for shirting and sportswear.',
      s: { Width: '58" / 63"', GSM: '90 – 140', Denier: '75D – 150D', MOQ: '5,000 m' }, c: ['#2F4A66', '#5079A0'], img: 'fab-micro.jpg' },
    { n: 'Lining Fabric', f: 'lining', tag: 'Lining', d: 'Smooth, low-friction inner fabric with a consistent finish across every roll.',
      s: { Width: '58"', GSM: '50 – 80', Denier: '50D – 75D', MOQ: '3,000 m' }, c: ['#43505E', '#6C7B8B'], img: 'fab-lining.jpg' },
    { n: 'Umbrella & Bag Fabric', f: 'industrial', tag: 'Industrial', d: 'High tear strength, coating friendly. Made to survive real use, not just a showroom.',
      s: { Width: '58" / 63"', GSM: '70 – 110', Denier: '150D – 300D', MOQ: '5,000 m' }, c: ['#1F3F55', '#3C6B87'], img: 'fab-umbrella.jpg' },
    { n: 'Curtain & Sofa Fabric', f: 'home', tag: 'Home', d: 'Heavier constructions with body and structure for drapery and upholstery.',
      s: { Width: '110" / 220 cm', GSM: '150 – 260', Denier: '150D – 300D', MOQ: '2,000 m' }, c: ['#5A4438', '#8A6A55'], img: 'fab-curtain.jpg' },
    { n: 'Mattress Ticking', f: 'home', tag: 'Home', d: 'Strong, dimensionally stable fabric engineered for bedding manufacturers.',
      s: { Width: '220 cm', GSM: '160 – 240', Denier: '150D – 300D', MOQ: '2,000 m' }, c: ['#4C4A5E', '#77748D'], img: 'fab-mattress.jpg' },
    { n: 'Poly Twill', f: 'greige', tag: 'Greige', d: 'Diagonal weave with strong drape and wrinkle resistance for uniforms and workwear.',
      s: { Width: '58" / 63"', GSM: '110 – 180', Denier: '75D – 150D', MOQ: '5,000 m' }, c: ['#39505A', '#5F7F8B'], img: 'fab-twill.jpg' },
    { n: 'Poly Oxford', f: 'industrial', tag: 'Industrial', d: 'Basket-weave construction, coating ready, for bags, covers and outdoor goods.',
      s: { Width: '58"', GSM: '120 – 220', Denier: '150D – 300D', MOQ: '5,000 m' }, c: ['#2B3F4E', '#4A6779'], img: 'fab-oxford.jpg' }
  ];

  // A fabric's img may be a single filename or an array of them — one photo
  // works fine, several turn on the thumbnail strip in the quick view.
  const photosOf = f => (Array.isArray(f.img) ? f.img : [f.img]);

  function products(qv) {
    const grid = $('#grid');
    if (!grid) return;

    grid.innerHTML = FABRICS.map((f, i) => `
      <article class="card" data-f="${f.f}" data-i="${i}">
        <div class="card-swatch" style="background:
            repeating-linear-gradient(90deg, ${f.c[0]} 0 2px, ${f.c[1]} 2px 4px),
            repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0 2px, transparent 2px 4px);">
          <img src="assets/img/${photosOf(f)[0]}" alt="${f.n} fabric woven by Shree Laxmifeb"
               loading="lazy" decoding="async" onerror="this.remove()">
        </div>
        <span class="card-tag">${f.tag}</span>
        <div class="card-body">
          <h3>${f.n}</h3>
          <p>${f.d}</p>
          <div class="card-specs">
            ${Object.entries(f.s).map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}
          </div>
          <span class="card-ask">View &amp; Request Sample &rarr;</span>
        </div>
      </article>`).join('');

    // filters
    $$('.chip').forEach(chip => chip.addEventListener('click', () => {
      $$('.chip').forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      const f = chip.dataset.f;
      $$('.card').forEach(card => {
        const show = f === 'all' || card.dataset.f === f;
        card.classList.toggle('is-hidden', !show);
        // a filtered card is always visible — never leave it mid-reveal
        if (show) { card.classList.remove('rv'); card.classList.add('rv-in'); }
      });
      gsap.fromTo('.card:not(.is-hidden)', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, stagger: .04, ease: 'power2.out', clearProps: 'opacity,transform' });
      ScrollTrigger.refresh();
    }));

    // card click -> open the fabric up close, rather than jumping straight to
    // the form. The enquiry action lives inside the quick view instead.
    grid.addEventListener('click', e => {
      const card = e.target.closest('.card');
      if (card) qv.open(+card.dataset.i);
    });

    revealOnScroll($$('.card'));
  }

  /* ==========================================================
     10b. FABRIC QUICK VIEW
     ========================================================== */
  /* Buyers judge cloth by looking at it, so a click opens the fabric large
     with its full spec sheet, and the sample request happens from there —
     still landing them in the contact form with the fabric preselected. */
  function quickView() {
    const qv = $('#qv'), box = $('#qvBox'), x = $('#qvX');
    if (!qv || !box) return { open: () => {} };

    const close = () => { qv.classList.remove('is-open'); if (lenis) lenis.start(); };

    const open = i => {
      const f = FABRICS[i];
      if (!f) return;
      const imgs = photosOf(f);
      box.innerHTML = `
        <div class="qv-media">
          <div class="qv-main">
            <img id="qvMain" src="assets/img/${imgs[0]}" alt="${f.n} fabric woven by Shree Laxmifeb">
          </div>
          ${imgs.length > 1 ? `<div class="qv-thumbs">${imgs.map((src, n) => `
            <button class="qv-thumb${n === 0 ? ' is-on' : ''}" data-src="assets/img/${src}" aria-label="Photo ${n + 1}">
              <img src="assets/img/${src}" alt="" loading="lazy">
            </button>`).join('')}</div>` : ''}
        </div>
        <div class="qv-info">
          <span class="qv-tag">${f.tag}</span>
          <h3>${f.n}</h3>
          <p>${f.d}</p>
          <div class="qv-specs">
            ${Object.entries(f.s).map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}
          </div>
          <button class="btn btn-gold qv-ask" data-name="${f.n}">Request a Sample</button>
        </div>`;
      qv.classList.add('is-open');
      if (lenis) lenis.stop();
    };

    box.addEventListener('click', e => {
      const thumb = e.target.closest('.qv-thumb');
      if (thumb) {
        $('#qvMain').src = thumb.dataset.src;
        $$('.qv-thumb', box).forEach(t => t.classList.toggle('is-on', t === thumb));
        return;
      }
      const ask = e.target.closest('.qv-ask');
      if (!ask) return;
      const sel = $('#fType');
      const match = Array.from(sel.options).find(o => o.text === ask.dataset.name);
      if (match) {
        sel.value = match.value;
        sel.closest('.f-row').classList.add('has-val');
        // behave as though the buyer picked it themselves, so the floating
        // label and any validation state update the same way
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      close();
      goTo('#contact');
    });

    x.addEventListener('click', close);
    qv.addEventListener('click', e => { if (e.target === qv) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    return { open };
  }

  /* ==========================================================
     13. QUALITY rings
     ========================================================== */
  function rings() {
    $$('.ring-card').forEach(card => {
      ScrollTrigger.create({
        trigger: card, start: 'top 82%', once: true,
        onEnter: () => {
          const pct = +card.dataset.p;
          const circ = 2 * Math.PI * 52;
          const fg = $('.rg-fg', card), num = $('.rg-num', card);
          gsap.set(fg, { strokeDasharray: circ, strokeDashoffset: circ });
          gsap.to(fg, { strokeDashoffset: circ * (1 - pct / 100), duration: 1.5, ease: 'power3.out' });
          const o = { v: 0 };
          gsap.to(o, { v: pct, duration: 1.5, ease: 'power3.out', onUpdate: () => { num.textContent = Math.round(o.v) + '%'; } });
        }
      });
    });
  }

  /* ==========================================================
     15. TIMELINE dots
     ========================================================== */
  function timeline() {
    $$('#timeline li').forEach(li => {
      ScrollTrigger.create({
        trigger: li, start: 'top 80%',
        onEnter: () => li.classList.add('is-on'),
        onLeaveBack: () => li.classList.remove('is-on')
      });
    });
  }

  /* ==========================================================
     16. GENERIC REVEALS
     ========================================================== */
  /* Uses IntersectionObserver, not ScrollTrigger, so pinned sections can never
     leave content stranded at opacity 0. Plus a hard failsafe: if anything is
     still hidden after 4s, it is shown regardless. */
  function revealOnScroll(els) {
    if (!els.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('rv-in'));
      return;
    }
    els.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('rv-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    els.forEach(el => io.observe(el));
    setTimeout(() => els.forEach(el => el.classList.add('rv-in')), 4000);
  }

  function reveals() {
    const targets = '.sec-head, .voice, .ring-card, .about-copy > *, .timeline li, .contact-copy > *, .form > *, .foot-col';
    revealOnScroll($$(targets));
  }

  /* ==========================================================
     17. FORM
     ========================================================== */
  const digits = v => (String(v).match(/\d/g) || []).length;

  // What counts as valid for each field, and what to tell the user if it isn't.
  const RULES = {
    fName:  { ok: v => v.trim().length >= 2,
              msg: 'Please enter your name' },
    fCo:    { ok: v => v.trim().length >= 2,
              msg: 'Please enter your company name' },
    fPhone: { ok: v => /^[\d+\-()\s]+$/.test(v.trim()) && digits(v) >= 10 && digits(v) <= 15,
              msg: 'Enter 10 to 15 digits' },
    fMail:  { ok: v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()),
              msg: 'Enter a valid email address' },
    fType:  { ok: v => !!v,
              msg: 'Please choose a fabric type' },
    fQty:   { ok: v => { const n = parseFloat(String(v).replace(/[,\s]/g, '')); return !isNaN(n) && n > 0; },
              msg: 'Enter a number, e.g. 5000' }
  };

  // Paste your deployed Google Apps Script Web App URL here (see
  // google-sheet-sync.gs in the project root for the one-time setup) to also
  // log every enquiry as a row in a Google Sheet. Leave blank to skip that —
  // Netlify Forms alone still works fine without it.
  const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx7n5xrpGRRsTXPiJKhcbBvQOnm5OLzqvVybSzJbUoNrE9-i8dBYuQBkVQGXox2EW_h/exec';

  let restoreBtn = null;

  function form() {
    const f = $('#form');
    if (!f) return;

    // Build the fabric dropdown from the same array the cards come from —
    // matching them up by name is what lets "Request a Sample" preselect the
    // right one, and hand-maintained lists drift apart the moment a fabric
    // gets renamed or added.
    const type = $('#fType');
    if (type) {
      type.insertAdjacentHTML('beforeend',
        FABRICS.map(fb => `<option>${fb.n}</option>`).join('') + '<option>Other</option>');
    }

    // floating labels need a placeholder to work with :not(:placeholder-shown)
    $$('#form input, #form textarea').forEach(i => {
      i.setAttribute('placeholder', ' ');
      i.addEventListener('input', () => i.closest('.f-row').classList.toggle('has-val', !!i.value.trim()));
    });
    $('#fType').addEventListener('change', e => e.target.closest('.f-row').classList.add('has-val'));

    // one message element per field
    Object.keys(RULES).forEach(id => {
      const el = $('#' + id);
      if (!el || $('.f-err', el.closest('.f-row'))) return;
      const s = document.createElement('small');
      s.className = 'f-err';
      s.id = id + 'Err';
      s.setAttribute('role', 'alert');
      el.closest('.f-row').appendChild(s);
      el.setAttribute('aria-describedby', s.id);
    });

    const check = (el, show) => {
      const rule = RULES[el.id];
      if (!rule) return true;
      const good = rule.ok(el.value);
      const row = el.closest('.f-row');
      if (show || row.classList.contains('was-checked')) {
        row.classList.toggle('is-bad', !good);
        $('.f-err', row).textContent = good ? '' : rule.msg;
        el.setAttribute('aria-invalid', String(!good));
      }
      return good;
    };

    // Block characters that can never belong in these fields, as they are typed.
    const filter = (el, allowed) => el.addEventListener('input', () => {
      const clean = el.value.replace(allowed, '');
      if (clean === el.value) return;
      const pos = Math.max(0, el.selectionStart - (el.value.length - clean.length));
      el.value = clean;
      try { el.setSelectionRange(pos, pos); } catch (e) {}
    });
    filter($('#fPhone'), /[^\d+\-()\s]/g);   // digits and phone punctuation only
    filter($('#fQty'),  /[^\d,\s]/g);        // digits and thousands separators only

    // validate as they leave a field, then live once it has been flagged
    Object.keys(RULES).forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      el.addEventListener('blur', () => { el.closest('.f-row').classList.add('was-checked'); check(el, true); });
      el.addEventListener('input', () => check(el, false));
      el.addEventListener('change', () => check(el, false));
    });

    f.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true, firstBad = null;
      Object.keys(RULES).forEach(id => {
        const el = $('#' + id);
        if (!el) return;
        el.closest('.f-row').classList.add('was-checked');
        if (!check(el, true)) { ok = false; if (!firstBad) firstBad = el; }
      });
      if (!ok) {
        gsap.fromTo(f, { x: -6 }, { x: 0, duration: .45, ease: 'elastic.out(1,0.35)' });
        if (firstBad) firstBad.focus();
        return;
      }

      const btn = $('#submitBtn'), label = $('span', btn);
      const body = new URLSearchParams(new FormData(f)).toString();

      // Delivered via Netlify Forms — free, no backend of our own. Netlify's
      // build step detects the <form data-netlify="true"> in index.html and
      // wires up an endpoint automatically; this just submits to it the way
      // Netlify's own docs describe for JS-driven forms (a plain POST to the
      // current page with the fields urlencoded). Only works once the site is
      // deployed on Netlify — on the local dev server this request 404s, so
      // we still show success either way rather than blocking the demo.
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
        .catch(() => {});

      // Also logs the same submission as a row in a Google Sheet, if set up.
      // mode:'no-cors' is required for Apps Script Web Apps — we don't need
      // to read the response, just fire the request.
      if (SHEET_ENDPOINT) {
        fetch(SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
          .catch(() => {});
      }

      // Clear straight away rather than on a timer. A delayed reset would fire
      // over the top of anything picked in the meantime — choosing another
      // fabric right after sending would silently wipe itself a moment later.
      f.reset();
      $$('.f-row').forEach(r => r.classList.remove('has-val', 'is-bad', 'was-checked'));
      $$('.f-err').forEach(s => { s.textContent = ''; });

      btn.classList.add('is-sent');
      label.textContent = 'Enquiry Sent ✓';
      clearTimeout(restoreBtn);
      restoreBtn = setTimeout(() => { btn.classList.remove('is-sent'); label.textContent = 'Send Enquiry'; }, 4200);
    });
  }

  /* ==========================================================
     18. FILM MODAL
     ========================================================== */
  function modal() {
    const m = $('#filmModal'), open = $('#openFilm'), x = $('#modalX');
    const vid = () => $('video', m);
    const close = () => { m.classList.remove('is-open'); if (vid()) vid().pause(); if (lenis) lenis.start(); };
    open.addEventListener('click', () => { m.classList.add('is-open'); if (lenis) lenis.stop(); if (vid()) vid().play().catch(() => {}); });
    x.addEventListener('click', close);
    m.addEventListener('click', e => { if (e.target === m) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ==========================================================
     BOOT
     ========================================================== */
  heroIntro();

  nav();
  loomCanvas();
  droplets();
  heroVideos();
  products(quickView());
  rings();
  timeline();
  reveals();
  form();
  modal();

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
