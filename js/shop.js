/* ============================
   SHOP.JS v2.0
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid        = document.getElementById('shopProductsGrid');
  const pagination  = document.getElementById('pagination');
  const resultCount = document.getElementById('resultCount');
  const sortSelect  = document.getElementById('sortSelect');
  const priceRange  = document.getElementById('priceRange');
  const priceVal    = document.getElementById('priceVal');
  const inStockOnly = document.getElementById('inStockOnly');
  const onSaleOnly  = document.getElementById('onSaleOnly');
  const ratingRadios = document.querySelectorAll('input[name="rating"]');

  const PER_PAGE = 9;
  let currentPage = 1;
  let filteredProducts = [];
  let viewMode = 'grid'; // 'grid' | 'list'

  // ── URL Parameters ──
  const params = new URLSearchParams(location.search);
  const urlCat    = params.get('cat')  || '';
  const urlQ      = params.get('q')    || '';
  const urlFilter = params.get('filter') || '';
  const urlSort   = params.get('sort')  || '';

  // Pre-select from URL
  if (urlCat && urlCat !== 'all') {
    const allBox = document.getElementById('catAll');
    if (allBox) allBox.checked = false;
    const target = document.querySelector(`.filter-check input[value="${urlCat}"]`);
    if (target) target.checked = true;
  }
  if (urlSort && sortSelect) sortSelect.value = urlSort;
  if (urlQ) {
    const h = document.querySelector('.page-hero h1');
    if (h) h.innerHTML = `Results for <span class="highlight">"${urlQ}"</span>`;
  }

  // ── Get active filters ──
  function getActiveCategories() {
    const allBox = document.getElementById('catAll');
    if (allBox?.checked) return [];
    return Array.from(document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll):not(#inStockOnly):not(#onSaleOnly):checked')).map(cb => cb.value);
  }

  function getMaxPrice() { return parseInt(priceRange?.value || 5000); }
  function getMinRating() { return parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0); }

  // ── Apply all filters + sort ──
  function applyFilters() {
    const cats      = getActiveCategories();
    const maxPrice  = getMaxPrice();
    const minRating = getMinRating();
    const stockOnly = inStockOnly?.checked;
    const saleOnly  = onSaleOnly?.checked;
    const query     = urlQ.toLowerCase();

    filteredProducts = PRODUCTS.filter(p => {
      if (cats.length && !cats.includes(p.cat)) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (stockOnly && !p.inStock) return false;
      if (saleOnly && !p.isSale) return false;
      if (urlFilter === 'newest' && !p.isNew) return false;
      if (query && !p.name.toLowerCase().includes(query) &&
          !p.cat.includes(query) &&
          !(p.brand || '').toLowerCase().includes(query) &&
          !p.tags.some(t => t.includes(query))) return false;
      return true;
    });

    // Sort
    const sort = sortSelect?.value || 'default';
    switch (sort) {
      case 'price-asc':  filteredProducts.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filteredProducts.sort((a, b) => b.price - a.price); break;
      case 'rating':     filteredProducts.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'discount':   filteredProducts.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a)); break;
      case 'reviews':    filteredProducts.sort((a, b) => b.reviews - a.reviews); break;
    }

    currentPage = 1;
    renderPage();
  }

  // ── Render current page ──
  function renderPage() {
    const total = filteredProducts.length;
    if (resultCount) resultCount.textContent = total;

    const start   = (currentPage - 1) * PER_PAGE;
    const pageItems = filteredProducts.slice(start, start + PER_PAGE);

    // Show/hide no-results
    if (!pageItems.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:4rem 2rem;">
          <i class="fas fa-search" style="font-size:4rem;opacity:.15;margin-bottom:1rem;display:block;color:var(--primary)"></i>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms.</p>
          <button class="btn btn-primary" id="clearFiltersMain" style="margin-top:1rem">
            <i class="fas fa-rotate-left"></i> Clear All Filters
          </button>
        </div>`;
      document.getElementById('clearFiltersMain')?.addEventListener('click', clearFilters);
      if (pagination) pagination.innerHTML = '';
      return;
    }

    // Stagger render for animation
    grid.innerHTML = '';
    pageItems.forEach((p, i) => {
      const card = document.createElement('div');
      card.style.animationDelay = `${i * 0.06}s`;
      card.innerHTML = productCardHTML(p);
      grid.appendChild(card.firstElementChild);
    });
    bindProductCards(grid);
    renderPagination(total);
    window.scrollTo({ top: document.querySelector('.shop-layout')?.offsetTop - 80 || 0, behavior: 'smooth' });
  }

  // ── Pagination ──
  function renderPagination(total) {
    if (!pagination) return;
    const totalPages = Math.ceil(total / PER_PAGE);
    if (totalPages <= 1) { pagination.innerHTML = ''; return; }

    let html = '';
    // Prev
    html += `<button class="page-btn ${currentPage === 1 ? 'dots' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;

    // Pages with ellipsis
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        html += `<button class="page-btn dots" disabled>…</button>`;
      }
    }

    // Next
    html += `<button class="page-btn ${currentPage === totalPages ? 'dots' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;

    pagination.innerHTML = html;
    pagination.querySelectorAll('.page-btn:not(.dots):not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        renderPage();
      });
    });
  }

  // ── Clear Filters ──
  function clearFilters() {
    const allBox = document.getElementById('catAll');
    if (allBox) allBox.checked = true;
    document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll)').forEach(cb => cb.checked = false);
    if (priceRange) { priceRange.value = 5000; if (priceVal) priceVal.textContent = '₹5,000'; }
    const r0 = document.querySelector('input[name="rating"][value="0"]');
    if (r0) r0.checked = true;
    if (inStockOnly) inStockOnly.checked = false;
    if (onSaleOnly)  onSaleOnly.checked  = false;
    if (sortSelect)  sortSelect.value = 'default';
    applyFilters();
    showToast('Filters cleared!');
  }

  // ── Category Checkbox Logic (mutual exclusion with All) ──
  document.querySelectorAll('.filter-check input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.id === 'catAll' && cb.checked) {
        document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll):not(#inStockOnly):not(#onSaleOnly)')
          .forEach(o => o.checked = false);
      } else if (cb.id !== 'inStockOnly' && cb.id !== 'onSaleOnly' && cb.checked) {
        const allBox = document.getElementById('catAll');
        if (allBox) allBox.checked = false;
      }
      applyFilters();
    });
  });

  // ── Price Range ──
  priceRange?.addEventListener('input', () => {
    if (priceVal) priceVal.textContent = `₹${parseInt(priceRange.value).toLocaleString('en-IN')}`;
    applyFilters();
  });

  // ── Sort + other controls ──
  sortSelect?.addEventListener('change', applyFilters);
  ratingRadios.forEach(r => r.addEventListener('change', applyFilters));
  inStockOnly?.addEventListener('change', applyFilters);
  onSaleOnly?.addEventListener('change', applyFilters);
  document.getElementById('clearFilters')?.addEventListener('click', clearFilters);

  // ── View Toggle (Grid / List) ──
  document.getElementById('gridView')?.addEventListener('click', () => {
    viewMode = 'grid';
    grid.classList.remove('list-view');
    document.getElementById('gridView').classList.add('active');
    document.getElementById('listView')?.classList.remove('active');
    LS.set('sn_view', 'grid');
  });
  document.getElementById('listView')?.addEventListener('click', () => {
    viewMode = 'list';
    grid.classList.add('list-view');
    document.getElementById('listView').classList.add('active');
    document.getElementById('gridView')?.classList.remove('active');
    LS.set('sn_view', 'list');
  });

  // Restore view preference
  if (LS.get('sn_view') === 'list') {
    document.getElementById('listView')?.click();
  }

  // ── Mobile Sidebar Toggle ──
  const sidebar = document.getElementById('shopSidebar');
  document.getElementById('filterToggle')?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    if (sidebar?.classList.contains('open')) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  });
  document.addEventListener('click', e => {
    if (sidebar?.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !document.getElementById('filterToggle')?.contains(e.target)) {
      sidebar.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ── Initialize ──
  applyFilters();
});
