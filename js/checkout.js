/* ============================
   CHECKOUT.JS v3.0 – Enterprise Checkout Engine
   3D Flippable Interactive Credit Card, Real-Time Validation,
   Multi-Step Wizard, Order Storage, Printable Tax Invoice
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
      itemsHTML += `<div class="checkout-item" style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:.6rem;">
          <div style="width:34px;height:34px;border-radius:6px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--primary);">
            <i class="fas ${p.icon}"></i>
          </div>
          <div>
            <div class="checkout-item-name" style="font-size:.85rem;font-weight:600;">${p.name}</div>
            <div class="checkout-item-qty" style="font-size:.75rem;color:var(--text-muted);">Qty: ${item.qty}</div>
          </div>
        </div>
        <strong style="font-size:.9rem;">${formatPrice(p.price * item.qty)}</strong>
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
        markError(el, 'Enter a valid 10-digit phone number.'); valid = false;
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

  // ── Step 2: Payment & 3D Interactive Card ──
  document.getElementById('backToAddr')?.addEventListener('click', () => activateStep(1));

  const card3dWrap  = document.getElementById('card3dWrap');
  const card3dInner = document.getElementById('card3dInner');
  const card3dNum   = document.getElementById('card3dNum');
  const card3dName  = document.getElementById('card3dName');
  const card3dExp   = document.getElementById('card3dExp');
  const card3dCvv   = document.getElementById('card3dCvv');
  const card3dType  = document.getElementById('card3dType');

  const cardForm    = document.getElementById('cardForm');
  const upiForm     = document.getElementById('upiForm');
  const netbankForm = document.getElementById('netbankingForm');

  // Payment method switch
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.querySelector('input')?.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const val = opt.querySelector('input').value;
      if (cardForm)    cardForm.classList.toggle('hidden', val !== 'card');
      if (card3dWrap)  card3dWrap.style.display = val === 'card' ? 'block' : 'none';
      if (upiForm)     upiForm.classList.toggle('hidden', val !== 'upi');
      if (netbankForm) netbankForm.classList.toggle('hidden', val !== 'netbanking');
    });
  });

  // ── 3D Card Live Inputs & Flip ──
  const cardNumInput = document.getElementById('cardNum');
  const expiryInput  = document.getElementById('expiry');
  const cvvInput     = document.getElementById('cvv');
  const nameInput    = document.getElementById('cardName');

  cardNumInput?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    if (card3dNum) {
      card3dNum.textContent = e.target.value || '•••• •••• •••• ••••';
    }
    // Detect card type
    const cType = detectCardType(v);
    const typeEl = document.getElementById('cardTypeIcon');
    if (typeEl) typeEl.className = `fab fa-cc-${cType}`;
    if (card3dType) card3dType.className = `fab fa-cc-${cType}`;
  });

  nameInput?.addEventListener('input', e => {
    if (card3dName) {
      card3dName.textContent = e.target.value.trim().toUpperCase() || 'YOUR NAME';
    }
  });

  expiryInput?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
    if (card3dExp) {
      card3dExp.textContent = v || 'MM/YY';
    }
  });

  cvvInput?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').slice(0,4);
    if (card3dCvv) {
      card3dCvv.textContent = e.target.value || '•••';
    }
  });

  // Flip 3D card on CVV focus/blur
  cvvInput?.addEventListener('focus', () => {
    card3dInner?.classList.add('flipped');
  });
  cvvInput?.addEventListener('blur', () => {
    card3dInner?.classList.remove('flipped');
  });

  function detectCardType(num) {
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return 'visa';
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
      if (!cardNum || cardNum.length < 16) { showToast('Enter a valid 16-digit card number.', 'error'); return; }
      if (!expiry || expiry.length < 5)    { showToast('Enter a valid expiry date (MM/YY).', 'error'); return; }
      if (!cvv || cvv.length < 3)          { showToast('Enter a valid CVV.', 'error'); return; }
    } else if (payMethod === 'upi') {
      const upiId = document.getElementById('upiId')?.value.trim();
      if (!upiId) { showToast('Please enter your UPI ID or choose a preset.', 'warning'); return; }
    }

    // Show processing animation
    const btn = document.getElementById('placeOrder');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authorizing Payment…';
    btn.disabled = true;

    setTimeout(() => {
      // Generate unique order ID
      const orderId = 'SN' + Math.random().toString(36).substr(2, 8).toUpperCase();
      document.getElementById('orderId').textContent = orderId;

      const subtotal = cart.reduce((s, i) => { const p = getProductById(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
      const delivery = subtotal > 499 ? 0 : 49;
      const grandTotal = subtotal + delivery;

      // Populate confirmation details
      populateConfirmation(orderId, payMethod, subtotal, delivery, grandTotal);

      // Generate Printable Invoice
      buildPrintableInvoice(orderId, payMethod, subtotal, delivery, grandTotal);

      // Save order to history
      const orders = LS.get('sn_orders', []);
      orders.unshift({
        id: orderId,
        date: new Date().toISOString(),
        items: [...cart],
        status: 'Processing',
        payMethod,
        subtotal,
        delivery,
        total: grandTotal,
        shippingAddress: {
          name: `${document.getElementById('firstName')?.value || ''} ${document.getElementById('lastName')?.value || ''}`,
          address: document.getElementById('address')?.value || '',
          city: document.getElementById('city')?.value || '',
          state: document.getElementById('state')?.value || '',
          pincode: document.getElementById('pincode')?.value || ''
        }
      });
      LS.set('sn_orders', orders);

      // Clear cart
      LS.set('sn_cart', []);
      updateBadges();
      updateSideCart();

      // Add loyalty points
      const earnedPoints = Math.floor(grandTotal / 100);
      const curPoints = parseInt(LS.get('sn_points', '150'));
      LS.set('sn_points', curPoints + earnedPoints);

      btn.innerHTML = origText;
      btn.disabled = false;
      activateStep(3);
      if (typeof triggerConfetti === 'function') triggerConfetti(3500);
      showToast(`🎉 Order placed successfully! Earned ${earnedPoints} points.`);
    }, 1800);
  });

  function populateConfirmation(orderId, payMethod, subtotal, delivery, grandTotal) {
    const detailsEl = document.getElementById('orderDetailsCard');
    if (!detailsEl) return;
    const payLabels = { card: 'Credit / Debit Card', upi: 'UPI Instant Pay', netbanking: 'Net Banking', cod: 'Cash on Delivery' };
    detailsEl.innerHTML = `
      <div><span>Order ID</span><strong style="color:var(--primary)">${orderId}</strong></div>
      <div><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div><span>Delivery Charge</span><span>${delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
      <div><span>Grand Total</span><strong style="font-size:1.1rem;color:var(--text);">${formatPrice(grandTotal)}</strong></div>
      <div><span>Payment Method</span><span>${payLabels[payMethod] || payMethod}</span></div>
      <div><span>Est. Delivery</span><span>${new Date(Date.now() + 3*86400000).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' })}</span></div>`;
  }

  // ── Printable Invoice Generator ──
  function buildPrintableInvoice(orderId, payMethod, subtotal, delivery, grandTotal) {
    const invoiceEl = document.getElementById('printInvoiceArea');
    if (!invoiceEl) return;

    const custName = `${document.getElementById('firstName')?.value || 'Valued Customer'} ${document.getElementById('lastName')?.value || ''}`;
    const custAddr = `${document.getElementById('address')?.value || ''}, ${document.getElementById('city')?.value || ''}, ${document.getElementById('state')?.value || ''} - ${document.getElementById('pincode')?.value || ''}`;
    const custPhone = document.getElementById('phone')?.value || '+91 98765 43210';
    const custEmail = document.getElementById('email')?.value || 'customer@example.com';

    invoiceEl.innerHTML = `
      <div style="font-family:'Inter',sans-serif;max-width:800px;margin:0 auto;padding:2rem;color:#111;line-height:1.5;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #667eea;padding-bottom:1.5rem;margin-bottom:1.5rem;">
          <div>
            <h1 style="color:#667eea;margin:0;font-size:1.8rem;font-weight:900;">ShopNow</h1>
            <p style="margin:.2rem 0;color:#666;font-size:.85rem;">ShopNow India Pvt. Ltd. · GSTIN: 29AAAAA0000A1Z5</p>
            <p style="margin:0;color:#666;font-size:.85rem;">123 MG Road, Bangalore, Karnataka 560001</p>
          </div>
          <div style="text-align:right;">
            <h2 style="margin:0;color:#333;font-size:1.4rem;">TAX INVOICE</h2>
            <div style="font-size:.9rem;color:#666;margin-top:.3rem;">Invoice: <strong>${orderId}</strong></div>
            <div style="font-size:.85rem;color:#666;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem;font-size:.9rem;">
          <div>
            <strong style="display:block;margin-bottom:.4rem;color:#333;">Billed &amp; Shipped To:</strong>
            <div><strong>${custName}</strong></div>
            <div>${custAddr}</div>
            <div>Phone: ${custPhone}</div>
            <div>Email: ${custEmail}</div>
          </div>
          <div style="text-align:right;">
            <strong style="display:block;margin-bottom:.4rem;color:#333;">Order &amp; Payment Details:</strong>
            <div>Payment: <strong>${payMethod.toUpperCase()}</strong></div>
            <div>Status: <strong>PAID</strong></div>
            <div>Delivery By: <strong>${new Date(Date.now() + 3*86400000).toLocaleDateString('en-IN')}</strong></div>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;font-size:.9rem;">
          <thead>
            <tr style="background:#f3f4f6;border-bottom:2px solid #ddd;">
              <th style="padding:.75rem;text-align:left;">Item</th>
              <th style="padding:.75rem;text-align:center;">Qty</th>
              <th style="padding:.75rem;text-align:right;">Unit Price</th>
              <th style="padding:.75rem;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => {
              const p = getProductById(item.id);
              if (!p) return '';
              return `
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:.75rem;"><strong>${p.name}</strong><br><span style="font-size:.78rem;color:#777;">${p.brand || p.cat}</span></td>
                  <td style="padding:.75rem;text-align:center;">${item.qty}</td>
                  <td style="padding:.75rem;text-align:right;">${formatPrice(p.price)}</td>
                  <td style="padding:.75rem;text-align:right;font-weight:700;">${formatPrice(p.price * item.qty)}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>

        <div style="display:flex;justify-content:flex-end;margin-bottom:2rem;">
          <div style="width:280px;font-size:.9rem;">
            <div style="display:flex;justify-content:space-between;padding:.3rem 0;"><span>Subtotal:</span><span>${formatPrice(subtotal)}</span></div>
            <div style="display:flex;justify-content:space-between;padding:.3rem 0;"><span>Shipping &amp; Handling:</span><span>${delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
            <div style="display:flex;justify-content:space-between;padding:.3rem 0;font-size:.8rem;color:#666;"><span>CGST (9%) + SGST (9%):</span><span>Included</span></div>
            <div style="display:flex;justify-content:space-between;padding:.6rem 0;border-top:2px solid #333;font-size:1.15rem;font-weight:800;color:#667eea;">
              <span>Grand Total:</span><span>${formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>

        <div style="text-align:center;border-top:1px solid #eee;padding-top:1.5rem;font-size:.8rem;color:#888;">
          Thank you for shopping with ShopNow! For customer support, email support@shopnow.in or call +91 98765 43210.
        </div>
      </div>`;
  }

  // ── Print Invoice Handler ──
  document.getElementById('printInvoiceBtn')?.addEventListener('click', () => {
    const area = document.getElementById('printInvoiceArea');
    if (!area || !area.innerHTML) {
      showToast('No active invoice to print.', 'warning');
      return;
    }
    window.print();
  });

  // ── Delivery Time Slot Selection ──
  let selectedSlot = 'morning';
  document.querySelectorAll('.slot-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.slot-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedSlot = card.dataset.slot || 'morning';
      showToast(`🕒 Selected: ${card.querySelector('.slot-title')?.textContent}`);
    });
  });

  // ── Download Digital Tax Invoice ──
  document.getElementById('downloadInvoiceBtn')?.addEventListener('click', () => {
    const invoiceContent = document.getElementById('printInvoiceArea')?.innerHTML;
    if (!invoiceContent) {
      showToast('No active invoice to download.', 'warning');
      return;
    }
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ShopNow_Tax_Invoice</title><style>body{font-family:sans-serif;padding:2rem;}</style></head><body>${invoiceContent}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('📄 Invoice downloaded successfully!', 'success');
  });

  // ── Track Active Order Quick Action ──
  document.getElementById('trackNewOrderBtn')?.addEventListener('click', () => {
    const orders = LS.get('sn_orders', []);
    const latest = orders[0];
    if (latest && typeof trackOrder === 'function') {
      trackOrder(latest.id);
    } else {
      showToast('Order details loading…');
    }
  });

  // ── Express Demo Fill ──
  document.getElementById('demoFillBtn')?.addEventListener('click', () => {
    const fields = {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      address: 'Flat 402, Lotus Apartments, 100ft Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    };
    Object.keys(fields).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = fields[id];
    });
    showToast('✨ Form autofilled with sample address!', 'info');
  });
});
