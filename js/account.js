/* ============================
   ACCOUNT.JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const authForms  = document.getElementById('authForms');
  const dashboard  = document.getElementById('dashboard');
  const loginForm  = document.getElementById('loginForm');
  const regForm    = document.getElementById('registerForm');
  const loginTab   = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');

  // ── Auth state ──
  let user = LS.get('sn_user', null);

  function showDashboard(u) {
    user = u;
    authForms?.classList.add('hidden');
    dashboard?.classList.remove('hidden');
    const initials = (u.name || 'U').charAt(0).toUpperCase();
    const el = document.getElementById('userAvatarBig');
    const nl = document.getElementById('userNameBig');
    if (el) el.textContent = initials;
    if (nl) nl.textContent = u.name || 'User';
    renderDashboardWishlist();
    renderOrders();
  }

  function showAuth() {
    authForms?.classList.remove('hidden');
    dashboard?.classList.add('hidden');
  }

  // Check if logged in
  if (user) showDashboard(user);
  else showAuth();

  // ── Tab switching ──
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
  document.getElementById('toRegister')?.addEventListener('click', e => { e.preventDefault(); registerTab?.click(); });
  document.getElementById('toLogin')?.addEventListener('click',    e => { e.preventDefault(); loginTab?.click(); });

  // ── Login ──
  document.getElementById('loginFormEl')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const pass  = document.getElementById('loginPass')?.value;
    if (!email || !pass) return;
    // Check registered users
    const users = LS.get('sn_users', []);
    const found = users.find(u => u.email === email);
    if (found && found.password === pass) {
      LS.set('sn_user', found);
      showToast(`Welcome back, ${found.name}!`);
      showDashboard(found);
    } else if (!found) {
      // Demo: auto-create on first login
      const demoUser = { name: email.split('@')[0], email, password: pass };
      LS.set('sn_user', demoUser);
      showToast(`Welcome, ${demoUser.name}!`);
      showDashboard(demoUser);
    } else {
      showToast('Incorrect password. Try again.');
    }
  });

  // ── Register ──
  document.getElementById('registerFormEl')?.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    const firstName = inputs[0]?.value;
    const lastName  = inputs[1]?.value;
    const email     = inputs[2]?.value;
    const password  = document.getElementById('regPass')?.value;
    const name = `${firstName} ${lastName}`.trim();
    const newUser = { name, email, password };
    const users = LS.get('sn_users', []);
    users.push(newUser);
    LS.set('sn_users', users);
    LS.set('sn_user', newUser);
    showToast(`Account created! Welcome, ${name}!`);
    showDashboard(newUser);
  });

  // ── Logout ──
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    LS.set('sn_user', null);
    user = null;
    showToast('Logged out. See you soon!');
    showAuth();
  });

  // ── Password visibility ──
  document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isPass = target.type === 'password';
      target.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  });

  // ── Dashboard Tabs ──
  document.querySelectorAll('.dash-tab:not(.logout)').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
      panel?.classList.add('active');
    });
  });

  // ── Render Orders ──
  function renderOrders() {
    const orders = LS.get('sn_orders', []);
    const list   = document.getElementById('ordersList');
    if (!list) return;
    if (!orders.length) {
      list.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i><p>No orders yet. <a href="shop.html">Start shopping!</a></p></div>`;
      return;
    }
    list.innerHTML = orders.map(o => {
      const date = new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const total = o.items?.reduce((s, i) => { const p = getProductById(i.id); return s + (p ? p.price * i.qty : 0); }, 0) || 0;
      return `<div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-name">Order #${o.id}</div>
          <div class="cart-item-cat">${date}</div>
          <div class="cart-item-price">${formatPrice(total)}</div>
          <div style="margin-top:.5rem;font-size:.8rem;">
            <span style="background:#dcfce7;color:#16a34a;padding:.2rem .6rem;border-radius:20px;font-weight:600;">${o.status}</span>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // ── Dashboard Wishlist ──
  function renderDashboardWishlist() {
    const grid = document.getElementById('dashWishlistGrid');
    if (!grid) return;
    const ids  = getWishlist();
    if (!ids.length) {
      grid.innerHTML = `<div class="empty-state"><i class="fas fa-heart-crack"></i><p>No wishlist items.</p></div>`;
      return;
    }
    const products = ids.map(id => getProductById(id)).filter(Boolean);
    grid.innerHTML = products.map(productCardHTML).join('');
    bindProductCards(grid);
  }

});
