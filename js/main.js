/* ============================
   MAIN.JS v2.0 – Homepage
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════
  //  HERO SLIDER
  // ══════════════════════════════
  const slides    = document.querySelectorAll('.slide');
  const dots      = document.querySelectorAll('.dot');
  const totalSlides = slides.length;
  let current = 0, autoSlide, isPaused = false;

  function goToSlide(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = ((n % totalSlides) + totalSlides) % totalSlides;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    stopAuto();
    if (!isPaused) autoSlide = setInterval(() => goToSlide(current + 1), 5500);
  }
  function stopAuto() { clearInterval(autoSlide); }

  document.getElementById('nextSlide')?.addEventListener('click', () => { goToSlide(current + 1); startAuto(); });
  document.getElementById('prevSlide')?.addEventListener('click', () => { goToSlide(current - 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goToSlide(i); startAuto(); }));

  // Swipe support on hero
  const heroEl = document.querySelector('.hero');
  let touchStartX = 0, touchStartY = 0;
  heroEl?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  heroEl?.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      goToSlide(dx > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { goToSlide(current + 1); startAuto(); }
    if (e.key === 'ArrowLeft')  { goToSlide(current - 1); startAuto(); }
  });

  // Pause on visibility hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto(); else startAuto();
  });

  startAuto();

  // ══════════════════════════════
  //  FEATURED PRODUCTS + TABS
  // ══════════════════════════════
  const grid = document.getElementById('productsGrid');
  if (grid) {
    let activeFilter = 'all';
    let isAnimating = false;

    function renderFeatured(filter) {
      const prods = (filter === 'all')
        ? PRODUCTS.filter(p => p.inStock).slice(0, 8)
        : PRODUCTS.filter(p => p.cat === filter && p.inStock).slice(0, 8);
      grid.innerHTML = prods.length
        ? prods.map(productCardHTML).join('')
        : `<div class="empty-state"><i class="fas fa-box-open"></i><p>No products in this category yet.</p></div>`;
      bindProductCards(grid);
      initReveal();
    }

    renderFeatured('all');

    document.querySelectorAll('.filter-tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (isAnimating || tab.dataset.filter === activeFilter) return;
        isAnimating = true;
        document.querySelectorAll('.filter-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeFilter = tab.dataset.filter;

        grid.style.opacity = '0';
        grid.style.transform = 'translateY(15px)';
        grid.style.transition = 'opacity .3s ease, transform .3s ease';
        setTimeout(() => {
          renderFeatured(activeFilter);
          grid.style.opacity = '1';
          grid.style.transform = 'translateY(0)';
          setTimeout(() => { isAnimating = false; }, 300);
        }, 280);
      });
    });
  }

  // ══════════════════════════════
  //  TRENDING PRODUCTS
  // ══════════════════════════════
  const trendGrid = document.getElementById('trendingGrid');
  if (trendGrid) {
    const trending = getTrendingProducts(8);
    trendGrid.innerHTML = trending.map(productCardHTML).join('');
    bindProductCards(trendGrid);
  }

  // ══════════════════════════════
  //  COUNTDOWN TIMER
  // ══════════════════════════════
  function initCountdown() {
    const now = Date.now();
    let endTime = parseInt(LS.get('sn_deal_end', 0));

    // If stored end time is in the past, reset to 6 hours from now
    if (!endTime || endTime < now) {
      endTime = now + (6 * 60 * 60 * 1000);
      LS.set('sn_deal_end', endTime);
    }

    const pad = n => String(n).padStart(2, '0');
    const hoursEl   = document.getElementById('hours');
    const minsEl    = document.getElementById('minutes');
    const secsEl    = document.getElementById('seconds');

    function tick() {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        [hoursEl, minsEl, secsEl].forEach(el => { if (el) el.textContent = '00'; });
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (hoursEl)   hoursEl.textContent   = pad(h);
      if (minsEl)    minsEl.textContent    = pad(m);
      if (secsEl)    secsEl.textContent    = pad(s);
    }
    tick();
    const interval = setInterval(tick, 1000);
    // clean up on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(interval);
    });
    return interval;
  }
  initCountdown();

  // ══════════════════════════════
  //  NEWSLETTER
  // ══════════════════════════════
  document.getElementById('newsletterForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    const email = input?.value.trim();
    if (!email) return;

    // Save email
    const subs = LS.get('sn_subscribers', []);
    if (!subs.includes(email)) { subs.push(email); LS.set('sn_subscribers', subs); }

    const btn = e.target.querySelector('button');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
    btn.disabled = true;
    showToast('🎉 Subscribed! Check your inbox for a 10% discount code.');
    setTimeout(() => {
      e.target.reset();
      btn.innerHTML = orig;
      btn.disabled = false;
    }, 3500);
  });

  // ══════════════════════════════
  //  ANIMATED COUNTERS (stats)
  // ══════════════════════════════
  function initCounters() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count);
        if (isNaN(target)) return;
        animateNumber(el, target, 1500);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
  }
  initCounters();

  // ══════════════════════════════
  //  STICKY HEADER INDICATOR
  // ══════════════════════════════
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--grad-primary);z-index:9999;transition:width .1s ease;pointer-events:none;';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (scrollHeight > 0 ? (scrollTop / scrollHeight * 100) : 0) + '%';
    }, { passive: true });
  }
  initScrollProgress();

  // ══════════════════════════════
  //  RECENTLY VIEWED (local track)
  // ══════════════════════════════
  // (tracking happens on product page; shown here if needed)

  // ══════════════════════════════
  //  PRODUCT CARD HOVER: SHOW QUICK INFO
  // ══════════════════════════════
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hovered'));
    card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
  });

  // ══════════════════════════════
  //  BACK-TO-TOP SMOOTH REVEAL
  // ══════════════════════════════
  const bttBtn = document.getElementById('backToTop');
  if (bttBtn) {
    bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

});
