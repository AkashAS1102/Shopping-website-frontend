/* ============================
   UTILS v3.0 – Enterprise Core Library
   Shared Across All Pages
   Cart, Wishlist, Currency, Theme, Compare, Quick View, Notifications
   ============================ */

// ── 1. LocalStorage Helpers ──
const LS = {
  get: (k, def = null) => {
    try {
      const val = localStorage.getItem(k);
      return val !== null ? JSON.parse(val) : def;
    } catch { return def; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  remove: (k) => localStorage.removeItem(k),
};

// ── 2. Currency Engine ──
function getSelectedCurrency() {
  return LS.get('sn_currency', 'INR');
}

function setCurrency(cur) {
  if (CURRENCIES[cur]) {
    LS.set('sn_currency', cur);
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: cur } }));
    document.querySelectorAll('.currency-select').forEach(sel => sel.value = cur);
    // Reload or re-render
    showToast(`Currency changed to ${CURRENCIES[cur].name} (${CURRENCIES[cur].symbol})`);
    setTimeout(() => location.reload(), 300);
  }
}

function formatPrice(n) {
  if (n === undefined || n === null) return '₹0';
  const curKey = getSelectedCurrency();
  const cur = CURRENCIES[curKey] || CURRENCIES.INR;
  const converted = Math.round(n * cur.rate);

  if (curKey === 'INR') {
    return '₹' + converted.toLocaleString('en-IN');
  } else if (curKey === 'USD') {
    return '$' + converted.toLocaleString('en-US');
  } else if (curKey === 'EUR') {
    return '€' + converted.toLocaleString('de-DE');
  } else if (curKey === 'GBP') {
    return '£' + converted.toLocaleString('en-GB');
  }
  return cur.symbol + converted.toLocaleString();
}

function initCurrencySelector() {
  const current = getSelectedCurrency();
  document.querySelectorAll('.currency-select').forEach(sel => {
    sel.value = current;
    sel.addEventListener('change', e => setCurrency(e.target.value));
  });
}

// ── 3. Dark Theme System ──
function getActiveTheme() {
  return LS.get('sn_theme', 'light');
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  LS.set('sn_theme', theme);
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun" style="color:#fee140"></i>' : '<i class="fas fa-moon"></i>';
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  });
}

function toggleTheme() {
  const next = getActiveTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  showToast(`${next === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated!`);
}

function initTheme() {
  const current = getActiveTheme();
  setTheme(current);
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

// ── 4. Cart Operations ──
function getCart() { return LS.get('sn_cart', []); }
function saveCart(c) { LS.set('sn_cart', c); updateBadges(); dispatchCartEvent(); }

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += qty; }
  else { cart.push({ id: productId, qty, addedAt: Date.now() }); }
  saveCart(cart);
  showToast(`✨ Added to cart!`);
  animateBadge('cartBadge');
  updateSideCart();
}

function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
  updateSideCart();
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) { item.qty = Math.max(1, qty); saveCart(cart); }
}

function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const p = getProductById(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getCartItemQty(id) {
  return getCart().find(i => i.id === id)?.qty || 0;
}

function dispatchCartEvent() {
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: getCartCount(), total: getCartTotal() } }));
}

// ── 5. Wishlist Operations ──
function getWishlist() { return LS.get('sn_wish', []); }
function saveWishlist(w) { LS.set('sn_wish', w); updateBadges(); }

function toggleWishlist(productId) {
  const w = getWishlist();
  const idx = w.indexOf(productId);
  let added;
  if (idx > -1) { w.splice(idx, 1); showToast('Removed from wishlist'); added = false; }
  else { w.push(productId); showToast('❤️ Added to wishlist!'); animateBadge('wishlistBadge'); added = true; }
  saveWishlist(w);
  return added;
}

function addToWishlist(productId) {
  const w = getWishlist();
  if (!w.includes(productId)) { w.push(productId); saveWishlist(w); animateBadge('wishlistBadge'); showToast('❤️ Added to wishlist!'); }
}

function removeFromWishlist(productId) {
  saveWishlist(getWishlist().filter(id => id !== productId));
}

function isWishlisted(productId) { return getWishlist().includes(productId); }

