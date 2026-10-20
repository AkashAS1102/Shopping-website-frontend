/* ============================
   MAIN.JS – Homepage
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── HERO SLIDER ──
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0, autoSlide;

  function goToSlide(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    stopAuto();
    autoSlide = setInterval(() => goToSlide(current + 1), 5000);
  }
  function stopAuto() { clearInterval(autoSlide); }

  document.getElementById('nextSlide')?.addEventListener('click', () => { goToSlide(current + 1); startAuto(); });
  document.getElementById('prevSlide')?.addEventListener('click', () => { goToSlide(current - 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goToSlide(i); startAuto(); }));

  // Swipe support
  const heroEl = document.querySelector('.hero');
  let touchStartX = 0;
  heroEl?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  heroEl?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goToSlide(diff > 0 ? current + 1 : current - 1); startAuto(); }
  }, { passive: true });

  startAuto();

  // ── FEATURED PRODUCTS ──
  const grid = document.getElementById('productsGrid');
  if (grid) {
    let activeFilter = 'all';

    function renderFeatured(filter) {
      const products = filter === 'all' ? PRODUCTS.slice(0, 8) : PRODUCTS.filter(p => p.cat === filter).slice(0, 8);
      grid.innerHTML = products.map(productCardHTML).join('');
      bindProductCards(grid);
    }

    renderFeatured('all');

    document.querySelectorAll('.filter-tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeFilter = tab.dataset.filter;
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(10px)';
        setTimeout(() => {
          renderFeatured(activeFilter);
          grid.style.transition = 'opacity .4s ease, transform .4s ease';
          grid.style.opacity = '1';
          grid.style.transform = 'translateY(0)';
        }, 200);
      });
    });
  }

  // ── COUNTDOWN TIMER ──
  function setCountdown() {
    const end = new Date();
    end.setHours(end.getHours() + 5, end.getMinutes() + 30, 0, 0); // 5h 30m from now
    const stored = localStorage.getItem('sn_deal_end');
    const target = stored ? new Date(stored) : end;
    if (!stored) localStorage.setItem('sn_deal_end', end.toISOString());

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) { document.querySelectorAll('.time-block span').forEach(s => s.textContent = '00'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = n => String(n).padStart(2, '0');
      const el = id => document.getElementById(id);
      if (el('hours'))   el('hours').textContent   = pad(h);
      if (el('minutes')) el('minutes').textContent = pad(m);
      if (el('seconds')) el('seconds').textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }
  setCountdown();

  // ── NEWSLETTER ──
  document.getElementById('newsletterForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Subscribed! 🎉 Check your inbox for exclusive deals.');
    e.target.reset();
  });

});
