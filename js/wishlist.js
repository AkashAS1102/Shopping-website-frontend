/* ============================
   WISHLIST.JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid  = document.getElementById('wishlistGrid');
  const count = document.getElementById('wishlistCount');

  function renderWishlist() {
    const ids      = getWishlist();
    const products = ids.map(id => getProductById(id)).filter(Boolean);

    if (count) count.textContent = `${products.length} item${products.length !== 1 ? 's' : ''} saved`;

    if (!products.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <i class="fas fa-heart-crack"></i>
          <p>Your wishlist is empty.</p>
          <a href="shop.html" class="btn btn-primary">Discover Products <i class="fas fa-arrow-right"></i></a>
        </div>`;
      return;
    }

    grid.innerHTML = products.map(p => {
      const wished = true;
      const discount = p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
      return `
        <div class="product-card" data-id="${p.id}">
          <div class="product-image">
            <i class="fas ${p.icon} prod-icon"></i>
            ${p.badge ? `<span class="product-badge${p.isNew ? ' new-badge' : ''}">${p.badge}</span>` : ''}
            <div class="product-actions" style="opacity:1;transform:none;">
              <button class="action-btn wish-btn wishlisted" data-id="${p.id}" title="Remove from Wishlist">
                <i class="fas fa-heart"></i>
              </button>
              <a href="product.html?id=${p.id}" class="action-btn" title="View"><i class="fas fa-eye"></i></a>
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
    }).join('');

    // Bind wish buttons
    grid.querySelectorAll('.wish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleWishlist(parseInt(btn.dataset.id));
        renderWishlist();
      });
    });

    // Bind cart buttons
    bindProductCards(grid);
  }

  // Add all to cart
  document.getElementById('addAllToCart')?.addEventListener('click', () => {
    const ids = getWishlist();
    if (!ids.length) { showToast('Wishlist is empty!'); return; }
    ids.forEach(id => {
      const p = getProductById(id);
      if (p?.inStock) addToCart(id, 1);
    });
    showToast(`${ids.length} items added to cart!`);
  });

  renderWishlist();
});