// ── 6. Product Compare System ──
function getCompareList() { return LS.get('sn_compare', []); }
function saveCompareList(list) { LS.set('sn_compare', list); updateCompareDock(); }

function toggleCompare(productId) {
  const list = getCompareList();
  const idx = list.indexOf(productId);
  if (idx > -1) {
    list.splice(idx, 1);
    saveCompareList(list);
    showToast('Removed from comparison list');
    return false;
  } else {
    if (list.length >= 4) {
      showToast('You can compare a maximum of 4 items at once.', 'warning');
      return false;
    }
    list.push(productId);
    saveCompareList(list);
    showToast('⚖️ Added to compare list!');
    return true;
  }
}

function isCompared(productId) {
  return getCompareList().includes(productId);
}

function updateCompareDock() {
  let dock = document.getElementById('compareDock');
  const list = getCompareList();

  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'compareDock';
    dock.className = 'compare-dock';
    document.body.appendChild(dock);
  }

  if (!list.length) {
    dock.classList.remove('show');
    return;
  }

  dock.innerHTML = `
    <div style="display:flex;align-items:center;gap:.75rem;">
      <strong style="font-size:.85rem;color:var(--text);"><i class="fas fa-code-compare" style="color:var(--primary);margin-right:.3rem"></i> Compare (${list.length}/4)</strong>
      <div class="compare-dock-thumbs">
        ${list.map(id => {
          const p = getProductById(id);
          if (!p) return '';
          return `
            <div class="compare-thumb-item" title="${p.name}">
              <i class="fas ${p.icon}"></i>
              <button class="compare-thumb-remove" data-id="${p.id}">&times;</button>
            </div>`;
        }).join('')}
      </div>
    </div>
    <div style="display:flex;gap:.5rem;align-items:center;">
      <button class="btn btn-primary" id="openCompareModalBtn" style="padding:.4rem 1rem;font-size:.8rem;border-radius:20px;">
        Compare Now
      </button>
      <button class="btn-text" id="clearCompareBtn" style="font-size:.78rem;color:var(--text-muted);">&times; Clear</button>
    </div>`;

  dock.classList.add('show');

  // Bind remove item
  dock.querySelectorAll('.compare-thumb-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleCompare(parseInt(btn.dataset.id));
      document.querySelectorAll(`.compare-btn[data-id="${btn.dataset.id}"]`).forEach(b => b.classList.remove('active'));
    });
  });

  document.getElementById('clearCompareBtn')?.addEventListener('click', () => {
    saveCompareList([]);
    document.querySelectorAll('.compare-btn').forEach(b => b.classList.remove('active'));
    showToast('Comparison list cleared');
  });

  document.getElementById('openCompareModalBtn')?.addEventListener('click', openCompareModal);
}

