/* ============================
   PRODUCT DATA
   ============================ */

const PRODUCTS = [
  // Electronics
  { id: 1,  name: "Wireless Noise-Cancelling Headphones", cat: "electronics", price: 2999, originalPrice: 5999, rating: 4.8, reviews: 1243, icon: "fa-headphones", badge: "50% OFF", inStock: true, isNew: false, isSale: true, description: "Premium wireless headphones with active noise cancellation, 30hr battery life, and crystal-clear sound. Perfect for music, calls, and travel.", sizes: [], tags: ["wireless", "audio", "noise-cancelling"] },
  { id: 2,  name: "Smart Watch Pro Series 5", cat: "electronics", price: 3499, originalPrice: 4999, rating: 4.6, reviews: 892, icon: "fa-clock", badge: "SALE", inStock: true, isNew: false, isSale: true, description: "Advanced smartwatch with health monitoring, GPS, AMOLED display, and 7-day battery life. Track fitness and stay connected.", sizes: [], tags: ["smartwatch", "fitness", "tech"] },
  { id: 3,  name: "4K Ultra HD Action Camera", cat: "electronics", price: 4299, originalPrice: 6999, rating: 4.5, reviews: 567, icon: "fa-camera", badge: "NEW", inStock: true, isNew: true, isSale: false, description: "Capture every adventure in stunning 4K. Waterproof up to 30m, 170° wide angle, with image stabilization.", sizes: [], tags: ["camera", "4k", "waterproof"] },
  { id: 4,  name: "Mechanical Gaming Keyboard RGB", cat: "electronics", price: 1799, originalPrice: 2499, rating: 4.7, reviews: 2134, icon: "fa-keyboard", badge: "HOT", inStock: true, isNew: false, isSale: true, description: "Tactile mechanical switches, per-key RGB lighting, anti-ghosting, and aluminum body. Dominate every game.", sizes: [], tags: ["gaming", "keyboard", "rgb"] },
  { id: 5,  name: "Wireless Earbuds TWS Pro", cat: "electronics", price: 1299, originalPrice: 1999, rating: 4.4, reviews: 3421, icon: "fa-ear-listen", badge: "35% OFF", inStock: true, isNew: false, isSale: true, description: "True wireless stereo earbuds with 8mm drivers, 24hr total battery, IPX5 sweat resistance, and touch controls.", sizes: [], tags: ["earbuds", "wireless", "tws"] },
  { id: 6,  name: "Portable Bluetooth Speaker 360°", cat: "electronics", price: 1599, originalPrice: 2299, rating: 4.3, reviews: 876, icon: "fa-volume-high", badge: null, inStock: false, isNew: false, isSale: false, description: "360° surround sound, 20hr playback, IPX7 waterproof, and built-in LED light. Party anywhere.", sizes: [], tags: ["speaker", "bluetooth", "portable"] },

  // Fashion
  { id: 7,  name: "Premium Cotton Oversized Hoodie", cat: "fashion", price: 799, originalPrice: 1299, rating: 4.6, reviews: 4231, icon: "fa-shirt", badge: "38% OFF", inStock: true, isNew: false, isSale: true, description: "Ultra-soft 100% organic cotton hoodie. Oversized fit, kangaroo pocket, and unisex design. Perfect for all seasons.", sizes: ["XS","S","M","L","XL","XXL"], tags: ["hoodie", "cotton", "casual"] },
  { id: 8,  name: "Slim Fit Denim Jeans", cat: "fashion", price: 999, originalPrice: 1799, rating: 4.5, reviews: 2876, icon: "fa-person", badge: "NEW", inStock: true, isNew: true, isSale: false, description: "Premium stretch denim with slim fit. Classic 5-pocket design, sustainable fabric, available in 5 shades.", sizes: ["28","30","32","34","36","38"], tags: ["jeans", "denim", "slim"] },
  { id: 9,  name: "Floral Summer Dress", cat: "fashion", price: 699, originalPrice: 999, rating: 4.7, reviews: 1654, icon: "fa-vest", badge: "SALE", inStock: true, isNew: false, isSale: true, description: "Light, breezy floral midi dress. Wrap-style, adjustable fit, 100% rayon fabric. Perfect for beach or brunch.", sizes: ["XS","S","M","L","XL"], tags: ["dress", "floral", "summer"] },
  { id: 10, name: "Classic Leather Sneakers", cat: "fashion", price: 1999, originalPrice: 2999, rating: 4.8, reviews: 987, icon: "fa-shoe-prints", badge: "HOT", inStock: true, isNew: false, isSale: true, description: "Genuine leather upper, memory foam insole, and rubber outsole. Timeless design that goes with everything.", sizes: ["6","7","8","9","10","11"], tags: ["sneakers", "leather", "shoes"] },
  { id: 11, name: "Linen Blazer – Business Casual", cat: "fashion", price: 1499, originalPrice: 2299, rating: 4.4, reviews: 432, icon: "fa-user-tie", badge: "NEW", inStock: true, isNew: true, isSale: false, description: "Lightweight linen blazer. Single button closure, notch lapel, 2 flap pockets. Elevate any look.", sizes: ["S","M","L","XL","XXL"], tags: ["blazer", "linen", "formal"] },
  { id: 12, name: "Aviator Sunglasses UV400", cat: "fashion", price: 499, originalPrice: 799, rating: 4.3, reviews: 2187, icon: "fa-glasses", badge: "38% OFF", inStock: true, isNew: false, isSale: true, description: "Polarized UV400 protection lenses, stainless steel frame. Classic aviator style with spring hinges.", sizes: [], tags: ["sunglasses", "uv400", "polarized"] },

  // Home
  { id: 13, name: "Ergonomic Office Chair", cat: "home", price: 6999, originalPrice: 9999, rating: 4.8, reviews: 743, icon: "fa-couch", badge: "30% OFF", inStock: true, isNew: false, isSale: true, description: "Lumbar support, adjustable armrests, breathable mesh back, and 360° swivel. Work comfortably all day.", sizes: [], tags: ["chair", "ergonomic", "office"] },
  { id: 14, name: "Aromatherapy Diffuser – 500ml", cat: "home", price: 799, originalPrice: 1199, rating: 4.6, reviews: 1876, icon: "fa-wind", badge: "NEW", inStock: true, isNew: true, isSale: false, description: "Ultrasonic mist diffuser with 7 LED color modes, timer settings, and auto-shutoff. Covers 300 sq ft.", sizes: [], tags: ["diffuser", "aromatherapy", "wellness"] },
  { id: 15, name: "Bamboo Kitchen Utensil Set (6pc)", cat: "home", price: 399, originalPrice: 699, rating: 4.5, reviews: 3210, icon: "fa-utensils", badge: "SALE", inStock: true, isNew: false, isSale: true, description: "Eco-friendly bamboo cooking spoons, spatulas, and ladles. Non-scratch, heat-resistant, and dishwasher safe.", sizes: [], tags: ["kitchen", "bamboo", "utensils"] },
  { id: 16, name: "LED Desk Lamp with USB Charging", cat: "home", price: 1199, originalPrice: 1799, rating: 4.7, reviews: 654, icon: "fa-lightbulb", badge: null, inStock: true, isNew: false, isSale: false, description: "3 color modes, 5 brightness levels, flexible gooseneck, built-in USB-A and USB-C charging ports.", sizes: [], tags: ["lamp", "led", "desk"] },

  // Sports
  { id: 17, name: "Yoga Mat – 6mm Non-Slip", cat: "sports", price: 599, originalPrice: 899, rating: 4.8, reviews: 5421, icon: "fa-person-praying", badge: "33% OFF", inStock: true, isNew: false, isSale: true, description: "Extra-thick 6mm TPE yoga mat. Non-slip texture, moisture-resistant, alignment lines, carrying strap included.", sizes: [], tags: ["yoga", "mat", "fitness"] },
  { id: 18, name: "Adjustable Dumbbell Set 5–30kg", cat: "sports", price: 4999, originalPrice: 7999, rating: 4.6, reviews: 892, icon: "fa-dumbbell", badge: "HOT", inStock: true, isNew: false, isSale: true, description: "Space-saving adjustable dumbbells. Quick-dial weight selector, ergonomic grip, replaces 15 pairs.", sizes: [], tags: ["dumbbells", "gym", "strength"] },
  { id: 19, name: "Running Shoes – Ultralight Pro", cat: "sports", price: 2499, originalPrice: 3999, rating: 4.7, reviews: 1243, icon: "fa-person-running", badge: "NEW", inStock: true, isNew: true, isSale: false, description: "Breathable mesh upper, responsive foam midsole, rubber outsole. 300g ultralight for maximum speed.", sizes: ["6","7","8","9","10","11","12"], tags: ["running", "shoes", "ultralight"] },
  { id: 20, name: "Resistance Bands Set (5 levels)", cat: "sports", price: 349, originalPrice: 599, rating: 4.5, reviews: 4321, icon: "fa-circle-nodes", badge: "SALE", inStock: true, isNew: false, isSale: true, description: "5 resistance levels from 5 to 40 lbs. Natural latex, anti-snap guarantee, includes carry bag and guide.", sizes: [], tags: ["resistance", "bands", "workout"] },

  // Beauty
  { id: 21, name: "Vitamin C Face Serum 30ml", cat: "beauty", price: 499, originalPrice: 799, rating: 4.8, reviews: 8765, icon: "fa-flask", badge: "38% OFF", inStock: true, isNew: false, isSale: true, description: "20% Vitamin C + hyaluronic acid serum. Brightens, firms, and reduces dark spots. Dermatologist tested.", sizes: [], tags: ["serum", "vitamin-c", "skincare"] },
  { id: 22, name: "Rose Gold Makeup Brush Set 12pc", cat: "beauty", price: 699, originalPrice: 1099, rating: 4.6, reviews: 3241, icon: "fa-palette", badge: "NEW", inStock: true, isNew: true, isSale: false, description: "Professional synthetic brushes for foundation, contouring, blending, and eyes. Cruelty-free with holder.", sizes: [], tags: ["makeup", "brushes", "beauty"] },

  // Books
  { id: 23, name: "Atomic Habits – James Clear", cat: "books", price: 299, originalPrice: 499, rating: 4.9, reviews: 15432, icon: "fa-book-open", badge: "BESTSELLER", inStock: true, isNew: false, isSale: true, description: "The #1 bestselling self-improvement book. Discover tiny changes that create remarkable results and transform your habits.", sizes: [], tags: ["self-help", "habits", "productivity"] },
  { id: 24, name: "The Psychology of Money", cat: "books", price: 249, originalPrice: 399, rating: 4.8, reviews: 9876, icon: "fa-book", badge: "HOT", inStock: true, isNew: false, isSale: true, description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel. Essential reading for financial literacy.", sizes: [], tags: ["finance", "money", "psychology"] },
];

// Coupons
const COUPONS = {
  "SAVE10":   { discount: 10, type: "percent", label: "10% Off" },
  "FLAT100":  { discount: 100, type: "flat", label: "₹100 Off" },
  "FLASH50":  { discount: 50, type: "percent", label: "50% Off", cat: "electronics" },
  "WELCOME":  { discount: 15, type: "percent", label: "15% Welcome Offer" },
};

// Helper: get product by ID
function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

// Helper: get products by category
function getProductsByCategory(cat) {
  if (!cat || cat === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.cat === cat);
}
