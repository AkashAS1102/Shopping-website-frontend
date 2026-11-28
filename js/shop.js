/* ============================
   SHOP.JS v3.0 – Enterprise Store Catalog
   Dynamic Brands, Min/Max Pricing, Discount Engine,
   Filter Chips, Items Per Page, Grid/List Views
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid             = document.getElementById('shopProductsGrid');
  const pagination       = document.getElementById('pagination');
  const resultCount      = document.getElementById('resultCount');
  const sortSelect       = document.getElementById('sortSelect');
  const perPageSelect    = document.getElementById('perPageSelect');
  const priceRange       = document.getElementById('priceRange');
  const priceVal         = document.getElementById('priceVal');
  const minPriceInput    = document.getElementById('minPriceInput');
  const maxPriceInput    = document.getElementById('maxPriceInput');
  const inStockOnly      = document.getElementById('inStockOnly');
  const onSaleOnly       = document.getElementById('onSaleOnly');
  const brandChecklist   = document.getElementById('brandChecklist');
  const brandSearch      = document.getElementById('brandSearch');
  const activeChipsWrap  = document.getElementById('activeFilterChips');
  const ratingRadios     = document.querySelectorAll('input[name="rating"]');
  const discountRadios   = document.querySelectorAll('input[name="discount"]');

  let perPage = parseInt(perPageSelect?.value || 9);
  let currentPage = 1;
  let filteredProducts = [];
  let viewMode = 'grid'; // 'grid' | 'list'

  // ── URL Parameters ──
  const params = new URLSearchParams(location.search);
  const urlCat    = params.get('cat')    || '';
  const urlQ      = params.get('q')      || '';
  const urlFilter = params.get('filter') || '';
  const urlSort   = params.get('sort')   || '';

  // ── Build Dynamic Brand Checklist ──
  function initBrands() {
    if (!brandChecklist) return;
    const brandCounts = {};
    PRODUCTS.forEach(p => {
      if (p.brand) {
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      }
    });

    const sortedBrands = Object.keys(brandCounts).sort();
    brandChecklist.innerHTML = sortedBrands.map(b => `
      <label class="filter-check brand-item" data-brand="${b.toLowerCase()}">
        <input type="checkbox" class="brand-check" value="${b}"> ${b} (${brandCounts[b]})
      </label>
    `).join('');

    // Bind brand checkboxes
    brandChecklist.querySelectorAll('.brand-check').forEach(cb => {
      cb.addEventListener('change', () => {
        applyFilters();
      });
    });

    // Real-time Brand Search
    brandSearch?.addEventListener('input', () => {
      const q = brandSearch.value.trim().toLowerCase();
      brandChecklist.querySelectorAll('.brand-item').forEach(el => {
        const b = el.getAttribute('data-brand');
        el.style.display = b.includes(q) ? 'flex' : 'none';
      });
    });
  }

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

  // ── Active Filter Getters ──
  function getActiveCategories() {
    const allBox = document.getElementById('catAll');
    if (allBox?.checked) return [];
    return Array.from(document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll):not(#inStockOnly):not(#onSaleOnly):not(.brand-check):checked')).map(cb => cb.value);
  }

  function getActiveBrands() {
    return Array.from(document.querySelectorAll('.brand-check:checked')).map(cb => cb.value);
  }

  function getMinPrice() {
    return parseInt(minPriceInput?.value) || 0;
  }

  function getMaxPrice() {
    return parseInt(maxPriceInput?.value) || parseInt(priceRange?.value) || 60000;
  }

  function getMinRating() {
    return parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0);
  }

  function getMinDiscount() {
    return parseInt(document.querySelector('input[name="discount"]:checked')?.value || 0);
  }

  // ── Apply all filters + sort ──
  function applyFilters() {
    const cats        = getActiveCategories();
    const brands      = getActiveBrands();
    const minPrice    = getMinPrice();
    const maxPrice    = getMaxPrice();
    const minRating   = getMinRating();
    const minDiscount = getMinDiscount();
    const stockOnly   = inStockOnly?.checked;
    const saleOnly    = onSaleOnly?.checked;
    const query       = urlQ.toLowerCase();

    filteredProducts = PRODUCTS.filter(p => {
      if (cats.length && !cats.includes(p.cat)) return false;
      if (brands.length && (!p.brand || !brands.includes(p.brand))) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (minDiscount > 0 && getDiscountPercent(p) < minDiscount) return false;
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
    renderChips();
    renderPage();
  }

  // ── Active Filter Chips ──
  function renderChips() {
    if (!activeChipsWrap) return;
    const chips = [];
    const cats = getActiveCategories();
    const brands = getActiveBrands();
    const minP = getMinPrice();
    const maxP = getMaxPrice();
    const minR = getMinRating();
    const minD = getMinDiscount();

    cats.forEach(c => chips.push({ label: `Cat: ${c}`, clear: () => {
      const box = document.querySelector(`.filter-check input[value="${c}"]`);
      if (box) box.checked = false;
      if (!getActiveCategories().length) {
        const all = document.getElementById('catAll');
        if (all) all.checked = true;
      }
    }}));

    brands.forEach(b => chips.push({ label: `Brand: ${b}`, clear: () => {
      const box = document.querySelector(`.brand-check[value="${b}"]`);
      if (box) box.checked = false;
    }}));

    if (minP > 0 || maxP < 60000) {
      chips.push({ label: `Price: ${formatPrice(minP)} – ${formatPrice(maxP)}`, clear: () => {
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '60000';
        if (priceRange) priceRange.value = 60000;
        if (priceVal) priceVal.textContent = '₹60,000';
      }});
    }

    if (minR > 0) {
      chips.push({ label: `${minR}★ & above`, clear: () => {
        const r0 = document.querySelector('input[name="rating"][value="0"]');
        if (r0) r0.checked = true;
      }});
    }

    if (minD > 0) {
      chips.push({ label: `${minD}%+ Off`, clear: () => {
        const d0 = document.querySelector('input[name="discount"][value="0"]');
        if (d0) d0.checked = true;
      }});
    }

    if (inStockOnly?.checked) {
      chips.push({ label: 'In Stock Only', clear: () => { inStockOnly.checked = false; }});
    }

    if (onSaleOnly?.checked) {
      chips.push({ label: 'On Sale', clear: () => { onSaleOnly.checked = false; }});
    }

    if (!chips.length) {
      activeChipsWrap.innerHTML = '';
      return;
    }

    activeChipsWrap.innerHTML = chips.map((chip, idx) => `
      <span class="filter-chip">
        ${chip.label}
        <button data-chip-idx="${idx}">&times;</button>
      </span>
    `).join('') + `
      <button id="clearAllChipsBtn" class="btn-text" style="font-size:.78rem;color:var(--accent);margin-left:.25rem;">
        Clear All
      </button>
    `;

    activeChipsWrap.querySelectorAll('button[data-chip-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.chipIdx);
        chips[idx].clear();
        applyFilters();
      });
    });

    document.getElementById('clearAllChipsBtn')?.addEventListener('click', clearFilters);
  }

  // ── Render current page ──
  function renderPage() {
    const total = filteredProducts.length;
    if (resultCount) resultCount.textContent = total;

    const start   = (currentPage - 1) * perPage;
    const pageItems = filteredProducts.slice(start, start + perPage);

    // Show/hide no-results
    if (!pageItems.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:4rem 2rem;">
          <i class="fas fa-search" style="font-size:4rem;opacity:.15;margin-bottom:1rem;display:block;color:var(--primary)"></i>
          <h3>No products match your filters</h3>
          <p>Try resetting some filters or search query to explore more items.</p>
          <button class="btn btn-primary" id="clearFiltersMain" style="margin-top:1rem">
            <i class="fas fa-rotate-left"></i> Reset All Filters
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
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = productCardHTML(p);
      grid.appendChild(card.firstElementChild);
    });
    bindProductCards(grid);
    renderPagination(total);
  }

  // ── Pagination ──
  function renderPagination(total) {
    if (!pagination) return;
    const totalPages = Math.ceil(total / perPage);
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
        window.scrollTo({ top: document.querySelector('.shop-layout')?.offsetTop - 80 || 0, behavior: 'smooth' });
      });
    });
  }

  // ── Clear Filters ──
  function clearFilters() {
    const allBox = document.getElementById('catAll');
    if (allBox) allBox.checked = true;
    document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll)').forEach(cb => cb.checked = false);
    if (brandSearch) brandSearch.value = '';
    brandChecklist?.querySelectorAll('.brand-item').forEach(el => el.style.display = 'flex');
    if (priceRange) { priceRange.value = 60000; if (priceVal) priceVal.textContent = '₹60,000'; }
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '60000';
    const r0 = document.querySelector('input[name="rating"][value="0"]');
    if (r0) r0.checked = true;
    const d0 = document.querySelector('input[name="discount"][value="0"]');
    if (d0) d0.checked = true;
    if (inStockOnly) inStockOnly.checked = false;
    if (onSaleOnly)  onSaleOnly.checked  = false;
    if (sortSelect)  sortSelect.value = 'default';
    applyFilters();
    showToast('Filters cleared!');
  }

  // ── Category Checkbox Logic (mutual exclusion with All) ──
  document.querySelectorAll('.filter-check input[type="checkbox"]:not(.brand-check)').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.id === 'catAll' && cb.checked) {
        document.querySelectorAll('.filter-check input[type="checkbox"]:not(#catAll):not(#inStockOnly):not(#onSaleOnly):not(.brand-check)')
          .forEach(o => o.checked = false);
      } else if (cb.id !== 'inStockOnly' && cb.id !== 'onSaleOnly' && cb.checked) {
        const allBox = document.getElementById('catAll');
        if (allBox) allBox.checked = false;
      }
      applyFilters();
    });
  });

  // ── Price Range Slider & Numeric Inputs Sync ──
  priceRange?.addEventListener('input', () => {
    const val = parseInt(priceRange.value);
    if (priceVal) priceVal.textContent = `₹${val.toLocaleString('en-IN')}`;
    if (maxPriceInput) maxPriceInput.value = val;
    applyFilters();
  });

  maxPriceInput?.addEventListener('input', () => {
    const val = parseInt(maxPriceInput.value) || 60000;
    if (priceRange) priceRange.value = Math.min(val, 60000);
    if (priceVal) priceVal.textContent = `₹${Math.min(val, 60000).toLocaleString('en-IN')}`;
    applyFilters();
  });

  minPriceInput?.addEventListener('input', applyFilters);

  // ── Sort + Per Page + other controls ──
  sortSelect?.addEventListener('change', applyFilters);
  perPageSelect?.addEventListener('change', () => {
    perPage = parseInt(perPageSelect.value);
    currentPage = 1;
    renderPage();
  });
  ratingRadios.forEach(r => r.addEventListener('change', applyFilters));
  discountRadios.forEach(r => r.addEventListener('change', applyFilters));
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

  // ── CSV Export of Filtered Catalog ──
  function exportFilteredToCSV() {
    if (!filteredProducts.length) {
      showToast('No products to export!', 'warning');
      return;
    }
    const headers = ['ID', 'Name', 'Brand', 'Category', 'Price (INR)', 'Original Price', 'Rating', 'Stock Status'];
    const rows = filteredProducts.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      p.cat,
      p.price,
      p.originalPrice || p.price,
      p.rating,
      p.inStock ? 'In Stock' : 'Out of Stock'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShopNow_Catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Catalog exported to CSV successfully!', 'success');
  }
  document.getElementById('exportCatalogBtn')?.addEventListener('click', exportFilteredToCSV);

  // ── Share Filtered Search Link ──
  document.getElementById('shareSearchBtn')?.addEventListener('click', () => {
    const url = new URL(window.location.href);
    const cats = getActiveCategories();
    if (cats.length) url.searchParams.set('cat', cats.join(','));
    copyToClipboard(url.href, 'Search link copied to clipboard!');
  });

  // ── Keyboard shortcuts for Pagination ──
  document.addEventListener('keydown', e => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const totalPages = Math.ceil(filteredProducts.length / perPage);
    if (e.key === 'ArrowRight' && currentPage < totalPages) {
      currentPage++;
      renderPage();
    } else if (e.key === 'ArrowLeft' && currentPage > 1) {
      currentPage--;
      renderPage();
    }
  });

  // ── Price Presets Buttons Handler ──
  document.querySelectorAll('.price-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.price-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const min = parseInt(btn.dataset.min || 0);
      const max = parseInt(btn.dataset.max || 60000);
      if (minPriceInput) minPriceInput.value = min;
      if (maxPriceInput) maxPriceInput.value = max;
      if (priceRange) priceRange.value = max;
      if (priceVal) priceVal.textContent = `₹${max.toLocaleString('en-IN')}`;
      applyFilters();
    });
  });

  // ── Initialize ──
  initBrands();
  applyFilters();
});