function openCompareModal() {
  const list = getCompareList();
  if (list.length < 2) {
    showToast('Please select at least 2 items to compare.', 'warning');
    return;
  }

  const products = list.map(id => getProductById(id)).filter(Boolean);

  let modal = document.getElementById('compareModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'compareModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-box" style="max-width:980px;">
      <button class="modal-close" onclick="document.getElementById('compareModal').classList.remove('active')">&times;</button>
      <h3 style="font-size:1.35rem;font-weight:800;margin-bottom:1.5rem;"><i class="fas fa-code-compare" style="color:var(--primary);margin-right:.5rem"></i> Product Comparison Matrix</h3>
      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              ${products.map(p => `
                <th class="compare-product-col">
                  <div class="compare-icon"><i class="fas ${p.icon}"></i></div>
                  <strong style="display:block;font-size:.9rem;line-height:1.3;margin-bottom:.3rem;">${p.name}</strong>
                  <div style="color:var(--primary);font-size:1.1rem;font-weight:800;">${formatPrice(p.price)}</div>
                  <div style="font-size:.75rem;color:var(--text-muted);">${p.brand || p.cat}</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Rating &amp; Reviews</th>
              ${products.map(p => `
                <td style="text-align:center;">
                  <div class="stars" style="justify-content:center;">${starsHTML(p.rating)}</div>
                  <span style="font-size:.8rem;color:var(--text-muted);">${p.rating} (${p.reviews} reviews)</span>
                </td>
              `).join('')}
            </tr>
            <tr>
              <th>Category</th>
              ${products.map(p => `<td style="text-align:center;text-transform:capitalize;">${p.cat}</td>`).join('')}
            </tr>
            <tr>
              <th>Availability</th>
              ${products.map(p => `
                <td style="text-align:center;">
                  ${p.inStock ? '<span style="color:var(--success);font-weight:700;"><i class="fas fa-check-circle"></i> In Stock</span>' : '<span style="color:var(--accent);font-weight:700;"><i class="fas fa-times-circle"></i> Out of Stock</span>'}
                </td>
              `).join('')}
            </tr>
            <tr>
              <th>Warranty</th>
              ${products.map(p => `<td style="text-align:center;font-size:.85rem;">${p.warranty || '1 Year Standard'}</td>`).join('')}
            </tr>
            <tr>
              <th>Key Highlights</th>
              ${products.map(p => `
                <td style="font-size:.8rem;line-height:1.5;">
                  ${p.specs ? Object.entries(p.specs).slice(0, 3).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join('') : p.description.slice(0, 80) + '…'}
                </td>
              `).join('')}
            </tr>
            <tr>
              <th>Action</th>
              ${products.map(p => `
                <td style="text-align:center;">
                  ${p.inStock
                    ? `<button class="btn btn-primary" onclick="addToCart(${p.id},1);document.getElementById('compareModal').classList.remove('active');" style="padding:.5rem 1rem;font-size:.8rem;">Add to Cart</button>`
                    : `<button class="btn" style="background:var(--border);padding:.5rem 1rem;font-size:.8rem;" disabled>Out of Stock</button>`}
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;

  modal.classList.add('active');
}

// ── 7. Quick View Modal System ──
function openQuickView(id) {
  const p = getProductById(id);
  if (!p) return;

  let modal = document.getElementById('quickViewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const discount = getDiscountPercent(p);
  const wished   = isWishlisted(p.id);

  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" onclick="document.getElementById('quickViewModal').classList.remove('active')">&times;</button>
      <div class="quick-view-grid">
        <div class="quick-view-img">
          <i class="fas ${p.icon}"></i>
        </div>
        <div>
          <div style="font-size:.75rem;color:var(--primary);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:.3rem;">
            ${p.brand ? `${p.brand} · ` : ''}${p.cat}
          </div>
          <h2 style="font-size:1.45rem;font-weight:800;line-height:1.3;margin-bottom:.5rem;">${p.name}</h2>
          <div class="product-rating" style="margin-bottom:.75rem;">
            <div class="stars">${starsHTML(p.rating)}</div>
            <span style="font-weight:700;font-size:.85rem;">${p.rating}</span>
            <span class="rating-count">(${p.reviews.toLocaleString()} reviews)</span>
          </div>

          <div class="product-price" style="margin-bottom:1rem;">
            <span class="price-current" style="font-size:1.75rem;">${formatPrice(p.price)}</span>
            ${p.originalPrice > p.price ? `
              <span class="price-original">${formatPrice(p.originalPrice)}</span>
              <span class="price-off">${discount}% off</span>` : ''}
          </div>

          <p style="font-size:.88rem;color:var(--text-light);line-height:1.6;margin-bottom:1.25rem;">
            ${p.description}
          </p>

          ${p.sizes?.length ? `
            <div style="margin-bottom:1rem;">
              <strong style="font-size:.85rem;display:block;margin-bottom:.4rem;">Select Size:</strong>
              <div class="size-options">
                ${p.sizes.map((s, i) => `<button class="size-btn ${i===0?'active':''}" onclick="this.parentElement.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');">${s}</button>`).join('')}
              </div>
            </div>` : ''}

          <div style="display:flex;gap:1rem;align-items:center;margin-top:1.25rem;">
            ${p.inStock ? `
              <button class="btn btn-primary" id="qvAddToCartBtn" style="flex:1;justify-content:center;">
                <i class="fas fa-cart-plus"></i> Add to Cart
              </button>` : `
              <button class="btn" style="flex:1;background:var(--border);color:var(--text-muted);cursor:not-allowed;" disabled>
                Out of Stock
              </button>`}
            <button class="wishlist-detail-btn ${wished ? 'wishlisted' : ''}" onclick="toggleWishlist(${p.id});this.classList.toggle('wishlisted');">
              <i class="fa${wished ? 's' : 'r'} fa-heart"></i>
            </button>
            <a href="product.html?id=${p.id}" class="btn btn-outline" style="padding:.75rem 1rem;" title="Full Details">
              <i class="fas fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
      </div>
    </div>`;

  modal.classList.add('active');

  document.getElementById('qvAddToCartBtn')?.addEventListener('click', () => {
    addToCart(p.id, 1);
    modal.classList.remove('active');
  });
}

// ── 8. Badge & Indicator Updates ──
function updateBadges() {
  const cartCount = getCartCount();
  const wishCount = getWishlist().length;
  document.querySelectorAll('#cartBadge').forEach(el => { el.textContent = cartCount; });
  document.querySelectorAll('#wishlistBadge').forEach(el => { el.textContent = wishCount; });
  document.querySelectorAll('#sideCartCount').forEach(el => { el.textContent = cartCount; });
}

function animateBadge(id) {
  document.querySelectorAll('#' + id).forEach(el => {
    el.classList.remove('bounce');
    void el.offsetWidth;
    el.classList.add('bounce');
    setTimeout(() => el.classList.remove('bounce'), 500);
  });
}

// ── 9. Toast Notifications ──
let toastTimer;
function showToast(msg, type = 'success', duration = 3000) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.className = 'toast show ' + type;
  const icon = toast.querySelector('i');
  if (icon) {
    icon.className = type === 'error' ? 'fas fa-circle-xmark' : type === 'warning' ? 'fas fa-triangle-exclamation' : 'fas fa-check-circle';
  }
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── 10. Star HTML Generator ──
function starsHTML(rating) {
  let h = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)       h += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) h += '<i class="fas fa-star-half-stroke"></i>';
    else                   h += '<i class="far fa-star"></i>';
  }
  return h;
}

// ── 11. Unified Product Card Generator ──
function productCardHTML(p, options = {}) {
  const wished   = isWishlisted(p.id);
  const compared = isCompared(p.id);
  const discount = getDiscountPercent(p);
  const badgeClass = p.badge === 'BESTSELLER' ? 'bestseller-badge' : p.isNew ? 'new-badge' : '';

  return `
    <div class="product-card reveal" data-id="${p.id}" data-cat="${p.cat}" data-brand="${p.brand || ''}">
      <div class="product-image">
        <i class="fas ${p.icon} prod-icon"></i>
        ${p.badge ? `<span class="product-badge ${badgeClass}">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn wish-btn heart-beat ${wished ? 'wishlisted' : ''}" data-id="${p.id}" title="${wished ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            <i class="fa${wished ? 's' : 'r'} fa-heart"></i>
          </button>
          <button class="action-btn qv-btn" data-id="${p.id}" title="Quick View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn compare-btn ${compared ? 'active' : ''}" data-id="${p.id}" title="Compare Product">
            <i class="fas fa-code-compare"></i>
          </button>
        </div>
        ${!p.inStock ? '<div style="position:absolute;inset:0;background:rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--text-muted);font-size:.85rem;backdrop-filter:blur(1px);">Out of Stock</div>' : ''}
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}${p.brand ? ` · ${p.brand}` : ''}</div>
        <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-rating">
          <div class="stars">${starsHTML(p.rating)}</div>
          <span class="rating-count">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatPrice(p.price)}</span>
          ${p.originalPrice > p.price ? `
            <span class="price-original">${formatPrice(p.originalPrice)}</span>
            <span class="price-off">${discount}% off</span>` : ''}
        </div>
      </div>
      <div class="product-footer">
        ${p.inStock
          ? `<button class="add-to-cart-btn cart-add" data-id="${p.id}">
               <i class="fas fa-cart-plus"></i> Add to Cart
             </button>`
          : `<button class="out-of-stock-btn" disabled><i class="fas fa-ban"></i> Out of Stock</button>`}
      </div>
    </div>`;
}

// ── 12. Bind Card Events ──
function bindProductCards(container) {
  // Add to cart
  container.querySelectorAll('.cart-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = parseInt(btn.dataset.id);
      addToCart(id);
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
      }, 1800);
    });
  });

  // Quick View
  container.querySelectorAll('.qv-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openQuickView(parseInt(btn.dataset.id));
    });
  });

  // Wishlist toggle
  container.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const added = toggleWishlist(parseInt(btn.dataset.id));
      btn.classList.toggle('wishlisted', added);
      btn.innerHTML = added ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
      btn.title = added ? 'Remove from Wishlist' : 'Add to Wishlist';
    });
  });

  // Compare toggle
  container.querySelectorAll('.compare-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const added = toggleCompare(parseInt(btn.dataset.id));
      btn.classList.toggle('active', added);
    });
  });
}

