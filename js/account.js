/* ============================
   ACCOUNT.JS v2.0
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const authForms   = document.getElementById('authForms');
  const dashboard   = document.getElementById('dashboard');
  const loginForm   = document.getElementById('loginForm');
  const regForm     = document.getElementById('registerForm');
  const loginTab    = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');

  // ── 1. Auth State Management ──
  let user = LS.get('sn_user', null);

  function checkAuthState() {
    if (user) {
      showDashboard(user);
    } else {
      showAuth();
    }
  }

  function showDashboard(u) {
    user = u;
    authForms?.classList.add('hidden');
    dashboard?.classList.remove('hidden');

    // Populate user profile headers
    const name = u.name || 'Rahul Sharma';
    const email = u.email || 'user@shopnow.in';
    const initial = name.charAt(0).toUpperCase();

    const avatarEl = document.getElementById('userAvatarBig');
    const nameEl   = document.getElementById('userNameBig');
    const emailEl  = document.getElementById('userEmailSmall');
    const profName = document.getElementById('profName');
    const profEmail = document.getElementById('profEmail');
    const profPhone = document.getElementById('profPhone');

    if (avatarEl) {
      avatarEl.textContent = initial;
      if (u.avatarGrad) avatarEl.style.background = u.avatarGrad;
    }
    if (nameEl)    nameEl.textContent = name;
    if (emailEl)   emailEl.textContent = email;
    if (profName)  profName.value = name;
    if (profEmail) profEmail.value = email;
    if (profPhone) profPhone.value = u.phone || '+91 98765 43210';

    renderOrders();
    renderAddresses();
    renderDashboardWishlist();
  }

  function showAuth() {
    authForms?.classList.remove('hidden');
    dashboard?.classList.add('hidden');
  }

  // ── 2. Tab Navigation (Auth vs Register) ──
  loginTab?.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab?.classList.remove('active');
    loginForm?.classList.remove('hidden');
    regForm?.classList.add('hidden');
  });

  registerTab?.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab?.classList.remove('active');
    regForm?.classList.remove('hidden');
    loginForm?.classList.add('hidden');
  });

  document.getElementById('toRegister')?.addEventListener('click', e => {
    e.preventDefault();
    registerTab?.click();
  });

  document.getElementById('toLogin')?.addEventListener('click', e => {
    e.preventDefault();
    loginTab?.click();
  });

  // ── 3. Password Visibility Toggles ──
  document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const targetInput = document.getElementById(targetId);
      if (!targetInput) return;
      const isPass = targetInput.type === 'password';
      targetInput.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  });

  // ── 4. Live Password Strength Checker ──
  const regPass = document.getElementById('regPass');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');

  regPass?.addEventListener('input', () => {
    const val = regPass.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (!val) {
      if (strengthFill) { strengthFill.style.width = '0%'; strengthFill.style.background = 'transparent'; }
      if (strengthText) strengthText.textContent = 'Password strength';
    } else if (score <= 1) {
      if (strengthFill) { strengthFill.style.width = '25%'; strengthFill.style.background = 'var(--accent)'; }
      if (strengthText) { strengthText.textContent = 'Weak password'; strengthText.style.color = 'var(--accent)'; }
    } else if (score === 2) {
      if (strengthFill) { strengthFill.style.width = '50%'; strengthFill.style.background = 'var(--warning)'; }
      if (strengthText) { strengthText.textContent = 'Fair password'; strengthText.style.color = '#d97706'; }
    } else if (score === 3) {
      if (strengthFill) { strengthFill.style.width = '75%'; strengthFill.style.background = 'var(--info)'; }
      if (strengthText) { strengthText.textContent = 'Good password'; strengthText.style.color = 'var(--info)'; }
    } else {
      if (strengthFill) { strengthFill.style.width = '100%'; strengthFill.style.background = 'var(--success)'; }
      if (strengthText) { strengthText.textContent = 'Strong password! 🔒'; strengthText.style.color = 'var(--success)'; }
    }
  });

  // ── 5. Login Form Submission ──
  document.getElementById('loginFormEl')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const pass  = document.getElementById('loginPass')?.value.trim();
    if (!email || !pass) return;

    const users = LS.get('sn_users', []);
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      if (found.password === pass) {
        LS.set('sn_user', found);
        showToast(`Welcome back, ${found.name}! 🎉`);
        showDashboard(found);
      } else {
        showToast('Incorrect password. Please try again.', 'error');
      }
    } else {
      // Demo fallback auto-login
      const demoUser = {
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        password: pass,
        phone: '+91 98765 43210'
      };
      users.push(demoUser);
      LS.set('sn_users', users);
      LS.set('sn_user', demoUser);
      showToast(`Welcome, ${demoUser.name}! 🎉`);
      showDashboard(demoUser);
    }
  });

  // ── 6. Register Form Submission ──
  document.getElementById('registerFormEl')?.addEventListener('submit', e => {
    e.preventDefault();
    const fName = document.getElementById('regFirstName')?.value.trim();
    const lName = document.getElementById('regLastName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const phone = document.getElementById('regPhone')?.value.trim();
    const pass  = document.getElementById('regPass')?.value.trim();

    if (!fName || !email || !pass) return;

    const fullName = `${fName} ${lName}`.trim();
    const newUser = { name: fullName, email, phone, password: pass };

    const users = LS.get('sn_users', []);
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      showToast('An account with this email already exists! Please login.', 'warning');
      loginTab?.click();
      return;
    }

    users.push(newUser);
    LS.set('sn_users', users);
    LS.set('sn_user', newUser);

    showToast(`Account created successfully! Welcome, ${fullName}! 🚀`);
    showDashboard(newUser);
  });

  // ── 7. Social Logins (Google & Facebook demo) ──
  document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
    const googleUser = { name: 'Google User', email: 'user.google@gmail.com', phone: '+91 98765 43210' };
    LS.set('sn_user', googleUser);
    showToast('Signed in via Google! 🚀');
    showDashboard(googleUser);
  });

  document.getElementById('facebookLoginBtn')?.addEventListener('click', () => {
    const fbUser = { name: 'Facebook User', email: 'user.fb@facebook.com', phone: '+91 98765 43210' };
    LS.set('sn_user', fbUser);
    showToast('Signed in via Facebook! 🚀');
    showDashboard(fbUser);
  });

  // ── 8. Forgot Password Demo ──
  document.getElementById('forgotPassLink')?.addEventListener('click', e => {
    e.preventDefault();
    const email = prompt('Enter your registered email address for password reset:');
    if (email && email.includes('@')) {
      showToast(`Password reset link sent to ${email} 📩`);
    }
  });

  // ── 9. Logout ──
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
      LS.set('sn_user', null);
      user = null;
      showToast('You have been logged out.');
      showAuth();
    }
  });

  // ── 10. Dashboard Tab Switching ──
  document.querySelectorAll('.dash-tab:not(.logout)').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.dataset.tab;
      const targetPanel = document.getElementById('tab' + targetTab.charAt(0).toUpperCase() + targetTab.slice(1));
      targetPanel?.classList.add('active');
    });
  });

  // ── 11. Avatar Color Gradient Switcher ──
  document.querySelectorAll('.avatar-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const grad = btn.dataset.grad;
      const avatarEl = document.getElementById('userAvatarBig');
      if (avatarEl && grad) {
        avatarEl.style.background = grad;
        if (user) {
          user.avatarGrad = grad;
          LS.set('sn_user', user);
          showToast('Avatar theme updated!');
        }
      }
    });
  });

  // ── 12. Profile Form Update ──
  document.getElementById('profileForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const updatedName  = document.getElementById('profName')?.value.trim();
    const updatedPhone = document.getElementById('profPhone')?.value.trim();
    const updatedEmail = document.getElementById('profEmail')?.value.trim();

    if (user) {
      user.name  = updatedName;
      user.phone = updatedPhone;
      user.email = updatedEmail;
      LS.set('sn_user', user);

      // Update in users registry as well
      const users = LS.get('sn_users', []);
      const idx = users.findIndex(u => u.email === user.email);
      if (idx !== -1) users[idx] = user;
      LS.set('sn_users', users);

      showToast('Profile information saved! ✅');
      showDashboard(user);
    }
  });

  // ── 13. Render Orders with Tracking & Reorder ──
  let activeOrderFilter = 'all';

  function renderOrders() {
    const list = document.getElementById('ordersList');
    if (!list) return;

    let orders = LS.get('sn_orders', []);

    // Create realistic initial sample order if list is empty
    if (!orders.length) {
      orders = [
        {
          id: 'SN-942851',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          items: [
            { id: 1, qty: 1 },
            { id: 7, qty: 1 }
          ],
          status: 'Processing',
          total: 3798,
          payMethod: 'card'
        },
        {
          id: 'SN-817342',
          date: new Date(Date.now() - 86400000 * 14).toISOString(),
          items: [
            { id: 23, qty: 1 }
          ],
          status: 'Delivered',
          total: 299,
          payMethod: 'upi'
        }
      ];
      LS.set('sn_orders', orders);
    }

    if (activeOrderFilter !== 'all') {
      orders = orders.filter(o => o.status === activeOrderFilter);
    }

    if (!orders.length) {
      list.innerHTML = `
        <div class="empty-state" style="padding:3rem 1rem;">
          <i class="fas fa-box-open" style="font-size:4rem;opacity:.15;margin-bottom:1rem;display:block;"></i>
          <h4>No orders found in this category</h4>
          <p style="color:var(--text-light);font-size:.9rem;">Check out our latest arrivals and start shopping today.</p>
          <a href="shop.html" class="btn btn-primary" style="margin-top:.75rem;">Browse Shop</a>
        </div>`;
      return;
    }

    list.innerHTML = orders.map(o => {
      const formattedDate = new Date(o.date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      const orderTotal = o.total || o.items?.reduce((s, i) => {
        const p = getProductById(i.id);
        return s + (p ? p.price * i.qty : 0);
      }, 0) || 0;

      const statusClass = o.status === 'Delivered' ? 'status-delivered' : 'status-processing';

      return `
        <div class="cart-item" style="flex-direction:column;align-items:stretch;gap:1rem;margin-bottom:1.5rem;padding:1.5rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.75rem;border-bottom:1px solid var(--border-light);padding-bottom:.85rem;">
            <div>
              <strong style="font-size:1.05rem;">Order #${o.id}</strong>
              <div style="font-size:.8rem;color:var(--text-muted);margin-top:.2rem;">Placed on ${formattedDate}</div>
            </div>
            <div style="display:flex;align-items:center;gap:.75rem;">
              <span class="order-status-badge ${statusClass}">
                <i class="fas ${o.status === 'Delivered' ? 'fa-check' : 'fa-clock'}"></i> ${o.status}
              </span>
              <strong style="font-size:1.15rem;color:var(--primary);">${formatPrice(orderTotal)}</strong>
            </div>
          </div>

          <!-- Item Thumbnails -->
          <div style="display:flex;flex-direction:column;gap:.75rem;">
            ${(o.items || []).map(item => {
              const p = getProductById(item.id);
              if (!p) return '';
              return `
                <div style="display:flex;align-items:center;gap:1rem;">
                  <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--primary);font-size:1.25rem;">
                    <i class="fas ${p.icon}"></i>
                  </div>
                  <div style="flex:1;">
                    <a href="product.html?id=${p.id}" style="font-weight:600;font-size:.9rem;color:var(--text);">${p.name}</a>
                    <div style="font-size:.78rem;color:var(--text-muted);">Qty: ${item.qty} × ${formatPrice(p.price)}</div>
                  </div>
                </div>`;
            }).join('')}
          </div>

          <!-- Actions Row -->
          <div style="display:flex;gap:.75rem;flex-wrap:wrap;border-top:1px solid var(--border-light);padding-top:.85rem;margin-top:.25rem;">
            <button class="btn btn-outline track-btn" data-order-id="${o.id}" style="padding:.45rem .85rem;font-size:.825rem;">
              <i class="fas fa-location-arrow"></i> Track Shipment
            </button>
            <button class="btn btn-outline reorder-btn" data-order-id="${o.id}" style="padding:.45rem .85rem;font-size:.825rem;">
              <i class="fas fa-rotate-right"></i> Buy Again
            </button>
            <button class="btn-text invoice-btn" data-order-id="${o.id}" style="margin-left:auto;font-size:.825rem;">
              <i class="fas fa-file-invoice"></i> Download Invoice
            </button>
          </div>
        </div>`;
    }).join('');

    // Bind Order Action Buttons
    list.querySelectorAll('.track-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        const modal = document.getElementById('trackingModal');
        const trackingOrderId = document.getElementById('trackingOrderId');
        if (trackingOrderId) trackingOrderId.textContent = `Order #${orderId}`;
        if (modal) modal.style.display = 'flex';
      });
    });

    list.querySelectorAll('.reorder-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        const targetOrder = orders.find(o => o.id === orderId);
        if (targetOrder && targetOrder.items) {
          targetOrder.items.forEach(i => addToCart(i.id, i.qty));
          showToast('Added items from past order back to cart! 🛒');
        }
      });
    });

    list.querySelectorAll('.invoice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('📄 Generating PDF Invoice… download started!');
      });
    });
  }

  // Filter Buttons for Orders
  document.querySelectorAll('[data-order-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-order-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeOrderFilter = btn.dataset.orderFilter;
      renderOrders();
    });
  });

  // Tracking Modal Close
  document.getElementById('closeTrackingModal')?.addEventListener('click', () => {
    const modal = document.getElementById('trackingModal');
    if (modal) modal.style.display = 'none';
  });

  // ── 14. Saved Addresses CRUD ──
  function renderAddresses() {
    const list = document.getElementById('addressBookList');
    if (!list) return;

    let addresses = LS.get('sn_addresses', null);
    if (!addresses) {
      addresses = [
        {
          id: 1,
          tag: 'Home',
          street: 'Flat 402, Green Glen Layout, Bellandur',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560103',
          isDefault: true
        },
        {
          id: 2,
          tag: 'Office',
          street: 'EcoWorld Tech Park, Tower 5B, 3rd Floor',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560103',
          isDefault: false
        }
      ];
      LS.set('sn_addresses', addresses);
    }

    list.innerHTML = addresses.map(addr => `
      <div style="background:var(--bg);border-radius:var(--radius);padding:1.25rem;border:1.5px solid ${addr.isDefault ? 'var(--primary)' : 'var(--border)'};position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem;">
          <span style="font-weight:700;font-size:.9rem;color:var(--text);"><i class="fas fa-tag" style="color:var(--primary);font-size:.8rem;"></i> ${addr.tag}</span>
          ${addr.isDefault ? '<span style="background:rgba(102,126,234,.12);color:var(--primary);font-size:.72rem;font-weight:700;padding:.15rem .5rem;border-radius:4px;">DEFAULT</span>' : ''}
        </div>
        <div style="font-size:.85rem;color:var(--text-light);line-height:1.5;margin-bottom:1rem;">
          ${addr.street}<br>${addr.city}, ${addr.state} – ${addr.pincode}
        </div>
        <div style="display:flex;gap:.5rem;">
          ${!addr.isDefault ? `<button class="btn-text set-def-addr" data-id="${addr.id}" style="font-size:.8rem;">Set Default</button>` : ''}
          <button class="btn-text del-addr" data-id="${addr.id}" style="font-size:.8rem;color:var(--accent);margin-left:auto;"><i class="fas fa-trash-alt"></i> Delete</button>
        </div>
      </div>
    `).join('');

    // Set Default Address
    list.querySelectorAll('.set-def-addr').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        addresses.forEach(a => { a.isDefault = a.id === id; });
        LS.set('sn_addresses', addresses);
        renderAddresses();
        showToast('Default address updated.');
      });
    });

    // Delete Address
    list.querySelectorAll('.del-addr').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const filtered = addresses.filter(a => a.id !== id);
        LS.set('sn_addresses', filtered);
        renderAddresses();
        showToast('Address removed.');
      });
    });
  }

  // Address Modal Open/Close
  document.getElementById('addNewAddrBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('addressModal');
    if (modal) modal.style.display = 'flex';
  });

  document.getElementById('closeAddressModal')?.addEventListener('click', () => {
    const modal = document.getElementById('addressModal');
    if (modal) modal.style.display = 'none';
  });

  // Save New Address
  document.getElementById('newAddressForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const tag    = document.getElementById('newAddrTag')?.value.trim();
    const street = document.getElementById('newAddrStreet')?.value.trim();
    const city   = document.getElementById('newAddrCity')?.value.trim();
    const state  = document.getElementById('newAddrState')?.value.trim();
    const pin    = document.getElementById('newAddrPin')?.value.trim();

    if (!tag || !street || !city || !state || !pin) return;

    const addresses = LS.get('sn_addresses', []);
    addresses.push({
      id: Date.now(),
      tag,
      street,
      city,
      state,
      pincode: pin,
      isDefault: addresses.length === 0
    });
    LS.set('sn_addresses', addresses);

    document.getElementById('addressModal').style.display = 'none';
    e.target.reset();
    renderAddresses();
    showToast('New address saved successfully! 🏠');
  });

  // ── 15. Dashboard Wishlist Tab ──
  function renderDashboardWishlist() {
    const grid = document.getElementById('dashWishlistGrid');
    if (!grid) return;
    const ids = getWishlist();
    if (!ids.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:2rem;">
          <i class="fas fa-heart-crack" style="font-size:3rem;opacity:.15;margin-bottom:.5rem;"></i>
          <p>No saved items in your wishlist.</p>
        </div>`;
      return;
    }
    const products = ids.map(id => getProductById(id)).filter(Boolean);
    grid.innerHTML = products.map(productCardHTML).join('');
    bindProductCards(grid);
  }

  // ── Initialize ──
  checkAuthState();
});
