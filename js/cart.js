/* ============================
   CART.JS v3.0 – Enterprise Cart Engine
   Gift Wrap Add-on, Pincode Delivery Estimator,
   Dynamic Free Shipping Progress, Coupons, Save For Later
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const wrap     = document.getElementById('cartItemsWrap');
  const summary  = document.getElementById('cartSummary');
  const DELIVERY_THRESHOLD = 499;
  const DELIVERY_FEE       = 49;
  const GIFT_WRAP_FEE      = 49;

  let appliedCoupon   = null;
  let appliedDiscount = 0;
  let giftWrapActive  = false;
  let tipAmount       = 0;

  // ── Render Cart Items ──
  function renderCart() {
    const cart = getCart();

    if (!cart.length) {
      wrap.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <h2>Your cart is empty!</h2>
          <p>Looks like you haven't added anything yet. Explore our products and find something you love!</p>
          <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
            <a href="shop.html" class="btn btn-primary"><i class="fas fa-store"></i> Browse Shop</a>
            <a href="wishlist.html" class="btn btn-outline"><i class="fas fa-heart"></i> View Wishlist</a>
          </div>
        </div>`;
      summary?.style.setProperty('display', 'none');
      return;
    }

    summary?.style.removeProperty('display');

    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    wrap.innerHTML = `
      <div class="cart-items-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1.5px solid var(--border);">
        <h3 style="font-weight:800;font-size:1.2rem">
          <i class="fas fa-shopping-cart" style="color:var(--primary);margin-right:.5rem"></i>
          Cart <span style="color:var(--text-light);font-weight:400;font-size:.9rem">(${cartCount} item${cartCount !== 1 ? 's' : ''})</span>
        </h3>
        <button id="clearCartBtn" class="btn-text" style="color:var(--accent);font-size:.85rem;">
          <i class="fas fa-trash-alt"></i> Clear All
        </button>
      </div>

      ${cart.map(item => {
        const p = getProductById(item.id);
        if (!p) return '';
        const lineTotal = p.price * item.qty;
        return `
          <div class="cart-item" data-id="${p.id}">
            <a href="product.html?id=${p.id}" class="cart-item-img">
              <i class="fas ${p.icon}"></i>
            </a>
            <div class="cart-item-details">
              <a href="product.html?id=${p.id}" class="cart-item-name">${p.name}</a>
              <div class="cart-item-cat"><i class="fas fa-tag" style="font-size:.7rem"></i> ${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}${p.brand ? ` · ${p.brand}` : ''}</div>
              <div class="cart-item-price">${formatPrice(p.price)} <span style="font-size:.8rem;color:var(--text-light);font-weight:400">per item</span></div>
              ${!p.inStock ? '<div style="color:var(--accent);font-size:.8rem;margin-top:.3rem;"><i class="fas fa-exclamation-circle"></i> Out of stock – will be removed at checkout</div>' : ''}
              <div class="cart-item-actions">
                <div class="qty-control">
                  <button class="qty-btn qty-minus" data-id="${p.id}" ${item.qty <= 1 ? 'style="color:var(--text-muted)"' : ''}>−</button>
                  <span class="qty-num" id="qty-${p.id}">${item.qty}</span>
                  <button class="qty-btn qty-plus" data-id="${p.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${p.id}"><i class="fas fa-trash-alt"></i> Remove</button>
                <span class="item-total">Line total: <strong>${formatPrice(lineTotal)}</strong></span>
              </div>
            </div>
            <div class="cart-item-right" style="text-align:right;min-width:80px;">
              <div style="font-size:1.1rem;font-weight:800;color:var(--primary)">${formatPrice(lineTotal)}</div>
              ${getDiscountPercent(p) > 0 ? `<div style="font-size:.75rem;color:var(--success);font-weight:600;">Save ${formatPrice((p.originalPrice - p.price) * item.qty)}</div>` : ''}
              <button class="action-btn wish-btn ${isWishlisted(p.id) ? 'wishlisted' : ''}" data-id="${p.id}" style="margin-top:.5rem;width:32px;height:32px;" title="Save for later">
                <i class="fa${isWishlisted(p.id) ? 's' : 'r'} fa-heart"></i>
              </button>
            </div>
          </div>`;
      }).join('')}

      <!-- Savings Summary -->
      ${getSavingsTotal(cart) > 0 ? `
        <div style="background:linear-gradient(135deg,rgba(67,233,123,.1),rgba(56,249,215,.1));border:1px solid rgba(67,233,123,.3);border-radius:var(--radius);padding:1rem 1.25rem;margin-top:.5rem;display:flex;align-items:center;gap:.75rem;">
          <i class="fas fa-piggy-bank" style="color:var(--success);font-size:1.3rem"></i>
          <div><strong style="color:var(--success)">You're saving ${formatPrice(getSavingsTotal(cart))} 🎉</strong><br><span style="font-size:.8rem;color:var(--text-light)">on your current order</span></div>
        </div>` : ''}

      <!-- Delivery progress -->
      ${getCartTotal() < DELIVERY_THRESHOLD && cart.length ? `
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:var(--radius);padding:.85rem 1.25rem;margin-top:.75rem;display:flex;align-items:center;gap:.75rem;">
          <i class="fas fa-truck-fast" style="color:#ea580c"></i>
          <span style="font-size:.875rem;color:#9a3412">
            Add <strong>${formatPrice(DELIVERY_THRESHOLD - getCartTotal())}</strong> more for <strong>FREE delivery!</strong>
          </span>
        </div>` : cart.length ? `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--radius);padding:.85rem 1.25rem;margin-top:.75rem;display:flex;align-items:center;gap:.75rem;">
          <i class="fas fa-check-circle" style="color:var(--success)"></i>
          <span style="font-size:.875rem;color:#15803d"><strong>🎉 Free delivery unlocked!</strong></span>
        </div>` : ''}`;

    // Bind events
    bindCartEvents();
    updateSummary();
  }

  function getSavingsTotal(cart) {
    return cart.reduce((s, item) => {
      const p = getProductById(item.id);
      return s + (p && p.originalPrice > p.price ? (p.originalPrice - p.price) * item.qty : 0);
    }, 0);
  }

  function bindCartEvents() {
    // Quantity
    wrap.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        updateCartQty(id, getCartItemQty(id) + 1);
        renderCart();
      });
    });
    wrap.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const qty = getCartItemQty(id);
        if (qty <= 1) {
          if (confirm('Remove this item from cart?')) { removeFromCart(id); renderCart(); showToast('Item removed'); }
        } else {
          updateCartQty(id, qty - 1);
          renderCart();
        }
      });
    });

    // Remove
    wrap.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const cartItem = getCart().find(i => i.id === id);
        const card = btn.closest('.cart-item');
        if (card) {
          card.style.transition = 'opacity .3s, transform .3s';
          card.style.opacity = '0'; card.style.transform = 'translateX(20px)';
          setTimeout(() => {
            removeFromCart(id);
            renderCart();
            if (typeof showUndoToast === 'function' && cartItem) {
              const p = getProductById(id);
              showUndoToast(`Removed ${p ? p.name : 'item'} from cart`, () => {
                addToCart(cartItem.id, cartItem.qty, false);
                renderCart();
                showToast('Item restored to cart!', 'success');
              });
            } else {
              showToast('Item removed from cart');
            }
          }, 300);
        }
      });
    });

    // Wishlist (save for later)
    wrap.querySelectorAll('.wish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const added = toggleWishlist(id);
        btn.classList.toggle('wishlisted', added);
        btn.innerHTML = added ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
      });
    });

    // Clear all
    document.getElementById('clearCartBtn')?.addEventListener('click', () => {
      if (confirm('Remove all items from your cart?')) {
        LS.set('sn_cart', []);
        updateBadges();
        renderCart();
        updateSideCart();
        showToast('Cart cleared');
      }
    });
  }

  // ── Update Order Summary ──
  function updateSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => {
      const p = getProductById(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
    const delivery = subtotal > 0 && subtotal < DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
    const giftWrap = giftWrapActive ? GIFT_WRAP_FEE : 0;
    const total    = Math.max(0, subtotal - appliedDiscount + delivery + giftWrap + tipAmount);

    const el = id => document.getElementById(id);
    if (el('subtotal'))     el('subtotal').textContent    = formatPrice(subtotal);
    if (el('discountRow'))  el('discountRow').textContent = appliedDiscount > 0 ? `-${formatPrice(appliedDiscount)}` : '-₹0';
    if (el('discountRow'))  el('discountRow').style.color  = appliedDiscount > 0 ? 'var(--success)' : 'var(--text-light)';
    if (el('deliveryRow'))  el('deliveryRow').textContent = delivery === 0 && subtotal > 0 ? 'FREE 🎉' : formatPrice(delivery);
    if (el('tipRow'))       el('tipRow').textContent      = tipAmount > 0 ? formatPrice(tipAmount) : '₹0';
    if (el('total'))        el('total').textContent       = formatPrice(total);

    // Reward points estimator
    const pointsEl = el('cartPointsReward');
    if (pointsEl && typeof calculateLoyaltyPoints === 'function') {
      const earned = calculateLoyaltyPoints(total);
      pointsEl.innerHTML = `<i class="fas fa-coins text-warning"></i> You'll earn <strong>${earned} ShopPoints</strong> on this order!`;
      pointsEl.style.display = total > 0 ? 'block' : 'none';
    }

    // Checkout button guard
    const checkoutBtn = el('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.href = cart.length ? 'checkout.html' : '#';
    }
  }

  // ── Gift Wrap Toggle ──
  const giftWrapCheck = document.getElementById('giftWrapCheck');
  const giftWrapCard  = document.getElementById('giftWrapCard');
  const giftMsgWrap   = document.getElementById('giftMsgWrap');

  giftWrapCheck?.addEventListener('change', () => {
    giftWrapActive = giftWrapCheck.checked;
    giftWrapCard?.classList.toggle('active', giftWrapActive);
    if (giftMsgWrap) giftMsgWrap.style.display = giftWrapActive ? 'block' : 'none';
    if (giftWrapActive) showToast('🎁 Gift wrap added (+₹49)');
    updateSummary();
  });

  // ── Cart Pincode Estimator ──
  const cartPinInput = document.getElementById('cartPincodeInput');
  const cartPinBtn   = document.getElementById('cartPincodeBtn');
  const cartPinRes   = document.getElementById('cartPincodeRes');

  function checkCartPincode() {
    const val = cartPinInput.value.trim();
    if (!/^\d{6}$/.test(val)) {
      cartPinRes.innerHTML = `<span style="color:var(--accent);">Please enter 6-digit PIN.</span>`;
      return;
    }
    cartPinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    setTimeout(() => {
      cartPinBtn.innerHTML = 'Estimate';
      const arrDate = new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' });
      cartPinRes.innerHTML = `<span style="color:var(--success);font-weight:600;"><i class="fas fa-truck-fast"></i> Expected delivery by <strong>${arrDate}</strong></span>`;
    }, 400);
  }

  cartPinBtn?.addEventListener('click', checkCartPincode);
  cartPinInput?.addEventListener('keydown', e => { if (e.key === 'Enter') checkCartPincode(); });

  // ── Coupon Code ──
  document.getElementById('applyCoupon')?.addEventListener('click', () => {
    const code  = document.getElementById('couponInput')?.value.trim().toUpperCase();
    const msgEl = document.getElementById('couponMsg');
    if (!code) { if (msgEl) { msgEl.style.color='var(--accent)'; msgEl.textContent='⚠️ Please enter a coupon code.'; } return; }

    const subtotal = getCartTotal();
    const result = applyCoupon(code, getCart(), subtotal);

    if (result.valid) {
      appliedCoupon   = code;
      appliedDiscount = result.discount;
      if (msgEl) { msgEl.style.color = 'var(--success)'; msgEl.textContent = result.message; }
      showToast(`🎉 Coupon applied! Saving ${formatPrice(result.discount)}`);
      updateSummary();
    } else {
      appliedCoupon = null; appliedDiscount = 0;
      if (msgEl) { msgEl.style.color = 'var(--accent)'; msgEl.textContent = result.message; }
    }
  });

  document.getElementById('couponInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('applyCoupon')?.click();
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', e => {
    if (!getCart().length) { e.preventDefault(); showToast('⚠️ Add items to cart first!', 'warning'); }
  });

  // ── Cart Recommended Add-ons ──
  function initCartAddons() {
    const addonsGrid = document.getElementById('cartAddonsGrid');
    if (!addonsGrid) return;
    const addOnCandidates = PRODUCTS.filter(p => p.price <= 2000 && !getCart().some(i => i.id === p.id)).slice(0, 4);
    if (!addOnCandidates.length) return;
    addonsGrid.innerHTML = addOnCandidates.map(productCardHTML).join('');
    bindProductCards(addonsGrid);
  }
  initCartAddons();

  // ── Delivery Partner Tip Selector ──
  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
      const val = parseInt(btn.dataset.tip || 0);
      if (tipAmount === val) {
        tipAmount = 0;
      } else {
        tipAmount = val;
        btn.classList.add('active');
        showToast(`❤️ Added ${formatPrice(val)} tip for delivery partner!`);
      }
      updateSummary();
    });
  });

  // ── Delivery Instruction Selector ──
  document.querySelectorAll('input[name="deliveryInstruction"]').forEach(radio => {
    radio.addEventListener('change', () => {
      LS.set('sn_delivery_instruction', radio.value);
      showToast(`📝 Instruction set: "${radio.value}"`);
    });
  });

  // ── Init ──
  renderCart();

  window.addEventListener('cartUpdated', () => {
    renderCart();
    initCartAddons();
  });
});