// ── 13. Flyout Cart Sidebar Drawer ──
function updateSideCart() {
  const itemsEl  = document.getElementById('sideCartItems');
  const totalEl  = document.getElementById('sideCartTotal');
  const countEl  = document.getElementById('sideCartCount');
  if (!itemsEl) return;

  const cart = getCart();
  if (countEl) countEl.textContent = getCartCount();
  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());

  if (!cart.length) {
    itemsEl.innerHTML = `<div class="cart-sidebar-empty">
      <i class="fas fa-shopping-cart"></i><p>Your cart is empty</p>
      <a href="shop.html" class="btn btn-primary" style="margin-top:1rem">Shop Now</a>
    </div>`;
    return;
  }

  itemsEl.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return '';
    return `<div class="side-cart-item">
      <div class="side-cart-img"><i class="fas ${p.icon}"></i></div>
      <div class="side-cart-info">
        <div class="side-cart-name">${p.name}</div>
        <div class="side-cart-price">${formatPrice(p.price)}</div>
        <div class="side-cart-qty">Qty: ${item.qty} · Total: ${formatPrice(p.price * item.qty)}</div>
      </div>
      <button class="side-cart-remove" data-id="${p.id}" title="Remove"><i class="fas fa-trash-alt"></i></button>
    </div>`;
  }).join('');

  itemsEl.querySelectorAll('.side-cart-remove').forEach(btn => {
    btn.addEventListener('click', () => { removeFromCart(parseInt(btn.dataset.id)); });
  });
}

