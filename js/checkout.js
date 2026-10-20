/* ============================
   CHECKOUT.JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  // Render order summary
  const cart = getCart();
  const itemsList = document.getElementById('checkoutItems');
  const coSubtotal = document.getElementById('coSubtotal');
  const coTotal    = document.getElementById('coTotal');

  if (itemsList) {
    const subtotal = cart.reduce((s, i) => {
      const p = getProductById(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);

    itemsList.innerHTML = cart.map(item => {
      const p = getProductById(item.id);
      if (!p) return '';
      return `<div class="checkout-item">
        <span>${p.name} × ${item.qty}</span>
        <strong>${formatPrice(p.price * item.qty)}</strong>
      </div>`;
    }).join('') || '<p style="color:var(--text-light);font-size:.875rem;">Cart is empty</p>';

    if (coSubtotal) coSubtotal.textContent = formatPrice(subtotal);
    if (coTotal)    coTotal.textContent    = formatPrice(subtotal + (subtotal > 499 ? 0 : 49));
  }

  // Step management
  const step1 = document.getElementById('formStep1');
  const step2 = document.getElementById('formStep2');
  const step3 = document.getElementById('formStep3');
  const stepEl2 = document.getElementById('step2');
  const stepEl3 = document.getElementById('step3');

  function activateStep(n) {
    [step1, step2, step3].forEach((s, i) => s?.classList.toggle('active', i + 1 === n));
    if (n >= 2) { stepEl2?.classList.add('active'); }
    if (n >= 3) { stepEl3?.classList.add('active'); }
  }

  // Step 1: Address form
  document.getElementById('addressForm')?.addEventListener('submit', e => {
    e.preventDefault();
    activateStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Step 2: Payment
  document.getElementById('backToAddr')?.addEventListener('click', () => activateStep(1));

  // Payment method toggle
  const paymentOptions = document.querySelectorAll('.payment-option');
  const cardForm = document.getElementById('cardForm');
  const upiForm  = document.getElementById('upiForm');

  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      const val = opt.querySelector('input').value;
      cardForm?.classList.toggle('hidden', val !== 'card');
      upiForm?.classList.toggle('hidden', val !== 'upi');
    });
  });

  // Format card number
  document.getElementById('cardNum')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });

  // Format expiry
  document.getElementById('expiry')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  });

  // Place order
  document.getElementById('placeOrder')?.addEventListener('click', () => {
    // Generate order ID
    const orderId = 'SN' + Date.now().toString().slice(-8);
    document.getElementById('orderId').textContent = orderId;

    // Clear cart
    LS.set('sn_cart', []);
    updateBadges();

    // Save order to history
    const orders = LS.get('sn_orders', []);
    orders.unshift({ id: orderId, date: new Date().toISOString(), items: cart, status: 'Processing' });
    LS.set('sn_orders', orders);

    // Show step 3
    stepEl3?.classList.add('active');
    activateStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Order placed! 🎉');
  });
});
