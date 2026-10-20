/* ============================
   CART.JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const wrap    = document.getElementById('cartItemsWrap');
  const DELIVERY = 49;

  function renderCart() {
    const cart = getCart();
    if (!cart.length) {
      wrap.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet!</p>
          <a href="shop.html" class="btn btn-primary">Start Shopping <i class="fas fa-arrow-right"></i></a>
        </div>`;
      document.getElementById('cartSummary')?.style.setProperty('display', 'none');
      return;
    }

    document.getElementById('cartSummary')?.style.removeProperty('display');

    wrap.innerHTML = `
      <div class="cart-items-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h3 style="font-weight:700;">Cart (${cart.length} item${cart.length !== 1 ? 's' : ''})</h3>
        <button id="clearCartBtn" class="btn-text" style="color:var(--accent)">Clear All</button>
      </div>
      ${cart.map(item => {
        const p = getProductById(item.id);
        if (!p) return '';
        return `
          <div class="cart-item" data-id="${p.id}">
            <div class="cart-item-img"><i class="fas ${p.icon}"></i></div>
            <div class="cart-item-details">
              <div class="cart-item-name"><a href="product.html?id=${p.id}">${p.name}</a></div>
              <div class="cart-item-cat">${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}</div>
              <div class="cart-item-price">${formatPrice(p.price)}</div>
              <div class="cart-item-actions">
                <div class="qty-control">
                  <button class="qty-btn qty-minus" data-id="${p.id}">−</button>
                  <span class="qty-num">${item.qty}</span>
                  <button class="qty-btn qty-plus" data-id="${p.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${p.id}"><i class="fas fa-trash-alt"></i> Remove</button>
                <span style="font-size:.875rem;color:var(--text-light)">Total: <strong>${formatPrice(p.price * item.qty)}</strong></span>
              </div>
            </div>
          </div>`;
      }).join('')}`;

    // Events
    wrap.querySelectorAll('.qty-plus').forEach(btn =>
      btn.addEventListener('click', () => { updateCartQty(parseInt(btn.dataset.id), getItemQty(parseInt(btn.dataset.id)) + 1); renderCart(); updateSummary(); }));
    wrap.querySelectorAll('.qty-minus').forEach(btn =>
      btn.addEventListener('click', () => { const q = getItemQty(parseInt(btn.dataset.id)); if (q <= 1) { removeFromCart(parseInt(btn.dataset.id)); } else { updateCartQty(parseInt(btn.dataset.id), q - 1); } renderCart(); updateSummary(); }));
    wrap.querySelectorAll('.remove-btn').forEach(btn =>
      btn.addEventListener('click', () => { removeFromCart(parseInt(btn.dataset.id)); renderCart(); updateSummary(); showToast('Item removed from cart'); }));
    document.getElementById('clearCartBtn')?.addEventListener('click', () => {
      if (confirm('Clear all items from cart?')) { LS.set('sn_cart', []); updateBadges(); renderCart(); updateSummary(); }
    });

    updateSummary();
  }

  function getItemQty(id) {
    return getCart().find(i => i.id === id)?.qty || 0;
  }

  let appliedCoupon = null;

  function updateSummary() {
    const cart    = getCart();
    const subtotal = cart.reduce((s, i) => { const p = getProductById(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
    let discount  = 0;

    if (appliedCoupon) {
      const c = COUPONS[appliedCoupon];
      discount = c.type === 'percent' ? Math.round(subtotal * c.discount / 100) : c.discount;
    }

    const delivery = subtotal > 499 ? 0 : (cart.length ? DELIVERY : 0);
    const total    = Math.max(0, subtotal - discount + delivery);

    document.getElementById('subtotal').textContent    = formatPrice(subtotal);
    document.getElementById('discountRow').textContent = `-${formatPrice(discount)}`;
    document.getElementById('deliveryRow').textContent = delivery === 0 ? 'FREE 🎉' : formatPrice(delivery);
    document.getElementById('total').textContent       = formatPrice(total);
  }

  // Coupon
  document.getElementById('applyCoupon')?.addEventListener('click', () => {
    const code  = document.getElementById('couponInput')?.value.trim().toUpperCase();
    const msgEl = document.getElementById('couponMsg');
    if (!code) return;
    if (COUPONS[code]) {
      appliedCoupon = code;
      const c = COUPONS[code];
      if (msgEl) { msgEl.style.color = 'var(--success)'; msgEl.textContent = `✅ Coupon "${code}" applied! ${c.label}`; }
      updateSummary();
      showToast(`Coupon ${code} applied!`);
    } else {
      if (msgEl) { msgEl.style.color = 'var(--accent)'; msgEl.textContent = '❌ Invalid coupon code.'; }
    }
  });

  // Checkout button
  document.getElementById('checkoutBtn')?.addEventListener('click', e => {
    if (!getCart().length) { e.preventDefault(); showToast('Add items to cart first!'); }
  });

  renderCart();
});