function openSideCart() {
  document.getElementById('cartSidebarEl')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
  updateSideCart();
}

function closeSideCart() {
  document.getElementById('cartSidebarEl')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

// ── 14. Live Purchase Notification Simulator ──
function initLivePurchasePopup() {
  const samplePurchases = [
    { city: 'Mumbai', name: 'Smart Watch Pro Series 5', icon: 'fa-clock' },
    { city: 'Bangalore', name: 'Wireless Noise-Cancelling Headphones', icon: 'fa-headphones' },
    { city: 'Delhi', name: '4K Ultra HD Action Camera', icon: 'fa-camera' },
    { city: 'Hyderabad', name: 'Atomic Habits – James Clear', icon: 'fa-book-open' },
    { city: 'Pune', name: 'Vitamin C Brightening Serum 30ml', icon: 'fa-flask' },
    { city: 'Chennai', name: 'Ergonomic Office Chair Mesh', icon: 'fa-couch' },
    { city: 'Kolkata', name: 'Classic Leather Sneakers White', icon: 'fa-shoe-prints' }
  ];

  let popup = document.getElementById('livePurchasePopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'livePurchasePopup';
    popup.className = 'live-purchase-popup';
    document.body.appendChild(popup);
  }

  function triggerPopup() {
    const pick = samplePurchases[Math.floor(Math.random() * samplePurchases.length)];
    const timeMins = Math.floor(Math.random() * 8) + 1;

    popup.innerHTML = `
      <div class="live-purchase-icon"><i class="fas ${pick.icon}"></i></div>
      <div class="live-purchase-info">
        <strong>Someone in ${pick.city} purchased</strong>
        <span>${pick.name} · ${timeMins}m ago</span>
      </div>
      <button class="live-purchase-close" onclick="document.getElementById('livePurchasePopup').classList.remove('show')">&times;</button>
    `;

    popup.classList.add('show');
    setTimeout(() => { popup.classList.remove('show'); }, 6000);
  }

  // Trigger every 30 seconds
  setTimeout(triggerPopup, 8000);
  setInterval(triggerPopup, 35000);
}

// ── 15. Scroll Reveal Observer ──
function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section-header,.trust-item,.testimonial-card,.cat-card,.product-card,.deal-card,.banner-card,.app-content,.app-mockup,.contact-item,.faq-item').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

// ── 16. Navbar & Common UI ──
function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const announcementBar = document.getElementById('announcementBar');

  if (announcementBar && !LS.get('sn_ann_closed')) {
    announcementBar.classList.remove('hidden');
    navbar?.classList.add('announced');
    document.querySelector('.hero')?.classList.add('with-bar');
  }
  document.getElementById('closeAnnouncement')?.addEventListener('click', () => {
    announcementBar?.classList.add('hidden');
    navbar?.classList.remove('announced');
    document.querySelector('.hero')?.classList.remove('with-bar');
    LS.set('sn_ann_closed', true);
  });

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 20);
    document.getElementById('backToTop')?.classList.toggle('show', y > 400);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
  });

  navLinks?.querySelectorAll('a:not(.dropdown-trigger)').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  document.getElementById('backToTop')?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.getElementById('cartNavBtn')?.addEventListener('click', e => {
    e.preventDefault();
    openSideCart();
  });
  document.getElementById('closeSideCart')?.addEventListener('click', closeSideCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeSideCart);

  // Mobile search
  document.getElementById('searchMobileBtn')?.addEventListener('click', () => {
    document.getElementById('mobileSearchBar')?.classList.toggle('show');
    document.getElementById('mobileSearchInput')?.focus();
  });
  document.getElementById('mobileSearchClose')?.addEventListener('click', () => {
    document.getElementById('mobileSearchBar')?.classList.remove('show');
  });
  document.getElementById('mobileSearchSubmit')?.addEventListener('click', () => {
    const q = document.getElementById('mobileSearchInput')?.value.trim();
    if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
  });
  document.getElementById('mobileSearchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const q = e.target.value.trim(); if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`; }
  });

  // Cookie consent
  if (!LS.get('sn_cookie_ok')) {
    setTimeout(() => document.getElementById('cookieBar')?.classList.add('show'), 2000);
  }
  document.getElementById('acceptCookies')?.addEventListener('click', () => {
    LS.set('sn_cookie_ok', true);
    document.getElementById('cookieBar')?.classList.remove('show');
    showToast('Cookie preferences saved!');
  });
  document.getElementById('declineCookies')?.addEventListener('click', () => {
    document.getElementById('cookieBar')?.classList.remove('show');
  });

  updateBadges();
  updateSideCart();
  updateCompareDock();
}

