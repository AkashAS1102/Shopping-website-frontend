/* ============================
   UTILS – Shared across all pages
   ============================ */

// ── LocalStorage Helpers ──
const LS = {
  get: (k, def = []) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

// ── Cart ──
function getCart()  { return LS.get('sn_cart', []); }
function saveCart(c){ LS.set('sn_cart', c); updateBadges(); }

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += qty; }
  else { cart.push({ id: productId, qty }); }
  saveCart(cart);
  showToast(`Added to cart!`);
  animateBadge('cartBadge');
}

function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
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

// ── Wishlist ──
function getWishlist()  { return LS.get('sn_wish', []); }
function saveWishlist(w){ LS.set('sn_wish', w); updateBadges(); }

function toggleWishlist(productId) {
  const w = getWishlist();
  const idx = w.indexOf(productId);
  if (idx > -1) { w.splice(idx, 1); showToast('Removed from wishlist'); }
  else { w.push(productId); showToast('Added to wishlist ❤️'); animateBadge('wishlistBadge'); }
  saveWishlist(w);
  return idx === -1; // returns true if added
}

function isWishlisted(productId) { return getWishlist().includes(productId); }

// ── Badge Updates ──
function updateBadges() {
  const cb = document.getElementById('cartBadge');
  const wb = document.getElementById('wishlistBadge');
  if (cb) cb.textContent = getCartCount();
  if (wb) wb.textContent = getWishlist().length;
}

function animateBadge(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('bounce');
  void el.offsetWidth;
  el.classList.add('bounce');
  setTimeout(() => el.classList.remove('bounce'), 400);
}

// ── Toast ──
let toastTimer;
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Format Currency ──
function formatPrice(n) { return '₹' + n.toLocaleString('en-IN'); }

// ── Star HTML ──
function starsHTML(rating) {
  let h = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) h += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) h += '<i class="fas fa-star-half-stroke"></i>';
    else h += '<i class="far fa-star"></i>';
  }
  return h;
}

// ── Product Card HTML ──
function productCardHTML(p) {
  const wished = isWishlisted(p.id);
  const discount = p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">
        <i class="fas ${p.icon} prod-icon"></i>
        ${p.badge ? `<span class="product-badge${p.isNew ? ' new-badge' : ''}">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn wish-btn ${wished ? 'wishlisted' : ''}" data-id="${p.id}" title="Wishlist">
            <i class="fa${wished ? 's' : 'r'} fa-heart"></i>
          </button>
          <a href="product.html?id=${p.id}" class="action-btn" title="Quick View">
            <i class="fas fa-eye"></i>
          </a>
        </div>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}</div>
        <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-rating">
          <div class="stars">${starsHTML(p.rating)}</div>
          <span class="rating-count">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatPrice(p.price)}</span>
          ${p.originalPrice > p.price ? `<span class="price-original">${formatPrice(p.originalPrice)}</span><span class="price-off">${discount}% off</span>` : ''}
        </div>
      </div>
      <div class="product-footer">
        ${p.inStock
          ? `<button class="add-to-cart-btn cart-add" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Add to Cart</button>`
          : `<button class="out-of-stock-btn" disabled>Out of Stock</button>`}
      </div>
    </div>`;
}

// ── Bind Product Card Events ──
function bindProductCards(container) {
  container.querySelectorAll('.cart-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      addToCart(parseInt(btn.dataset.id));
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      setTimeout(() => btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart', 1500);
    });
  });
  container.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const added = toggleWishlist(parseInt(btn.dataset.id));
      btn.classList.toggle('wishlisted', added);
      btn.innerHTML = added ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    });
  });
}

// ── Navbar ──
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
    // Back to top
    const btn = document.getElementById('backToTop');
    btn?.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
  });

  document.getElementById('backToTop')?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' }));

  updateBadges();
}

// ── Scroll Reveal ──
function initReveal() {
  const els = document.querySelectorAll('.section-header, .trust-item, .testimonial-card, .cat-card, .product-card, .deal-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal', 'visible'); } });
  }, { threshold: 0.1 });
  els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
}

// ── Search (client-side) ──
function initSearch() {
  const inp = document.getElementById('searchInput');
  if (!inp) return;
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && inp.value.trim()) {
      window.location.href = `shop.html?q=${encodeURIComponent(inp.value.trim())}`;
    }
  });
}

// Run on every page
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initSearch();
});
