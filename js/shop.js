/* ============================
   SHOP.JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid       = document.getElementById('shopProductsGrid');
  const pagination = document.getElementById('pagination');
  const resultCount = document.getElementById('resultCount');
  const sortSelect = document.getElementById('sortSelect');
  const priceRange = document.getElementById('priceRange');
  const priceVal   = document.getElementById('priceVal');
  const ratingRadios = document.querySelectorAll('input[name="rating"]');
  const inStockOnly = document.getElementById('inStockOnly');
  const onSaleOnly  = document.getElementById('onSaleOnly');

  const PER_PAGE = 9;
  let currentPage = 1;
  let filteredProducts = [];

  // ── Read URL params ──
  const params = new URLSearchParams(location.search);
  const urlCat = params.get('cat') || 'all';
  const urlQ   = params.get('q')   || '';

  // Pre-select category checkbox
  if (urlCat !== 'all') {
    document.querySelectorAll('.filter-check input[type="checkbox"]').forEach(cb => {
      if (cb.value === 'all') cb.checked = false;
      if (cb.value === urlCat) cb.checked = true;
    });
  }

  // ── Get active categories ──
  function getSelectedCats() {
    const allBox = document.getElementById('catAll');
    if (allBox?.checked) return ['all'];
    const checked = [];
    document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll):not(#inStockOnly):not(#onSaleOnly)')
      .forEach(cb => { if (cb.checked) checked.push(cb.value); });
    return checked.length ? checked : ['all'];
  }

  function applyFilters() {
    const cats      = getSelectedCats();
    const maxPrice  = parseInt(priceRange?.value || 5000);
    const minRating = parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0);
    const stockOnly = inStockOnly?.checked;
    const saleOnly  = onSaleOnly?.checked;
    let query = urlQ.toLowerCase();

    filteredProducts = PRODUCTS.filter(p => {
      if (cats[0] !== 'all' && !cats.includes(p.cat)) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (stockOnly && !p.inStock) return false;
      if (saleOnly && !p.isSale) return false;
      if (query && !p.name.toLowerCase().includes(query) && !p.cat.toLowerCase().includes(query)) return false;
      return true;
    });

    // Sort
    const sort = sortSelect?.value;
    if (sort === 'price-asc')  filteredProducts.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     filteredProducts.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest')     filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    currentPage = 1;
    render();
  }

  function render() {
    const total = filteredProducts.length;
    if (resultCount) resultCount.textContent = total;

    const start = (currentPage - 1) * PER_PAGE;
    const page  = filteredProducts.slice(start, start + PER_PAGE);

    if (!page.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <i class="fas fa-search-minus"></i>
        <p>No products found. Try different filters.</p>
        <button class="btn btn-primary" id="clearFiltersMain">Clear Filters</button>
      </div>`;
      document.getElementById('clearFiltersMain')?.addEventListener('click', clearFilters);
    } else {
      grid.innerHTML = page.map(productCardHTML).join('');
      bindProductCards(grid);
    }

    renderPagination(total);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderPagination(total) {
    if (!pagination) return;
    const pages = Math.ceil(total / PER_PAGE);
    if (pages <= 1) { pagination.innerHTML = ''; return; }

    let html = '';
    for (let i = 1; i <= pages; i++) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    pagination.innerHTML = html;
    pagination.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        render();
      });
    });
  }

  function clearFilters() {
    document.getElementById('catAll').checked = true;
    document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll)').forEach(cb => cb.checked = false);
    if (priceRange) priceRange.value = 5000;
    if (priceVal) priceVal.textContent = '₹5000';
    document.querySelector('input[name="rating"][value="0"]').checked = true;
    if (inStockOnly) inStockOnly.checked = false;
    if (onSaleOnly) onSaleOnly.checked = false;
    applyFilters();
  }

  // ── Event Listeners ──
  priceRange?.addEventListener('input', () => {
    if (priceVal) priceVal.textContent = `₹${priceRange.value}`;
    applyFilters();
  });
  sortSelect?.addEventListener('change', applyFilters);
  ratingRadios.forEach(r => r.addEventListener('change', applyFilters));
  inStockOnly?.addEventListener('change', applyFilters);
  onSaleOnly?.addEventListener('change', applyFilters);
  document.getElementById('clearFilters')?.addEventListener('click', clearFilters);

  document.querySelectorAll('.filter-check input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', e => {
      if (cb.id === 'catAll' && cb.checked) {
        document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll):not(#inStockOnly):not(#onSaleOnly)')
          .forEach(other => other.checked = false);
      } else if (cb.id !== 'inStockOnly' && cb.id !== 'onSaleOnly') {
        document.getElementById('catAll').checked = false;
      }
      applyFilters();
    });
  });

  // ── Grid / List View ──
  document.getElementById('gridView')?.addEventListener('click', () => {
    grid.classList.remove('list-view');
    document.getElementById('gridView')?.classList.add('active');
    document.getElementById('listView')?.classList.remove('active');
  });
  document.getElementById('listView')?.addEventListener('click', () => {
    grid.classList.add('list-view');
    document.getElementById('listView')?.classList.add('active');
    document.getElementById('gridView')?.classList.remove('active');
  });

  // ── Mobile Sidebar Toggle ──
  const sidebar = document.getElementById('shopSidebar');
  document.getElementById('filterToggle')?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!sidebar?.contains(e.target) && !document.getElementById('filterToggle')?.contains(e.target)) {
      sidebar?.classList.remove('open');
    }
  });

  // Init
  applyFilters();
});
