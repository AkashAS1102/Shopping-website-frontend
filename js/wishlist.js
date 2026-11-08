/* ============================
   WISHLIST.JS v2.0
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid       = document.getElementById('wishlistGrid');
  const countEl    = document.getElementById('wishlistCount');
  const totalValEl = document.getElementById('wishlistTotalValue');
  const catFilter  = document.getElementById('wishlistCatFilter');
  const sortSelect = document.getElementById('wishlistSort');
  const recsGrid   = document.getElementById('wishlistRecsGrid');

  function renderWishlist() {
    const ids = getWishlist();
    let products = ids.map(id => getProductById(id)).filter(Boolean);

    // Filter by Category
    const selectedCat = catFilter?.value || 'all';
    if (selectedCat !== 'all') {
      products = products.filter(p => p.cat === selectedCat);
    }

    // Sort
    const sortVal = sortSelect?.value || 'default';
    if (sortVal === 'price-asc')  products.sort((a, b) => a.price - b.price);
    if (sortVal === 'price-desc') products.sort((a, b) => b.price - a.price);
    if (sortVal === 'rating')     products.sort((a, b) => b.rating - a.rating);

    // Update Counts & Values
    const totalCount = ids.length;
    const totalValue = ids.reduce((acc, id) => {
      const p = getProductById(id);
      return acc + (p ? p.price : 0);
    }, 0);

    if (countEl) countEl.textContent = `${totalCount} item${totalCount !== 1 ? 's' : ''} saved`;
    if (totalValEl) totalValEl.textContent = totalCount > 0 ? `· Total Worth: ${formatPrice(totalValue)}` : '';

    if (!products.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:4rem 2rem;">
          <i class="fas fa-heart-crack" style="font-size:5rem;opacity:.15;margin-bottom:1rem;display:block;color:var(--accent);"></i>
          <h3>Your wishlist is empty</h3>
          <p>Explore our products and tap the heart icon to save your favorite items here.</p>
          <div style="display:flex;gap:1rem;justify-content:center;margin-top:1.5rem;">
            <a href="shop.html" class="btn btn-primary"><i class="fas fa-store"></i> Browse Catalog</a>
          </div>
        </div>`;
      renderRecommendations();
      return;
    }

    grid.innerHTML = products.map(p => {
      const discount = getDiscountPercent(p);
      return `
        <div class="product-card reveal" data-id="${p.id}">
          <div class="product-image">
            <i class="fas ${p.icon} prod-icon"></i>
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
            <div class="product-actions" style="opacity:1;transform:none;">
              <button class="action-btn wish-btn wishlisted" data-id="${p.id}" title="Remove from Wishlist">
                <i class="fas fa-heart"></i>
              </button>
              <a href="product.html?id=${p.id}" class="action-btn" title="View Details"><i class="fas fa-eye"></i></a>
            </div>
            ${!p.inStock ? '<div style="position:absolute;inset:0;background:rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--text-muted);font-size:.85rem;">Out of Stock</div>' : ''}
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
              ${p.originalPrice > p.price ? `<span class="price-original">${formatPrice(p.originalPrice)}</span><span class="price-off">${discount}% off</span>` : ''}
            </div>
          </div>
          <div class="product-footer" style="display:flex;gap:.5rem;">
            ${p.inStock
              ? `<button class="add-to-cart-btn cart-add" data-id="${p.id}" style="flex:1;">
                   <i class="fas fa-cart-plus"></i> Move to Cart
                 </button>`
              : `<button class="out-of-stock-btn" style="flex:1;" disabled>Out of Stock</button>`}
          </div>
        </div>`;
    }).join('');

    // Remove from wishlist
    grid.querySelectorAll('.wish-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const id = parseInt(btn.dataset.id);
        const card = btn.closest('.product-card');
        if (card) {
          card.style.transition = 'all .3s ease';
          card.style.transform = 'scale(.8)';
          card.style.opacity = '0';
          setTimeout(() => {
            toggleWishlist(id);
            renderWishlist();
          }, 280);
        } else {
          toggleWishlist(id);
          renderWishlist();
        }
      });
    });

    // Move to cart (Add & remove from wishlist)
    grid.querySelectorAll('.cart-add').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const id = parseInt(btn.dataset.id);
        addToCart(id, 1);
        removeFromWishlist(id);
        showToast('Moved item to Cart! 🛒');
        renderWishlist();
      });
    });

    renderRecommendations();
  }

  // ── Render Recommendations (Products NOT in wishlist) ──
  function renderRecommendations() {
    if (!recsGrid) return;
    const wishIds = getWishlist();
    const recs = PRODUCTS.filter(p => !wishIds.includes(p.id) && p.inStock).slice(0, 4);

    if (!recs.length) {
      document.getElementById('wishlistRecsSection')?.style.setProperty('display', 'none');
      return;
    }
    document.getElementById('wishlistRecsSection')?.style.removeProperty('display');
    recsGrid.innerHTML = recs.map(productCardHTML).join('');
    bindProductCards(recsGrid);
  }

  // ── Add All Available Items to Cart ──
  document.getElementById('addAllToCart')?.addEventListener('click', () => {
    const ids = getWishlist();
    if (!ids.length) {
      showToast('Your wishlist is empty!', 'warning');
      return;
    }
    let addedCount = 0;
    ids.forEach(id => {
      const p = getProductById(id);
      if (p && p.inStock) {
        addToCart(id, 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      showToast(`🎉 Added ${addedCount} item${addedCount !== 1 ? 's' : ''} to cart!`);
    } else {
      showToast('Items in your wishlist are currently out of stock.', 'warning');
    }
  });

  // ── Clear All Wishlist ──
  document.getElementById('clearWishlistBtn')?.addEventListener('click', () => {
    const ids = getWishlist();
    if (!ids.length) {
      showToast('Wishlist is already empty.', 'warning');
      return;
    }
    if (confirm('Are you sure you want to remove all saved items?')) {
      LS.set('sn_wish', []);
      updateBadges();
      renderWishlist();
      showToast('Wishlist cleared.');
    }
  });

  // ── Share Wishlist Link ──
  document.getElementById('shareWishlistBtn')?.addEventListener('click', () => {
    const ids = getWishlist();
    if (!ids.length) {
      showToast('Add some items before sharing your wishlist!', 'warning');
      return;
    }
    const shareUrl = window.location.origin + window.location.pathname + '?shared=' + ids.join(',');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('📋 Wishlist link copied to clipboard!');
      }).catch(() => {
        prompt('Copy your wishlist link:', shareUrl);
      });
    } else {
      prompt('Copy your wishlist link:', shareUrl);
    }
  });

  // ── Filters & Sorters ──
  catFilter?.addEventListener('change', renderWishlist);
  sortSelect?.addEventListener('change', renderWishlist);

  // ── Init ──
  renderWishlist();
});
