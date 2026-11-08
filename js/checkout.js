/* ============================
   CHECKOUT.JS v2.0
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();

  // ── Populate Order Summary ──
  function populateSummary() {
    const itemsEl    = document.getElementById('checkoutItems');
    const coSubtotal = document.getElementById('coSubtotal');
    const coDelivery = document.getElementById('coDelivery');
    const coTotal    = document.getElementById('coTotal');

    if (!cart.length && itemsEl) {
      itemsEl.innerHTML = '<p style="color:var(--text-muted);font-size:.875rem;text-align:center;padding:1rem">Cart is empty.<br><a href="shop.html" style="color:var(--primary)">Shop Now</a></p>';
      return;
    }

    let subtotal = 0;
    let itemsHTML = '';
    cart.forEach(item => {
      const p = getProductById(item.id);
      if (!p) return;
      subtotal += p.price * item.qty;
      itemsHTML += `<div class="checkout-item">
        <span class="checkout-item-name">${p.name}</span>
        <span class="checkout-item-qty">×${item.qty}</span>
        <strong>${formatPrice(p.price * item.qty)}</strong>
      </div>`;
    });

    const delivery = subtotal > 499 ? 0 : 49;
    const total    = subtotal + delivery;

    if (itemsEl) itemsEl.innerHTML = itemsHTML;
    if (coSubtotal) coSubtotal.textContent = formatPrice(subtotal);
    if (coDelivery) coDelivery.textContent = delivery === 0 ? 'FREE' : formatPrice(delivery);
    if (coTotal)    coTotal.textContent    = formatPrice(total);
  }
  populateSummary();

  // ── Step Management ──
  let currentStep = 1;
  const steps = {
    1: { form: 'formStep1', stepEl: null },
    2: { form: 'formStep2', stepEl: 'step2' },
    3: { form: 'formStep3', stepEl: 'step3' },
  };

  function activateStep(n) {
    currentStep = n;
    // Update form panels
    [1, 2, 3].forEach(i => {
      const panel = document.getElementById(`formStep${i}`);
      panel?.classList.toggle('active', i === n);
    });
    // Update step indicators
    document.querySelectorAll('.step').forEach((el, i) => {
      const stepNum = i + 1;
      el.classList.toggle('active', stepNum === n);
      el.classList.toggle('done', stepNum < n);
    });
    // Update step lines
    document.querySelectorAll('.step-line').forEach((el, i) => {
      el.classList.toggle('done', i + 1 < n);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Step 1: Address Form Validation ──
  document.getElementById('addressForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateAddressForm()) return;
    activateStep(2);
  });

  function validateAddressForm() {
    let valid = true;
    const required = ['firstName','lastName','email','phone','address','city','state','pincode'];
    required.forEach(field => {
      const el = document.getElementById(field);
      if (!el) return;
      const val = el.value.trim();
      el.classList.remove('error');
      const errEl = document.getElementById(field + 'Err');
      if (errEl) errEl.textContent = '';

      if (!val) {
        markError(el, 'This field is required.'); valid = false;
      } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        markError(el, 'Please enter a valid email.'); valid = false;
      } else if (field === 'phone' && !/^\+?[\d\s-]{10,}$/.test(val)) {
        markError(el, 'Enter a valid phone number.'); valid = false;
      } else if (field === 'pincode' && !/^\d{6}$/.test(val)) {
        markError(el, 'Enter a valid 6-digit PIN code.'); valid = false;
      }
    });
    return valid;
  }

  function markError(el, msg) {
    el.classList.add('error');
    let errEl = document.getElementById(el.id + 'Err');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error';
      errEl.id = el.id + 'Err';
      el.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
    el.focus();
  }

  // Real-time validation clear
  ['firstName','lastName','email','phone','address','city','state','pincode'].forEach(field => {
    document.getElementById(field)?.addEventListener('input', function() {
      this.classList.remove('error');
      const e = document.getElementById(field + 'Err');
      if (e) e.textContent = '';
    });
  });

  // ── Step 2: Payment ──
  document.getElementById('backToAddr')?.addEventListener('click', () => activateStep(1));

  // Payment method switch
  const cardForm    = document.getElementById('cardForm');
  const upiForm     = document.getElementById('upiForm');
  const netbankForm = document.getElementById('netbankingForm');

  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.querySelector('input')?.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const val = opt.querySelector('input').value;
      if (cardForm)    cardForm.classList.toggle('hidden', val !== 'card');
      if (upiForm)     upiForm.classList.toggle('hidden', val !== 'upi');
      if (netbankForm) netbankForm.classList.toggle('hidden', val !== 'netbanking');
    });
  });

  // Card number formatting
  document.getElementById('cardNum')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    // Detect card type
    const cardType = detectCardType(v);
    const typeEl = document.getElementById('cardTypeIcon');
    if (typeEl) typeEl.className = `fab fa-cc-${cardType}`;
  });

  // Expiry formatting
  document.getElementById('expiry')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  });

  // CVV — only numbers, max 4
  document.getElementById('cvv')?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').slice(0,4);
  });

  function detectCardType(num) {
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return 'generic';
  }

  // ── Place Order ──
  document.getElementById('placeOrder')?.addEventListener('click', () => {
    const payOpt = document.querySelector('.payment-option.selected input');
    if (!payOpt) { showToast('Please select a payment method.', 'warning'); return; }

    const payMethod = payOpt.value;
    if (payMethod === 'card') {
      const cardNum = document.getElementById('cardNum')?.value.replace(/\s/g,'');
      const expiry  = document.getElementById('expiry')?.value;
      const cvv     = document.getElementById('cvv')?.value;
      if (!cardNum || cardNum.length < 16) { showToast('Enter a valid card number.', 'error'); return; }
      if (!expiry || expiry.length < 5)    { showToast('Enter a valid expiry date.', 'error'); return; }
      if (!cvv || cvv.length < 3)          { showToast('Enter a valid CVV.', 'error'); return; }
    }

    // Show loading state
    const btn = document.getElementById('placeOrder');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-sm"></span> Processing…';
    btn.disabled = true;

    setTimeout(() => {
      // Generate order
      const orderId = 'SN' + Math.random().toString(36).substr(2, 8).toUpperCase();
      document.getElementById('orderId').textContent = orderId;

      // Populate confirmation details
      populateConfirmation(orderId, payMethod);

      // Save order
      const orders = LS.get('sn_orders', []);
      orders.unshift({
        id: orderId, date: new Date().toISOString(),
        items: [...cart], status: 'Processing',
        payMethod, total: getCartTotal() + (getCartTotal() > 499 ? 0 : 49)
      });
      LS.set('sn_orders', orders);

      // Clear cart
      LS.set('sn_cart', []);
      updateBadges();
      updateSideCart();

      btn.innerHTML = origText;
      btn.disabled = false;
      activateStep(3);
      showToast('🎉 Order placed successfully!');
    }, 2200);
  });

  function populateConfirmation(orderId, payMethod) {
    const detailsEl = document.getElementById('orderDetailsCard');
    if (!detailsEl) return;
    const subtotal = cart.reduce((s, i) => { const p = getProductById(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
    const delivery = subtotal > 499 ? 0 : 49;
    const payLabels = { card: 'Credit/Debit Card', upi: 'UPI', netbanking: 'Net Banking', cod: 'Cash on Delivery' };
    detailsEl.innerHTML = `
      <div><span>Order ID</span><strong>${orderId}</strong></div>
      <div><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div><span>Delivery</span><span>${delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
      <div><span>Total Paid</span><strong>${formatPrice(subtotal + delivery)}</strong></div>
      <div><span>Payment</span><span>${payLabels[payMethod] || payMethod}</span></div>
      <div><span>Est. Delivery</span><span>3–5 business days</span></div>`;
  }
});
