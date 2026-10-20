/* ============================
   PRODUCT.JS – Product Detail Page
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id     = parseInt(params.get('id'));
  const product = getProductById(id);
  const detail  = document.getElementById('productDetail');

  if (!product) {
    detail.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <i class="fas fa-box-open"></i><p>Product not found. <a href="shop.html" class="link">Browse shop</a></p></div>`;
    return;
  }

  // Update page title
  document.title = `${product.name} – ShopNow`;

  const wished    = isWishlisted(id);
  const discount  = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  detail.innerHTML = `
    <!-- Gallery -->
    <div class="product-gallery">
      <div class="gallery-main" id="galleryMain">
        <i class="fas ${product.icon}"></i>
      </div>
      <div class="gallery-thumbs">
        <div class="thumb active"><i class="fas ${product.icon}"></i></div>
        <div class="thumb"><i class="fas ${product.icon}"></i></div>
        <div class="thumb"><i class="fas ${product.icon}"></i></div>
      </div>
    </div>

    <!-- Info -->
    <div class="product-detail-info">
      <nav class="breadcrumb" style="justify-content:flex-start;margin-bottom:1rem;">
        <a href="index.html">Home</a> <i class="fas fa-chevron-right"></i>
        <a href="shop.html">Shop</a> <i class="fas fa-chevron-right"></i>
        <a href="shop.html?cat=${product.cat}">${product.cat.charAt(0).toUpperCase() + product.cat.slice(1)}</a>
      </nav>
      <div class="product-cat">${product.cat.charAt(0).toUpperCase() + product.cat.slice(1)}</div>
      <h1 class="product-name" style="font-size:1.75rem;margin-bottom:.75rem;">${product.name}</h1>
      <div class="product-rating" style="margin-bottom:0;">
        <div class="stars">${starsHTML(product.rating)}</div>
        <span class="rating-count">${product.rating} · ${product.reviews.toLocaleString()} reviews</span>
      </div>
      <div class="product-price" style="margin:1.25rem 0;">
        <span class="price-current">${formatPrice(product.price)}</span>
        ${product.originalPrice > product.price
          ? `<span class="price-original">${formatPrice(product.originalPrice)}</span><span class="price-off">${discount}% off</span>` : ''}
      </div>
      <p class="product-desc">${product.description}</p>

      ${product.sizes?.length ? `
        <div class="size-selector">
          <h4>Select Size</h4>
          <div class="size-options">
            ${product.sizes.map((s, i) => `<button class="size-btn${i === 0 ? ' active' : ''}">${s}</button>`).join('')}
          </div>
        </div>` : ''}

      <div class="qty-wrapper">
        <h4>Quantity:</h4>
        <div class="qty-control">
          <button class="qty-btn" id="qtyMinus">−</button>
          <span class="qty-num" id="qtyNum">1</span>
          <button class="qty-btn" id="qtyPlus">+</button>
        </div>
      </div>

      <div class="detail-actions">
        ${product.inStock
          ? `<button class="btn btn-primary" id="detailAddCart"><i class="fas fa-cart-plus"></i> Add to Cart</button>
             <a href="cart.html" class="btn btn-outline" id="buyNowBtn" style="display:none"><i class="fas fa-bolt"></i> Go to Cart</a>`
          : `<button class="btn" style="background:var(--border);color:var(--text-light);cursor:not-allowed" disabled>Out of Stock</button>`}
        <button class="wishlist-detail-btn ${wished ? 'wishlisted' : ''}" id="wishBtn">
          <i class="fa${wished ? 's' : 'r'} fa-heart"></i>
        </button>
      </div>

      <div class="product-badges" style="margin-top:1.5rem;">
        <span class="info-badge"><i class="fas fa-truck-fast"></i> Free delivery over ₹499</span>
        <span class="info-badge"><i class="fas fa-shield-halved"></i> Secure payment</span>
        <span class="info-badge"><i class="fas fa-rotate-left"></i> 30-day returns</span>
        ${product.inStock ? '<span class="info-badge" style="color:var(--success)"><i class="fas fa-circle-check"></i> In Stock</span>' : '<span class="info-badge" style="color:var(--accent)"><i class="fas fa-circle-xmark"></i> Out of Stock</span>'}
      </div>

      <div class="product-meta" style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border);">
        <div><span>Category: </span><strong><a href="shop.html?cat=${product.cat}" class="link">${product.cat.charAt(0).toUpperCase() + product.cat.slice(1)}</a></strong></div>
        <div><span>Tags: </span><strong>${product.tags.join(', ')}</strong></div>
        <div><span>Product ID: </span><strong>#SN${String(product.id).padStart(4, '0')}</strong></div>
      </div>
    </div>`;

  // Qty logic
  let qty = 1;
  document.getElementById('qtyMinus')?.addEventListener('click', () => { if (qty > 1) { qty--; document.getElementById('qtyNum').textContent = qty; } });
  document.getElementById('qtyPlus')?.addEventListener('click',  () => { qty++; document.getElementById('qtyNum').textContent = qty; });

  // Add to cart
  document.getElementById('detailAddCart')?.addEventListener('click', () => {
    addToCart(id, qty);
    const btn = document.getElementById('detailAddCart');
    btn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
    document.getElementById('buyNowBtn')?.style.setProperty('display', 'inline-flex');
    setTimeout(() => { btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart'; }, 2000);
  });

  // Wishlist
  document.getElementById('wishBtn')?.addEventListener('click', () => {
    const added = toggleWishlist(id);
    const btn = document.getElementById('wishBtn');
    btn.classList.toggle('wishlisted', added);
    btn.innerHTML = added ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
  });

  // Size selector
  detail.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      detail.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Thumbs
  detail.querySelectorAll('.thumb').forEach(t => {
    t.addEventListener('click', () => {
      detail.querySelectorAll('.thumb').forEach(tt => tt.classList.remove('active'));
      t.classList.add('active');
    });
  });

  // Related Products
  const related = PRODUCTS.filter(p => p.cat === product.cat && p.id !== id).slice(0, 4);
  const relGrid = document.getElementById('relatedGrid');
  if (relGrid) {
    relGrid.innerHTML = related.map(productCardHTML).join('');
    bindProductCards(relGrid);
  }
});
