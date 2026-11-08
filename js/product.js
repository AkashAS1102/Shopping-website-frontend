/* ============================
   PRODUCT.JS v2.0
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(location.search);
  const id      = parseInt(params.get('id'));
  const product = getProductById(id);
  const detail  = document.getElementById('productDetail');

  if (!product) {
    detail.innerHTML = `<div class="empty-state" style="grid-column:1/-1;padding:5rem 2rem">
      <i class="fas fa-box-open" style="font-size:5rem;opacity:.15;margin-bottom:1rem;display:block;color:var(--primary)"></i>
      <h2>Product not found</h2>
      <p>The product you're looking for doesn't exist or has been removed.</p>
      <a href="shop.html" class="btn btn-primary" style="margin-top:1rem"><i class="fas fa-arrow-left"></i> Back to Shop</a>
    </div>`;
    return;
  }

  // Track recently viewed
  const rv = LS.get('sn_recent', []);
  if (!rv.includes(id)) { rv.unshift(id); LS.set('sn_recent', rv.slice(0, 10)); }

  document.title = `${product.name} – ShopNow`;
  const discount = getDiscountPercent(product);
  const wished   = isWishlisted(id);

  // ── Render Product Detail ──
  detail.innerHTML = `
    <!-- Gallery Column -->
    <div class="product-gallery">
      <div class="gallery-main" id="galleryMain" title="Zoom">
        <i class="fas ${product.icon}" id="galleryIcon" style="font-size:10rem;opacity:.2"></i>
        <span class="zoom-hint"><i class="fas fa-search-plus"></i> Hover to zoom</span>
      </div>
      <div class="gallery-thumbs">
        ${[0,1,2,3].map((_, i) => `<div class="thumb ${i===0?'active':''}" data-idx="${i}"><i class="fas ${product.icon}"></i></div>`).join('')}
      </div>
    </div>

    <!-- Info Column -->
    <div class="product-detail-info">
      <nav class="breadcrumb" style="justify-content:flex-start;margin-bottom:1rem;color:rgba(255,255,255,.7);">
        <a href="index.html" style="color:var(--text-light)">Home</a>
        <i class="fas fa-chevron-right"></i>
        <a href="shop.html" style="color:var(--text-light)">Shop</a>
        <i class="fas fa-chevron-right"></i>
        <a href="shop.html?cat=${product.cat}" style="color:var(--text-light)">${product.cat.charAt(0).toUpperCase()+product.cat.slice(1)}</a>
        <i class="fas fa-chevron-right"></i>
        <span style="color:var(--text)">${product.name.slice(0,30)}${product.name.length>30?'…':''}</span>
      </nav>

      ${product.brand ? `<div style="font-size:.8rem;color:var(--primary);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:.4rem">${product.brand}</div>` : ''}
      <h1 class="product-name" style="font-size:1.85rem;font-weight:900;margin-bottom:.75rem">${product.name}</h1>

      <!-- Rating & Share -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;margin-bottom:1rem;">
        <div class="product-rating" style="gap:.5rem;">
          <div class="stars">${starsHTML(product.rating)}</div>
          <span style="font-weight:700;font-size:.95rem">${product.rating}</span>
          <span class="rating-count">(${product.reviews.toLocaleString()} reviews)</span>
        </div>
        <div class="share-btns">
          <span style="font-size:.8rem;color:var(--text-muted);margin-right:.25rem">Share:</span>
          <button class="share-btn" onclick="navigator.share && navigator.share({title:'${product.name}',url:location.href})" title="Share"><i class="fas fa-share-nodes"></i></button>
          <button class="share-btn" onclick="navigator.clipboard.writeText(location.href);showToast('Link copied!')" title="Copy link"><i class="fas fa-link"></i></button>
        </div>
      </div>

      <!-- Price -->
      <div class="product-price" style="margin:1.25rem 0;align-items:center;">
        <span class="price-current" style="font-size:2.2rem">${formatPrice(product.price)}</span>
        ${product.originalPrice > product.price ? `
          <span class="price-original" style="font-size:1rem">${formatPrice(product.originalPrice)}</span>
          <span class="price-off" style="font-size:.875rem">${discount}% off</span>
          <span style="font-size:.825rem;color:var(--success);margin-left:.5rem">You save ${formatPrice(product.originalPrice - product.price)}</span>
        ` : ''}
      </div>

      <!-- Stock badge -->
      <div style="margin-bottom:1.25rem">
        ${product.inStock
          ? '<span style="display:inline-flex;align-items:center;gap:.4rem;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;padding:.35rem .85rem;border-radius:20px;font-size:.8rem;font-weight:700;"><span style="width:8px;height:8px;border-radius:50%;background:#15803d;display:inline-block;animation:pulseShadow 2s infinite"></span> In Stock – Ready to Ship</span>'
          : '<span style="display:inline-flex;align-items:center;gap:.4rem;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;padding:.35rem .85rem;border-radius:20px;font-size:.8rem;font-weight:700;"><i class="fas fa-circle-xmark"></i> Out of Stock</span>'}
      </div>

      <p class="product-desc">${product.description}</p>

      <!-- Size Selector -->
      ${product.sizes?.length ? `
        <div class="size-selector">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem;">
            <h4 style="font-size:.9rem;font-weight:700;">Size</h4>
            <a href="#" style="font-size:.8rem;color:var(--primary);text-decoration:underline;">Size Guide</a>
          </div>
          <div class="size-options">
            ${product.sizes.map((s, i) => `<button class="size-btn ${i===0?'active':''}">${s}</button>`).join('')}
          </div>
        </div>` : ''}

      <!-- Quantity -->
      <div class="qty-wrapper">
        <h4 style="font-size:.9rem;font-weight:700;min-width:80px">Quantity:</h4>
        <div class="qty-control" style="border:1.5px solid var(--border);border-radius:var(--radius-sm)">
          <button class="qty-btn" id="qtyMinus">−</button>
          <span class="qty-num" id="qtyNum">1</span>
          <button class="qty-btn" id="qtyPlus">+</button>
        </div>
        <span style="font-size:.8rem;color:var(--text-muted)">Max 10 per order</span>
      </div>

      <!-- Actions -->
      <div class="detail-actions" style="margin-bottom:1.5rem;">
        ${product.inStock ? `
          <button class="btn btn-primary" id="detailAddCart" style="min-width:180px">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <a href="checkout.html" class="btn btn-outline" id="buyNowBtn" style="display:none">
            <i class="fas fa-bolt"></i> Buy Now
          </a>` : `
          <button class="btn" style="background:var(--border);color:var(--text-light);cursor:not-allowed;min-width:180px" disabled>
            <i class="fas fa-ban"></i> Out of Stock
          </button>`}
        <button class="wishlist-detail-btn ${wished?'wishlisted':''}" id="wishBtn" title="${wished?'Remove from Wishlist':'Add to Wishlist'}">
          <i class="fa${wished?'s':'r'} fa-heart"></i>
        </button>
      </div>

      <!-- Info Badges -->
      <div class="product-badges">
        <span class="info-badge"><i class="fas fa-truck-fast"></i> Free delivery ₹499+</span>
        <span class="info-badge"><i class="fas fa-shield-halved"></i> Secure payment</span>
        <span class="info-badge"><i class="fas fa-rotate-left"></i> 30-day returns</span>
        <span class="info-badge"><i class="fas fa-certificate"></i> 100% Authentic</span>
      </div>

      <!-- Product Tabs -->
      <div class="product-tabs" style="margin-top:2rem">
        <div class="product-tab-links">
          <button class="product-tab-btn active" data-tab="description">Description</button>
          <button class="product-tab-btn" data-tab="specs">Specifications</button>
          <button class="product-tab-btn" data-tab="reviews">Reviews (${product.reviewList?.length || 0})</button>
          <button class="product-tab-btn" data-tab="shipping">Shipping</button>
        </div>

        <div class="product-tab-panel active" id="tab-description">
          <p style="color:var(--text-light);line-height:1.85">${product.description}</p>
          ${product.tags?.length ? `<div style="margin-top:1rem;display:flex;gap:.4rem;flex-wrap:wrap;">
            ${product.tags.map(t => `<span style="background:var(--bg);border:1px solid var(--border);border-radius:20px;padding:.2rem .7rem;font-size:.78rem;color:var(--text-light)">#${t}</span>`).join('')}
          </div>` : ''}
        </div>

        <div class="product-tab-panel" id="tab-specs">
          ${product.specs && Object.keys(product.specs).length ? `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
              ${Object.entries(product.specs).map(([k,v]) => `
                <div style="background:var(--bg);border-radius:var(--radius-sm);padding:.75rem 1rem;border:1px solid var(--border)">
                  <div style="font-size:.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:.2rem">${k}</div>
                  <div style="font-weight:600;font-size:.9rem">${v}</div>
                </div>`).join('')}
            </div>` : '<p style="color:var(--text-muted)">No specifications available.</p>'}
        </div>

        <div class="product-tab-panel" id="tab-reviews">
          ${product.reviewList?.length ? `
            <div class="review-list">
              ${product.reviewList.map(r => `
                <div class="review-item">
                  <div class="review-header">
                    <div class="avatar" style="background:var(--grad-primary);width:36px;height:36px;font-size:.85rem">${r.name[0]}</div>
                    <div>
                      <div class="review-name">${r.name}</div>
                      <div class="stars" style="gap:2px">${starsHTML(r.rating)}</div>
                    </div>
                    <div class="review-date">Verified Purchase</div>
                  </div>
                  <p class="review-text">${r.text}</p>
                </div>`).join('')}
            </div>
            <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border)">
              <h4 style="font-weight:700;margin-bottom:1rem">Write a Review</h4>
              <form id="reviewForm">
                <div class="form-group"><input type="text" placeholder="Your name" required/></div>
                <div style="display:flex;gap:.35rem;margin-bottom:1rem;" id="starRating">
                  ${[1,2,3,4,5].map(n=>`<button type="button" class="star-pick" data-val="${n}" style="font-size:1.5rem;background:none;color:var(--border);cursor:pointer;transition:color .2s">★</button>`).join('')}
                </div>
                <div class="form-group"><textarea placeholder="Share your thoughts…" rows="3" required style="resize:vertical"></textarea></div>
                <button type="submit" class="btn btn-primary">Submit Review <i class="fas fa-paper-plane"></i></button>
              </form>
            </div>` : `
            <div style="text-align:center;padding:2rem;color:var(--text-muted)">
              <i class="fas fa-star" style="font-size:2.5rem;opacity:.2;margin-bottom:.75rem;display:block;color:var(--warning)"></i>
              <p>No reviews yet. Be the first!</p>
              <form id="reviewForm" style="margin-top:1.5rem;text-align:left">
                <div class="form-group"><input type="text" placeholder="Your name" required/></div>
                <div style="display:flex;gap:.35rem;margin-bottom:1rem;" id="starRating">
                  ${[1,2,3,4,5].map(n=>`<button type="button" class="star-pick" data-val="${n}" style="font-size:1.5rem;background:none;color:var(--border);cursor:pointer;transition:color .2s">★</button>`).join('')}
                </div>
                <div class="form-group"><textarea placeholder="Share your experience…" rows="3" required style="resize:vertical"></textarea></div>
                <button type="submit" class="btn btn-primary">Submit Review</button>
              </form>
            </div>`}
        </div>

        <div class="product-tab-panel" id="tab-shipping">
          <div style="display:flex;flex-direction:column;gap:1rem">
            <div class="info-badge" style="font-size:.9rem;padding:.85rem 1.25rem;justify-content:flex-start;gap:.85rem"><i class="fas fa-truck-fast" style="font-size:1.1rem;color:var(--success)"></i><div><strong>Standard Delivery</strong><div style="color:var(--text-muted);font-size:.82rem">3–5 business days · FREE on orders ₹499+, else ₹49</div></div></div>
            <div class="info-badge" style="font-size:.9rem;padding:.85rem 1.25rem;justify-content:flex-start;gap:.85rem"><i class="fas fa-bolt" style="font-size:1.1rem;color:var(--warning)"></i><div><strong>Express Delivery</strong><div style="color:var(--text-muted);font-size:.82rem">1–2 business days · ₹99 (select pin codes)</div></div></div>
            <div class="info-badge" style="font-size:.9rem;padding:.85rem 1.25rem;justify-content:flex-start;gap:.85rem"><i class="fas fa-rotate-left" style="font-size:1.1rem;color:var(--info)"></i><div><strong>Easy Returns</strong><div style="color:var(--text-muted);font-size:.82rem">30-day no-questions-asked return policy</div></div></div>
            <div class="info-badge" style="font-size:.9rem;padding:.85rem 1.25rem;justify-content:flex-start;gap:.85rem"><i class="fas fa-shield-halved" style="font-size:1.1rem;color:var(--primary)"></i><div><strong>Secure Packaging</strong><div style="color:var(--text-muted);font-size:.82rem">All items are carefully packed to prevent damage</div></div></div>
          </div>
        </div>
      </div>

      <!-- Product Meta -->
      <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border);font-size:.85rem;color:var(--text-muted);display:flex;flex-direction:column;gap:.35rem">
        <div>SKU: <strong>SN${String(product.id).padStart(4,'0')}</strong></div>
        <div>Category: <a href="shop.html?cat=${product.cat}" style="color:var(--primary)">${product.cat.charAt(0).toUpperCase()+product.cat.slice(1)}</a></div>
        ${product.brand ? `<div>Brand: <a href="shop.html?q=${product.brand}" style="color:var(--primary)">${product.brand}</a></div>` : ''}
        <div>Tags: ${product.tags.map(t=>`<a href="shop.html?q=${t}" style="color:var(--primary)">${t}</a>`).join(', ')}</div>
      </div>
    </div>`;

  // ── Quantity Controls ──
  let qty = 1;
  const qtyNum = document.getElementById('qtyNum');
  document.getElementById('qtyMinus')?.addEventListener('click', () => { if (qty > 1) { qty--; qtyNum.textContent = qty; } });
  document.getElementById('qtyPlus')?.addEventListener('click',  () => { if (qty < 10) { qty++; qtyNum.textContent = qty; } });

  // ── Add to Cart ──
  document.getElementById('detailAddCart')?.addEventListener('click', () => {
    addToCart(id, qty);
    const btn = document.getElementById('detailAddCart');
    btn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
    btn.style.background = 'var(--success)';
    document.getElementById('buyNowBtn')?.style.setProperty('display','inline-flex');
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
      btn.style.background = '';
    }, 2000);
  });

  // Buy now
  document.getElementById('buyNowBtn')?.addEventListener('click', () => {
    addToCart(id, qty);
    window.location.href = 'checkout.html';
  });

  // ── Wishlist ──
  document.getElementById('wishBtn')?.addEventListener('click', () => {
    const added = toggleWishlist(id);
    const btn = document.getElementById('wishBtn');
    btn.classList.toggle('wishlisted', added);
    btn.innerHTML = added ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    btn.title = added ? 'Remove from Wishlist' : 'Add to Wishlist';
  });

  // ── Size Selector ──
  detail.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      detail.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── Gallery Thumbnails ──
  detail.querySelectorAll('.thumb').forEach(t => {
    t.addEventListener('click', () => {
      detail.querySelectorAll('.thumb').forEach(tt => tt.classList.remove('active'));
      t.classList.add('active');
      // Simulate image change with slight opacity animation
      const main = document.getElementById('galleryMain');
      if (main) {
        main.style.opacity = '0';
        setTimeout(() => { main.style.opacity = '1'; }, 200);
      }
    });
  });

  // ── Product Tabs ──
  detail.querySelectorAll('.product-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      detail.querySelectorAll('.product-tab-btn').forEach(b => b.classList.remove('active'));
      detail.querySelectorAll('.product-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = detail.querySelector(`#tab-${btn.dataset.tab}`);
      panel?.classList.add('active');
    });
  });

  // ── Star Rating Picker ──
  let selectedRating = 0;
  document.querySelectorAll('.star-pick').forEach((star, i) => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.val);
      document.querySelectorAll('.star-pick').forEach((s, j) => {
        s.style.color = j < selectedRating ? 'var(--warning)' : 'var(--border)';
      });
    });
    star.addEventListener('mouseenter', () => {
      document.querySelectorAll('.star-pick').forEach((s, j) => {
        s.style.color = j <= i ? 'var(--warning)' : 'var(--border)';
      });
    });
    star.addEventListener('mouseleave', () => {
      document.querySelectorAll('.star-pick').forEach((s, j) => {
        s.style.color = j < selectedRating ? 'var(--warning)' : 'var(--border)';
      });
    });
  });

  // ── Review Form ──
  document.getElementById('reviewForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (!selectedRating) { showToast('Please select a star rating', 'warning'); return; }
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
    btn.disabled = true;
    setTimeout(() => {
      showToast('🙏 Thank you for your review!');
      e.target.reset();
      selectedRating = 0;
      document.querySelectorAll('.star-pick').forEach(s => s.style.color = 'var(--border)');
      btn.innerHTML = 'Submit Review';
      btn.disabled = false;
    }, 1500);
  });

  // ── Related Products ──
  const related  = getRelatedProducts(product, 4);
  const relGrid  = document.getElementById('relatedGrid');
  if (relGrid) {
    relGrid.innerHTML = related.length
      ? related.map(productCardHTML).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-boxes-stacked"></i><p>No related products found.</p></div>`;
    bindProductCards(relGrid);
  }

  // ── Recently Viewed ──
  const recentIds = LS.get('sn_recent', []).filter(rid => rid !== id).slice(0, 4);
  const recentGrid = document.getElementById('recentGrid');
  if (recentGrid && recentIds.length) {
    recentGrid.innerHTML = recentIds.map(rid => {
      const rp = getProductById(rid);
      return rp ? productCardHTML(rp) : '';
    }).join('');
    bindProductCards(recentGrid);
  }
});