// ── 17. Search Suggestions ──
function initSearch() {
  const inp = document.getElementById('searchInput');
  const sug = document.getElementById('searchSuggestions');
  if (!inp || !sug) return;

  let debounce;
  inp.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = inp.value.trim();
      if (q.length < 2) { sug.classList.remove('show'); sug.innerHTML = ''; return; }
      const results = searchProducts(q).slice(0, 6);
      if (!results.length) {
        sug.innerHTML = `<div class="suggestion-item"><i class="fas fa-search"></i> No products matching "${q}"</div>`;
      } else {
        sug.innerHTML = results.map(p => `
          <a href="product.html?id=${p.id}" class="suggestion-item">
            <i class="fas ${p.icon}"></i>
            <span>${p.name}</span>
            <span class="suggestion-cat">${p.cat} · ${formatPrice(p.price)}</span>
          </a>`).join('');
      }
      sug.classList.add('show');
    }, 200);
  });

  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && inp.value.trim()) {
      window.location.href = `shop.html?q=${encodeURIComponent(inp.value.trim())}`;
    }
  });

  document.addEventListener('click', e => {
    if (!inp.closest('.search-bar')?.contains(e.target)) sug.classList.remove('show');
  });
}

// ── 18. Page Progress Loader ──
function initProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'top-progress';
  document.body.prepend(bar);
  let w = 0;
  const t = setInterval(() => { w = Math.min(w + Math.random() * 20, 90); bar.style.width = w + '%'; }, 80);
  window.addEventListener('load', () => {
    clearInterval(t);
    bar.style.width = '100%';
    setTimeout(() => { bar.style.opacity = '0'; setTimeout(() => bar.remove(), 400); }, 300);
  });
}

// ── DOM Initialization ──
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initTheme();
  initCurrencySelector();
  initNavbar();
  initReveal();
  initSearch();
  initLivePurchasePopup();
});
