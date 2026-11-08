/* ============================
   PRODUCT DATA v3.0 – Enterprise Grade
   48 Comprehensive Products across 6 Categories
   With Specs, Q&A, Reviews, EMI, Brands, & Currencies
   ============================ */

// ── Supported Currencies & Exchange Rates (Base: INR) ──
const CURRENCIES = {
  INR: { symbol: '₹', rate: 1, name: 'Indian Rupee' },
  USD: { symbol: '$', rate: 0.012, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.011, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.0095, name: 'British Pound' }
};

const PRODUCTS = [
  // ─────────────────────────────────────────
  // 1. ELECTRONICS (Products 1-8, 25, 26, 37, 38)
  // ─────────────────────────────────────────
  {
    id: 1, name: "Wireless Noise-Cancelling Headphones",
    cat: "electronics", brand: "SoundMax", price: 2999, originalPrice: 5999,
    rating: 4.8, reviews: 1243, icon: "fa-headphones",
    badge: "50% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Replacement Warranty", emiStarting: 249,
    description: "Premium wireless headphones with active noise cancellation, 30hr battery life, and crystal-clear sound. Built-in microphone with echo cancellation. Foldable design with carry case.",
    specs: { "Driver": "40mm Dynamic", "Frequency": "20Hz–20kHz", "Battery": "30 hours", "Charging": "USB-C Fast (2hrs)", "Weight": "250g", "Connectivity": "Bluetooth 5.2 + 3.5mm Aux" },
    tags: ["wireless", "audio", "noise-cancelling", "bluetooth"],
    reviewList: [
      { name: "Arjun P.", rating: 5, date: "2026-10-12", text: "Best headphones I've ever owned. The noise cancellation is incredible!" },
      { name: "Nisha R.", rating: 4, date: "2026-09-28", text: "Great sound quality but the headband could be slightly softer." }
    ],
    qaList: [
      { q: "Can I use these with a wire if battery dies?", a: "Yes, a 3.5mm audio cable is included in the box." },
      { q: "Is it compatible with iOS and Android?", a: "Yes, fully compatible with all Bluetooth-enabled devices." }
    ]
  },
  {
    id: 2, name: "Smart Watch Pro Series 5",
    cat: "electronics", brand: "TechWear", price: 3499, originalPrice: 4999,
    rating: 4.6, reviews: 892, icon: "fa-clock",
    badge: "SALE", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Manufacturer Warranty", emiStarting: 299,
    description: "Advanced smartwatch with health monitoring, GPS, 1.4\" AMOLED display, and 7-day battery life. SpO2, heart rate, sleep tracking, 100+ workout modes.",
    specs: { "Display": "1.4\" AMOLED (454x454)", "Battery": "7 days typical", "Water Resist": "5ATM (50m)", "GPS": "Dual-band Built-in", "OS": "Wear OS compatible", "Strap": "Interchangeable 22mm" },
    tags: ["smartwatch", "fitness", "tech", "health"],
    reviewList: [
      { name: "Vikash M.", rating: 5, date: "2026-10-05", text: "Tracks workouts accurately and battery easily lasts a full week." }
    ],
    qaList: [
      { q: "Can I receive WhatsApp calls on it?", a: "You get call and message notifications; Bluetooth calling is supported." }
    ]
  },
  {
    id: 3, name: "4K Ultra HD Action Camera",
    cat: "electronics", brand: "ActionPro", price: 4299, originalPrice: 6999,
    rating: 4.5, reviews: 567, icon: "fa-camera",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "2 Years Limited Warranty", emiStarting: 369,
    description: "Capture every adventure in stunning 4K@60fps. Waterproof up to 30m, 170° ultra-wide, EIS stabilization, and 2-inch touchscreen. Includes 2 batteries.",
    specs: { "Video": "4K@60fps / 1080p@120fps", "Photo": "20MP Sony Sensor", "Waterproof": "30m with case", "FOV": "170° Ultra-Wide", "Screen": "2\" Responsive Touch", "Storage": "microSD up to 256GB" },
    tags: ["camera", "4k", "waterproof", "action"],
    reviewList: [
      { name: "Rohan D.", rating: 5, date: "2026-09-15", text: "Perfect for motorcycle vlogging. Electronic stabilization is super smooth." }
    ],
    qaList: [
      { q: "Does it come with mounting accessories?", a: "Yes, includes helmet mounts, handlebar mounts, and waterproof case." }
    ]
  },
  {
    id: 4, name: "Mechanical Gaming Keyboard RGB",
    cat: "electronics", brand: "GameForce", price: 1799, originalPrice: 2499,
    rating: 4.7, reviews: 2134, icon: "fa-keyboard",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Warranty", emiStarting: 159,
    description: "Tactile mechanical switches (Red/Blue/Brown options), per-key RGB backlighting, N-key rollover, aluminum frame, detachable USB-C cable.",
    specs: { "Switch": "Outemu Mechanical (Red)", "Backlight": "Per-key 16.8M RGB", "Polling": "1000Hz (1ms)", "Keys": "104 Key Anti-Ghosting", "Frame": "Aircraft Aluminum", "Cable": "Braided Detachable USB-C" },
    tags: ["gaming", "keyboard", "rgb", "mechanical"],
    reviewList: [
      { name: "Kiran T.", rating: 5, date: "2026-10-20", text: "Clicky, tactile, great build. Software lets you program macros easily." }
    ],
    qaList: [
      { q: "Are the keycaps hot-swappable?", a: "Yes, switches and keycaps are easily hot-swappable." }
    ]
  },
  {
    id: 5, name: "True Wireless Earbuds Pro",
    cat: "electronics", brand: "AudioX", price: 1299, originalPrice: 1999,
    rating: 4.4, reviews: 3421, icon: "fa-ear-listen",
    badge: "35% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Replacement Warranty", emiStarting: 119,
    description: "True wireless earbuds with 8mm dynamic drivers, 24hr total battery (6hr per bud + case), IPX5 sweat resistance, and touch controls. Ambient mode.",
    specs: { "Driver": "8mm Composite Driver", "ANC": "Hybrid Active Noise Cancellation", "Battery": "6h + 18h Charging Case", "Water": "IPX5 Certified", "Latency": "< 50ms Gaming Mode", "Codec": "AAC, SBC" },
    tags: ["earbuds", "wireless", "tws", "waterproof"],
    reviewList: [],
    qaList: []
  },
  {
    id: 6, name: "Portable Bluetooth Speaker 360°",
    cat: "electronics", brand: "BoomBox", price: 1599, originalPrice: 2299,
    rating: 4.3, reviews: 876, icon: "fa-volume-high",
    badge: null, inStock: false, isNew: false, isSale: false,
    warranty: "1 Year Warranty", emiStarting: 140,
    description: "360° surround sound, 20hr playback at 70% volume, IPX7 fully waterproof, built-in LED light, and speakerphone mode. Pairs two speakers for stereo.",
    specs: { "Power": "20W RMS Dual Bass Radiators", "Battery": "4000mAh (20 hours)", "Waterproof": "IPX7 Submersible", "Bluetooth": "5.1 (15m range)", "Mic": "Built-in Noise-canceling", "Weight": "420g" },
    tags: ["speaker", "bluetooth", "portable", "waterproof"],
    reviewList: [],
    qaList: []
  },
  {
    id: 25, name: "27\" 4K Monitor IPS Panel",
    cat: "electronics", brand: "ViewMax", price: 18999, originalPrice: 27999,
    rating: 4.7, reviews: 432, icon: "fa-desktop",
    badge: "32% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "3 Years On-site Warranty", emiStarting: 1599,
    description: "27-inch 4K UHD IPS panel with 99% sRGB, 144Hz refresh rate, 1ms GTG, HDR400 support, USB-C 65W charging, and height-adjustable stand.",
    specs: { "Size": "27 Inch Flat", "Resolution": "3840×2160 (4K UHD)", "Panel": "IPS Anti-glare", "Refresh": "144Hz AMD FreeSync", "HDR": "VESA DisplayHDR 400", "Ports": "HDMI 2.1 x2, DP 1.4, USB-C 65W" },
    tags: ["monitor", "4k", "gaming", "ips"],
    reviewList: [],
    qaList: []
  },
  {
    id: 26, name: "Laptop Stand Adjustable Aluminium",
    cat: "electronics", brand: "DeskPro", price: 699, originalPrice: 999,
    rating: 4.6, reviews: 1876, icon: "fa-laptop",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "6 Months Warranty", emiStarting: 65,
    description: "Premium aluminium laptop stand with 6 height levels, 360° rotation, silicone pads, foldable design, and compatible with 11–17\" laptops.",
    specs: { "Material": "CNC Anodized Aluminium", "Height": "6 Adjustable Angles", "Rotation": "360° Swivel Base", "Compatible": "11–17\" Laptops & Tablets", "Load": "Supports up to 10kg", "Fold": "Ultra-slim Foldable" },
    tags: ["stand", "laptop", "ergonomic", "aluminium"],
    reviewList: [],
    qaList: []
  },
  {
    id: 37, name: "Wireless Ergonomic Vertical Mouse",
    cat: "electronics", brand: "DeskPro", price: 999, originalPrice: 1599,
    rating: 4.6, reviews: 654, icon: "fa-computer-mouse",
    badge: "37% OFF", inStock: true, isNew: true, isSale: true,
    warranty: "1 Year Warranty", emiStarting: 90,
    description: "Ergonomic vertical wireless mouse designed to reduce wrist strain and carpal tunnel syndrome. 3 adjustable DPI settings (800/1200/1600), silent clicks.",
    specs: { "DPI": "800 / 1200 / 1600", "Connectivity": "2.4GHz Wireless USB", "Buttons": "6 Buttons + Scroll", "Battery": "Rechargeable 500mAh", "Angle": "57° Natural Posture", "Weight": "110g" },
    tags: ["mouse", "ergonomic", "wireless", "office"],
    reviewList: [],
    qaList: []
  },
  {
    id: 38, name: "Fast Wireless Charger 3-in-1 Dock",
    cat: "electronics", brand: "PowerLift", price: 1899, originalPrice: 2999,
    rating: 4.7, reviews: 932, icon: "fa-bolt",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Warranty", emiStarting: 165,
    description: "All-in-one magnetic fast wireless charging station for Smartphone (15W), Smartwatch (5W), and Earbuds (5W). Sleek foldable bedside design.",
    specs: { "Total Output": "25W Max", "Phone Pad": "15W Fast Qi", "Watch Pad": "5W Magnetic", "Earbuds Pad": "5W Qi", "Protection": "Overheat & Foreign Object", "Cable": "Includes USB-C to C + 30W Adapter" },
    tags: ["charger", "wireless", "dock", "fast-charging"],
    reviewList: [],
    qaList: []
  },

  // ─────────────────────────────────────────
  // 2. FASHION (Products 7-12, 27, 39, 40)
  // ─────────────────────────────────────────
  {
    id: 7, name: "Premium Cotton Oversized Hoodie",
    cat: "fashion", brand: "UrbanWear", price: 799, originalPrice: 1299,
    rating: 4.6, reviews: 4231, icon: "fa-shirt",
    badge: "38% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "30 Days Easy Return", emiStarting: 75,
    description: "Ultra-soft 100% organic cotton hoodie. Oversized fit, kangaroo pocket, ribbed cuffs and hem, unisex design. Available in 8 colors. Pre-shrunk fabric.",
    specs: { "Material": "100% Organic Cotton (380 GSM)", "Fit": "Relaxed Oversized", "Pocket": "Deep Front Kangaroo", "Care": "Machine wash cold", "Gender": "Unisex" },
    sizes: ["XS","S","M","L","XL","XXL"],
    tags: ["hoodie", "cotton", "casual", "oversized"],
    reviewList: [
      { name: "Sneha J.", rating: 5, date: "2026-10-18", text: "So soft and cozy! Best quality oversized hoodie at this price point." }
    ],
    qaList: []
  },
  {
    id: 8, name: "Slim Fit Stretch Denim Jeans",
    cat: "fashion", brand: "DenimCo", price: 999, originalPrice: 1799,
    rating: 4.5, reviews: 2876, icon: "fa-person",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "30 Days Easy Return", emiStarting: 90,
    description: "Premium stretch denim with slim fit. 2% elastane for comfort, classic 5-pocket design, sustainable indigo dye, available in 5 shades. Mid-rise waist.",
    specs: { "Material": "98% Cotton, 2% Elastane", "Fit": "Slim Fit Tapered", "Rise": "Mid Rise", "Pockets": "Classic 5 Pockets", "Closure": "YKK Brass Zip Fly" },
    sizes: ["28","30","32","34","36","38"],
    tags: ["jeans", "denim", "slim", "stretch"],
    reviewList: [],
    qaList: []
  },
  {
    id: 9, name: "Floral Summer Midi Dress",
    cat: "fashion", brand: "BloomStyle", price: 699, originalPrice: 999,
    rating: 4.7, reviews: 1654, icon: "fa-vest",
    badge: "SALE", inStock: true, isNew: false, isSale: true,
    warranty: "30 Days Easy Return", emiStarting: 65,
    description: "Light, breezy floral midi dress. Wrap-style with V-neckline, adjustable tie waist, 100% rayon fabric. Knee-length hem. Perfect for beach, brunch, or dates.",
    specs: { "Material": "100% Viscose Rayon", "Style": "A-Line Wrap Midi", "Length": "44 Inches", "Neck": "Surplice V-Neck", "Lining": "Full Cotton Lining" },
    sizes: ["XS","S","M","L","XL"],
    tags: ["dress", "floral", "summer", "midi"],
    reviewList: [],
    qaList: []
  },
  {
    id: 10, name: "Classic Leather Sneakers White",
    cat: "fashion", brand: "SoleKing", price: 1999, originalPrice: 2999,
    rating: 4.8, reviews: 987, icon: "fa-shoe-prints",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "6 Months Sole Warranty", emiStarting: 175,
    description: "Genuine full-grain leather upper, memory foam insole, vulcanized rubber outsole. Timeless white design that pairs with anything. Imported.",
    specs: { "Upper": "Full-grain Nappa Leather", "Insole": "OrthoLite Memory Foam", "Outsole": "Anti-skid Vulcanized Rubber", "Lining": "Breathable Mesh", "Color": "Crisp White" },
    sizes: ["6","7","8","9","10","11","12"],
    tags: ["sneakers", "leather", "shoes", "white"],
    reviewList: [],
    qaList: []
  },
  {
    id: 11, name: "Linen Blazer – Business Casual",
    cat: "fashion", brand: "EliteWear", price: 1499, originalPrice: 2299,
    rating: 4.4, reviews: 432, icon: "fa-user-tie",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "30 Days Easy Return", emiStarting: 135,
    description: "Lightweight linen-blend blazer. Single button closure, notch lapel, 2 flap pockets, breathable fabric perfect for summers. Slim fit.",
    specs: { "Material": "55% French Linen, 45% Cotton", "Fit": "Tailored Slim Fit", "Lapel": "Notch Lapel 2.5\"", "Pockets": "2 Exterior, 1 Interior Wallet", "Lining": "Unstructured Half Lining" },
    sizes: ["S","M","L","XL","XXL"],
    tags: ["blazer", "linen", "formal", "business"],
    reviewList: [],
    qaList: []
  },
  {
    id: 12, name: "Polarized Aviator Sunglasses UV400",
    cat: "fashion", brand: "VisionElite", price: 499, originalPrice: 799,
    rating: 4.3, reviews: 2187, icon: "fa-glasses",
    badge: "38% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Frame Warranty", emiStarting: 45,
    description: "TAC polarized UV400 lenses eliminate glare. Stainless steel frame with spring hinges. Classic gold + green tint. Includes case and cleaning cloth.",
    specs: { "Lens": "9-layer Polarized TAC", "Protection": "100% UV400 (UVA & UVB)", "Frame": "Surgical Stainless Steel", "Bridge": "14mm Double Bridge", "Temple": "140mm with Spring Hinges" },
    tags: ["sunglasses", "uv400", "polarized", "aviator"],
    reviewList: [],
    qaList: []
  },
  {
    id: 27, name: "Canvas Tote Bag – Eco Friendly",
    cat: "fashion", brand: "EcoCarry", price: 349, originalPrice: 499,
    rating: 4.5, reviews: 3210, icon: "fa-bag-shopping",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "30 Days Return", emiStarting: 35,
    description: "Heavy-duty 12oz natural canvas tote. Reinforced stitching, interior zip pocket, magnetic snap closure, vegan leather handles. 15L capacity.",
    specs: { "Material": "12oz Organic Cotton Canvas", "Capacity": "16 Liters", "Handles": "Vegan Leather Reinforced", "Closure": "Strong Magnetic Button", "Pockets": "1 Main + 1 Zip Key Pocket" },
    tags: ["tote", "canvas", "eco", "bag"],
    reviewList: [],
    qaList: []
  },
  {
    id: 39, name: "Minimalist Leather Bifold Wallet",
    cat: "fashion", brand: "EliteWear", price: 599, originalPrice: 999,
    rating: 4.7, reviews: 1420, icon: "fa-wallet",
    badge: "40% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Leather Warranty", emiStarting: 55,
    description: "Slim genuine leather wallet with RFID blocking technology. Holds up to 8 cards plus cash. Ultra-thin 0.4-inch profile fits comfortably in front pockets.",
    specs: { "Material": "Top Grain Cowhide Leather", "RFID": "13.56 MHz RFID Shielding", "Slots": "6 Card Slots + 2 Slip Pockets + Cash Slot", "Dimensions": "4.3\" x 3.2\" x 0.4\"", "Weight": "65g" },
    tags: ["wallet", "leather", "rfid", "accessories"],
    reviewList: [],
    qaList: []
  },
  {
    id: 40, name: "Waterproof Travel Duffle Bag 45L",
    cat: "fashion", brand: "EcoCarry", price: 1299, originalPrice: 1999,
    rating: 4.6, reviews: 890, icon: "fa-suitcase-rolling",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "1 Year Warranty", emiStarting: 115,
    description: "Rugged 45L waterproof weekender bag with separate ventilated shoe compartment, padded shoulder strap, and trolley sleeve for luggage attachment.",
    specs: { "Capacity": "45 Liters", "Material": "Waterproof 900D Oxford Polyester", "Shoe Pocket": "Dedicated Ventilated Compartment", "Carry": "Dual Handles + Detachable Padded Strap", "Weight": "780g" },
    tags: ["duffle", "travel", "gym", "waterproof"],
    reviewList: [],
    qaList: []
  },

  // ─────────────────────────────────────────
  // 3. HOME & LIVING (Products 13-16, 28, 29, 41, 42)
  // ─────────────────────────────────────────
  {
    id: 13, name: "Ergonomic Office Chair Mesh",
    cat: "home", brand: "ComfortSeat", price: 6999, originalPrice: 9999,
    rating: 4.8, reviews: 743, icon: "fa-couch",
    badge: "30% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "3 Years Structural Warranty", emiStarting: 620,
    description: "Lumbar support cushion, adjustable armrests & headrest, breathable mesh backrest, 360° swivel, tilt mechanism. Supports up to 130kg.",
    specs: { "Weight Cap.": "130kg Tested", "Adjustment": "Height, Armrests, Headrest, Tilt Lock", "Back": "High-elastic Breathable Mesh", "Base": "Heavy-duty Nylon Base", "Castors": "Silent PU Smooth Gliders" },
    tags: ["chair", "ergonomic", "office", "mesh"],
    reviewList: [
      { name: "Deepak R.", rating: 5, date: "2026-10-14", text: "My chronic back pain has significantly reduced since using this chair!" }
    ],
    qaList: []
  },
  {
    id: 14, name: "Ultrasonic Aroma Diffuser 500ml",
    cat: "home", brand: "ZenHome", price: 799, originalPrice: 1199,
    rating: 4.6, reviews: 1876, icon: "fa-wind",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "1 Year Warranty", emiStarting: 75,
    description: "500ml ultrasonic mist diffuser with 7-color LED modes, 1h/3h/6h timer, whisper-quiet, auto-shutoff when empty. Covers 300 sq ft.",
    specs: { "Capacity": "500ml Water Tank", "LED": "7 Soothing Colors (Dim/Bright)", "Timer": "1h / 3h / 6h / Continuous", "Coverage": "Up to 350 sq ft", "Noise": "< 23dB Whisper Quiet", "Auto-off": "Waterless Automatic Safety" },
    tags: ["diffuser", "aromatherapy", "wellness", "humidifier"],
    reviewList: [],
    qaList: []
  },
  {
    id: 15, name: "Bamboo Kitchen Utensil Set (6pc)",
    cat: "home", brand: "EcoKitchen", price: 399, originalPrice: 699,
    rating: 4.5, reviews: 3210, icon: "fa-utensils",
    badge: "SALE", inStock: true, isNew: false, isSale: true,
    warranty: "6 Months Quality Guarantee", emiStarting: 38,
    description: "Eco-friendly bamboo cooking set: 2 spoons, spatula, ladle, slotted spatula, and tongs. Non-scratch, heat-resistant up to 200°C. Dishwasher safe.",
    specs: { "Material": "100% Organic Moso Bamboo", "Pieces": "6 Assorted Cooking Tools", "Heat Resist.": "Safe up to 220°C", "Cookware": "Safe for Non-stick Cookware", "Finish": "Food-grade Mineral Oil" },
    tags: ["kitchen", "bamboo", "utensils", "eco"],
    reviewList: [],
    qaList: []
  },
  {
    id: 16, name: "LED Desk Lamp with Wireless Charging",
    cat: "home", brand: "LumiDesk", price: 1199, originalPrice: 1799,
    rating: 4.7, reviews: 654, icon: "fa-lightbulb",
    badge: null, inStock: true, isNew: false, isSale: false,
    warranty: "1 Year Warranty", emiStarting: 105,
    description: "3 color temperatures, 5 brightness levels, flexible gooseneck, built-in 10W wireless charging pad, USB-A and USB-C ports. Touch controls.",
    specs: { "Brightness": "600 Lumens Eye-caring", "Color Temp.": "3000K to 6500K Stepless", "Charging": "10W Qi Wireless Pad + USB 5V/2A", "Arm": "360° Flexible Silicone", "Lifespan": "50,000 Hours LED" },
    tags: ["lamp", "led", "desk", "wireless-charging"],
    reviewList: [],
    qaList: []
  },
  {
    id: 28, name: "Coffee Maker – Drip Brew 12 Cup",
    cat: "home", brand: "BrewMaster", price: 2499, originalPrice: 3499,
    rating: 4.6, reviews: 876, icon: "fa-mug-hot",
    badge: "28% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "2 Years Warranty", emiStarting: 220,
    description: "Programmable 12-cup drip coffee maker with built-in grinder, keep-warm plate, brew-strength selector (mild/medium/strong), and self-cleaning mode.",
    specs: { "Capacity": "1.5L Borosilicate Glass Carafe (12 Cups)", "Grinder": "Stainless Steel Conical Burr", "Brew Time": "Fast 6-8 mins", "Keep Warm": "2 Hours Non-stick Hotplate", "Power": "900W" },
    tags: ["coffee", "maker", "kitchen", "drip"],
    reviewList: [],
    qaList: []
  },
  {
    id: 29, name: "Memory Foam Pillow Cervical Support",
    cat: "home", brand: "SleepWell", price: 899, originalPrice: 1499,
    rating: 4.8, reviews: 2145, icon: "fa-bed",
    badge: "40% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "5 Years Shape Retention Guarantee", emiStarting: 80,
    description: "Ergonomic cervical memory foam pillow. Relieves neck & shoulder pain. Dual-height design, breathable bamboo cover, temperature-neutral foam.",
    specs: { "Core": "High-density Slow Rebound Foam", "Cover": "Washable Organic Bamboo Fiber", "Dimensions": "60cm x 38cm x 12/10cm Contour", "Certifications": "OEKO-TEX & CertiPUR-US" },
    tags: ["pillow", "memory-foam", "sleep", "ergonomic"],
    reviewList: [],
    qaList: []
  },
  {
    id: 41, name: "Stainless Steel Insulated Water Bottle 1L",
    cat: "home", brand: "EcoKitchen", price: 549, originalPrice: 899,
    rating: 4.8, reviews: 1540, icon: "fa-bottle-water",
    badge: "39% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Leakproof Warranty", emiStarting: 50,
    description: "Double-wall vacuum insulated stainless steel flask. Keeps beverages ice-cold for 24 hours or piping hot for 12 hours. Sweat-free powder coat.",
    specs: { "Capacity": "1000ml (34oz)", "Insulation": "Double-wall Vacuum", "Material": "18/8 Pro-grade Stainless Steel", "Temp Retention": "24h Cold / 12h Hot", "BPA Free": "100% Non-toxic" },
    tags: ["bottle", "flask", "insulated", "kitchen"],
    reviewList: [],
    qaList: []
  },
  {
    id: 42, name: "Smart Air Purifier HEPA H13 Filter",
    cat: "home", brand: "ZenHome", price: 4499, originalPrice: 6999,
    rating: 4.7, reviews: 620, icon: "fa-fan",
    badge: "HOT", inStock: true, isNew: true, isSale: true,
    warranty: "2 Years Comprehensive Warranty", emiStarting: 395,
    description: "True HEPA H13 filtration capturing 99.97% of airborne pollutants, PM2.5 particles, dust, pollen, and pet dander. Real-time air quality indicator ring.",
    specs: { "CADR": "250 m³/h", "Room Size": "Up to 350 sq ft", "Filter Type": "Pre-filter + H13 True HEPA + Activated Carbon", "Noise": "24dB Sleep Mode", "Sensor": "Laser PM2.5 Air Sensor" },
    tags: ["air-purifier", "hepa", "smart-home", "clean-air"],
    reviewList: [],
    qaList: []
  },

  // ─────────────────────────────────────────
  // 4. SPORTS & FITNESS (Products 17-20, 30, 43, 44)
  // ─────────────────────────────────────────
  {
    id: 17, name: "Yoga Mat Extra-Thick 6mm Non-Slip",
    cat: "sports", brand: "FlexFit", price: 599, originalPrice: 899,
    rating: 4.8, reviews: 5421, icon: "fa-person-praying",
    badge: "33% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Tear-proof Warranty", emiStarting: 55,
    description: "Extra-thick 6mm TPE yoga mat with double-layer non-slip texture, moisture-resistant surface, alignment guide lines, carrying strap included. 183×61cm.",
    specs: { "Material": "Eco-friendly TPE (No PVC/Latex)", "Thickness": "6mm Cushioning", "Dimensions": "183cm x 61cm", "Weight": "920g", "Alignment": "Laser-etched Alignment Guides" },
    tags: ["yoga", "mat", "fitness", "non-slip"],
    reviewList: [
      { name: "Aishwarya P.", rating: 5, date: "2026-10-10", text: "Best yoga mat I've used. Doesn't slip on tiles even during intense power yoga sessions." }
    ],
    qaList: []
  },
  {
    id: 18, name: "Adjustable Dumbbell Set 5–32kg",
    cat: "sports", brand: "PowerLift", price: 4999, originalPrice: 7999,
    rating: 4.6, reviews: 892, icon: "fa-dumbbell",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "2 Years Mechanism Warranty", emiStarting: 440,
    description: "Space-saving adjustable dumbbells. Dial weight selector adjusts in 2.5kg increments (5–32kg each), ergonomic rubberized grip. Replaces 15 pairs.",
    specs: { "Weight Range": "5kg to 32kg per dumbbell", "Increments": "2.5kg increments", "Plates": "Laser-cut Cast Iron with Polyethylene Coating", "Tray": "Included Heavy Duty Storage Tray" },
    tags: ["dumbbells", "gym", "strength", "adjustable"],
    reviewList: [],
    qaList: []
  },
  {
    id: 19, name: "Ultralight Running Shoes Air Tech",
    cat: "sports", brand: "RunFast", price: 2499, originalPrice: 3999,
    rating: 4.7, reviews: 1243, icon: "fa-person-running",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "6 Months Sole Warranty", emiStarting: 220,
    description: "Breathable engineered mesh upper, responsive EVA foam midsole, carbon rubber outsole for grip. 295g ultralight. Reflective strips for visibility.",
    specs: { "Upper": "High-density Engineered Jacquard Mesh", "Midsole": "Energy-return SuperFoam", "Drop": "8mm Heel-to-toe drop", "Weight": "295 grams (UK 8)", "Grip": "All-weather Carbon Rubber" },
    sizes: ["6","7","8","9","10","11","12"],
    tags: ["running", "shoes", "ultralight", "breathable"],
    reviewList: [],
    qaList: []
  },
  {
    id: 20, name: "Resistance Bands Set – 5 Levels",
    cat: "sports", brand: "BandStrong", price: 349, originalPrice: 599,
    rating: 4.5, reviews: 4321, icon: "fa-circle-nodes",
    badge: "SALE", inStock: true, isNew: false, isSale: true,
    warranty: "1 Year Snap-proof Warranty", emiStarting: 35,
    description: "5 resistance levels: 5, 10, 20, 30, 40 lbs. Natural latex, anti-snap guarantee, textured non-slip grip, includes carry bag and workout guide PDF.",
    specs: { "Levels": "X-Light (5lb), Light (10lb), Med (20lb), Heavy (30lb), X-Heavy (40lb)", "Material": "100% Natural Malaysian Latex", "Circumference": "600mm x 50mm width", "Accessories": "Waterproof Pouch + Exercise Poster" },
    tags: ["resistance", "bands", "workout", "latex"],
    reviewList: [],
    qaList: []
  },
  {
    id: 30, name: "Jump Rope Speed Cable – Bearing",
    cat: "sports", brand: "SpeedPro", price: 299, originalPrice: 499,
    rating: 4.5, reviews: 2187, icon: "fa-circle",
    badge: "40% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "6 Months Warranty", emiStarting: 30,
    description: "Precision ball bearing speed rope. Adjustable 9-foot steel cable with PVC coating, ergonomic foam grips, perfect for HIIT and boxing training.",
    specs: { "Cable": "Braided Steel with Thickened PVC (3mm)", "Length": "10 Feet / 3m (Fully Adjustable)", "Bearings": "360° Dual High-speed Ball Bearings", "Handles": "Anti-slip Memory Foam Grips" },
    tags: ["jump-rope", "speed", "cardio", "hiit"],
    reviewList: [],
    qaList: []
  },
  {
    id: 43, name: "Deep Tissue Muscle Massage Gun",
    cat: "sports", brand: "SpeedPro", price: 1999, originalPrice: 3499,
    rating: 4.8, reviews: 765, icon: "fa-hand-fist",
    badge: "43% OFF", inStock: true, isNew: true, isSale: true,
    warranty: "1 Year Replacement Warranty", emiStarting: 175,
    description: "Percussion massage gun with 30 speed levels, 6 interchangeable massage heads, and ultra-quiet brushless motor. Relieves sore muscles and speeds recovery.",
    specs: { "Speeds": "30 Adjustable Intensity Levels", "Stroke Amplitude": "12mm Deep Tissue", "Battery": "2600mAh (6 hours continuous)", "Heads": "6 Interchangeable Attachments", "Noise": "< 40dB Quiet Glide" },
    tags: ["massage-gun", "recovery", "fitness", "therapy"],
    reviewList: [],
    qaList: []
  },
  {
    id: 44, name: "Gym Shaker Bottle with Storage 700ml",
    cat: "sports", brand: "FlexFit", price: 299, originalPrice: 499,
    rating: 4.6, reviews: 1890, icon: "fa-blender",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "Leakproof Guarantee", emiStarting: 30,
    description: "BPA-free protein shaker bottle with whisk ball, pill tray, and 2 attachable storage jars for protein powder and supplements. 100% leakproof lid.",
    specs: { "Capacity": "700ml / 24oz", "Material": "BPA-Free Eastman Tritan Plastic", "Storage": "150ml Powder Jar + 100ml Snack Jar + Pill Organizer", "Mixing": "Stainless Steel Blender Wire Ball" },
    tags: ["shaker", "protein", "bottle", "gym"],
    reviewList: [],
    qaList: []
  },

  // ─────────────────────────────────────────
  // 5. BEAUTY & CARE (Products 21, 22, 31, 32, 45, 46)
  // ─────────────────────────────────────────
  {
    id: 21, name: "Vitamin C Brightening Serum 30ml",
    cat: "beauty", brand: "GlowLab", price: 499, originalPrice: 799,
    rating: 4.8, reviews: 8765, icon: "fa-flask",
    badge: "38% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "Dermatologically Tested", emiStarting: 45,
    description: "20% stabilized Vitamin C + 2% Niacinamide + Hyaluronic Acid. Brightens skin, reduces dark spots, firms, and hydrates. Dermatologist tested, fragrance-free.",
    specs: { "Active Ingredients": "20% Ethyl Ascorbic Acid + 2% Niacinamide + 1% Hyaluronic Acid", "Volume": "30ml UV-protected Glass Dropper", "Skin Type": "Safe for All Skin Types", "Formulation": "Paraben-free, Cruelty-free, Vegan" },
    tags: ["serum", "vitamin-c", "skincare", "brightening"],
    reviewList: [
      { name: "Meera K.", rating: 5, date: "2026-10-02", text: "Used consistently for 4 weeks – dark spots faded visibly!" }
    ],
    qaList: []
  },
  {
    id: 22, name: "Rose Gold Makeup Brush Set 12pc",
    cat: "beauty", brand: "GlamKit", price: 699, originalPrice: 1099,
    rating: 4.6, reviews: 3241, icon: "fa-palette",
    badge: "NEW", inStock: true, isNew: true, isSale: false,
    warranty: "100% Cruelty-Free", emiStarting: 65,
    description: "Professional 12-piece synthetic hair brush set: foundation, powder, contour, blush, highlight, eyeshadow x4, liner, brow, blending. Cruelty-free with stand holder.",
    specs: { "Bristles": "High-density Synthetic Taklon Fibers", "Handles": "Electroplated Rose Gold Aluminium", "Brush Count": "12 Essential Makeup Brushes", "Case": "Cylindrical Standing Storage Cup" },
    tags: ["makeup", "brushes", "beauty", "vegan"],
    reviewList: [],
    qaList: []
  },
  {
    id: 31, name: "Face Wash Gel – Salicylic Acid 2%",
    cat: "beauty", brand: "ClearSkin", price: 249, originalPrice: 349,
    rating: 4.6, reviews: 5432, icon: "fa-droplet",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "Dermatologist Approved", emiStarting: 25,
    description: "2% salicylic acid face wash gel for acne-prone skin. Deep cleanses pores, controls oil, gentle enough for daily use. Paraben-free, sulfate-free, dermatologically tested.",
    specs: { "Active": "2% Encapsulated Salicylic Acid + Zinc PCA", "Volume": "150ml Pump Bottle", "pH": "Balanced at 5.5", "Fragrance": "No Artificial Fragrance" },
    tags: ["face-wash", "salicylic", "acne", "gel"],
    reviewList: [],
    qaList: []
  },
  {
    id: 32, name: "Retinol Night Cream Anti-Aging 50ml",
    cat: "beauty", brand: "AgeLess", price: 799, originalPrice: 1299,
    rating: 4.7, reviews: 2176, icon: "fa-moon",
    badge: "38% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "Clinical Grade Skincare", emiStarting: 75,
    description: "0.5% encapsulated retinol with peptides and squalane. Reduces fine lines and wrinkles visibly in 4 weeks. Rich moisturizing texture, suitable for sensitive skin.",
    specs: { "Active": "0.5% Micro-encapsulated Retinol + Matrixyl 3000", "Base": "Olive-derived Squalane & Ceramide Complex", "Volume": "50ml Airless Pump Jar", "Usage": "Nightly Application" },
    tags: ["retinol", "anti-aging", "night-cream", "skincare"],
    reviewList: [],
    qaList: []
  },
  {
    id: 45, name: "Hydrating Hyaluronic Acid Sunscreen SPF 50+",
    cat: "beauty", brand: "GlowLab", price: 399, originalPrice: 599,
    rating: 4.9, reviews: 4120, icon: "fa-sun",
    badge: "BESTSELLER", inStock: true, isNew: true, isSale: true,
    warranty: "Broad Spectrum UVA/UVB", emiStarting: 40,
    description: "Ultra-lightweight gel sunscreen with SPF 50+ PA++++. Absorbs in seconds with zero white cast, infused with Hyaluronic Acid for all-day deep hydration.",
    specs: { "SPF Rating": "SPF 50+ PA++++ Broad Spectrum", "Filters": "New-age Hybrid UV Filters", "Finish": "Dewy Non-greasy Zero White Cast", "Volume": "50g Tube" },
    tags: ["sunscreen", "spf50", "hyaluronic", "skincare"],
    reviewList: [],
    qaList: []
  },
  {
    id: 46, name: "Ionic Hair Dryer with Diffuser 1800W",
    cat: "beauty", brand: "GlamKit", price: 1499, originalPrice: 2499,
    rating: 4.7, reviews: 940, icon: "fa-wind",
    badge: "40% OFF", inStock: true, isNew: false, isSale: true,
    warranty: "2 Years Motor Warranty", emiStarting: 135,
    description: "Fast-drying 1800W salon-grade hairdryer emitting 20 million negative ions to eliminate frizz and seal moisture. 3 heat & 2 speed settings with Cool Shot.",
    specs: { "Power": "1800W Fast AC Motor", "Technology": "Negative Ion Anti-frizz Generator", "Settings": "3 Heat / 2 Speed + Cold Air Button", "Attachments": "Styling Concentrator Nozzle + Curl Diffuser" },
    tags: ["hair-dryer", "ionic", "styling", "beauty"],
    reviewList: [],
    qaList: []
  },

  // ─────────────────────────────────────────
  // 6. BOOKS & READS (Products 23, 24, 33-36, 47, 48)
  // ─────────────────────────────────────────
  {
    id: 23, name: "Atomic Habits – James Clear",
    cat: "books", brand: "Random House", price: 299, originalPrice: 499,
    rating: 4.9, reviews: 15432, icon: "fa-book-open",
    badge: "BESTSELLER", inStock: true, isNew: false, isSale: true,
    warranty: "Original Publisher Print", emiStarting: 30,
    description: "The #1 bestselling guide to building good habits and breaking bad ones. James Clear shares proven strategies for making small changes that lead to remarkable results.",
    specs: { "Author": "James Clear", "Pages": "320 Pages", "Publisher": "Random House Business", "Format": "Paperback with Embossed Foil", "Language": "English", "ISBN": "978-1847941831" },
    tags: ["self-help", "habits", "productivity", "bestseller"],
    reviewList: [
      { name: "Kartik P.", rating: 5, date: "2026-10-08", text: "Life-changing book. The concept of compounding 1% improvements really sticks." }
    ],
    qaList: []
  },
  {
    id: 24, name: "The Psychology of Money – Morgan Housel",
    cat: "books", brand: "Harriman House", price: 249, originalPrice: 399,
    rating: 4.8, reviews: 9876, icon: "fa-book",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "Original Publisher Print", emiStarting: 25,
    description: "Timeless lessons on wealth, greed, and happiness. Morgan Housel explains why smart people do foolish things with money. Essential reading for financial literacy.",
    specs: { "Author": "Morgan Housel", "Pages": "256 Pages", "Publisher": "Harriman House", "Format": "Paperback", "Language": "English", "ISBN": "978-0857197689" },
    tags: ["finance", "money", "psychology", "investing"],
    reviewList: [],
    qaList: []
  },
  {
    id: 33, name: "Deep Work – Cal Newport",
    cat: "books", brand: "Piatkus", price: 279, originalPrice: 449,
    rating: 4.8, reviews: 7654, icon: "fa-brain",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "Original Publisher Print", emiStarting: 28,
    description: "Rules for focused success in a distracted world. Cal Newport argues that deep work is becoming increasingly valuable and shows how to cultivate this rare skill.",
    specs: { "Author": "Cal Newport", "Pages": "296 Pages", "Publisher": "Piatkus", "Language": "English", "Format": "Paperback", "ISBN": "978-0349411903" },
    tags: ["productivity", "focus", "work", "self-help"],
    reviewList: [],
    qaList: []
  },
  {
    id: 34, name: "Sapiens: A Brief History of Humankind",
    cat: "books", brand: "Harper", price: 349, originalPrice: 599,
    rating: 4.9, reviews: 21345, icon: "fa-earth-americas",
    badge: "BESTSELLER", inStock: true, isNew: false, isSale: true,
    warranty: "Original Publisher Print", emiStarting: 35,
    description: "Yuval Noah Harari's landmark narrative of humanity's creation and evolution. Explores how biology and history defined us and enhanced our understanding of what it means to be 'human'.",
    specs: { "Author": "Yuval Noah Harari", "Pages": "443 Pages", "Publisher": "HarperCollins", "Language": "English", "Format": "Paperback Illustrated", "ISBN": "978-0099590088" },
    tags: ["history", "anthropology", "science", "bestseller"],
    reviewList: [],
    qaList: []
  },
  {
    id: 35, name: "Zero to One – Peter Thiel",
    cat: "books", brand: "Crown Business", price: 299, originalPrice: 499,
    rating: 4.7, reviews: 8765, icon: "fa-rocket",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "Original Publisher Print", emiStarting: 30,
    description: "Notes on startups, or how to build the future. Peter Thiel argues that every moment in business happens only once and encourages entrepreneurs to create truly new things.",
    specs: { "Author": "Peter Thiel with Blake Masters", "Pages": "224 Pages", "Publisher": "Crown Business", "Language": "English", "Format": "Hardcover", "ISBN": "978-0804139298" },
    tags: ["startup", "entrepreneurship", "tech", "business"],
    reviewList: [],
    qaList: []
  },
  {
    id: 36, name: "Rich Dad Poor Dad – Robert Kiyosaki",
    cat: "books", brand: "Warner Books", price: 199, originalPrice: 299,
    rating: 4.7, reviews: 18765, icon: "fa-money-bill-trend-up",
    badge: "BESTSELLER", inStock: true, isNew: false, isSale: true,
    warranty: "Original Publisher Print", emiStarting: 20,
    description: "What the rich teach their kids about money that the poor and middle class do not! A personal finance classic that has changed the way millions of people think about money.",
    specs: { "Author": "Robert T. Kiyosaki", "Pages": "336 Pages", "Publisher": "Plata Publishing", "Language": "English", "Format": "Paperback", "ISBN": "978-1612680194" },
    tags: ["finance", "money", "investment", "bestseller"],
    reviewList: [],
    qaList: []
  },
  {
    id: 47, name: "Thinking, Fast and Slow – Daniel Kahneman",
    cat: "books", brand: "Farrar, Straus and Giroux", price: 349, originalPrice: 599,
    rating: 4.8, reviews: 11200, icon: "fa-lightbulb",
    badge: "HOT", inStock: true, isNew: false, isSale: true,
    warranty: "Original Publisher Print", emiStarting: 35,
    description: "Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind, explaining the two systems that drive the way we think: fast intuitive thinking, and slow deliberate thinking.",
    specs: { "Author": "Daniel Kahneman", "Pages": "512 Pages", "Publisher": "Penguin Books", "Language": "English", "Format": "Paperback", "ISBN": "978-0141033570" },
    tags: ["psychology", "behavioral-economics", "science", "mind"],
    reviewList: [],
    qaList: []
  },
  {
    id: 48, name: "The Alchemist – Paulo Coelho",
    cat: "books", brand: "HarperOne", price: 179, originalPrice: 299,
    rating: 4.9, reviews: 24500, icon: "fa-feather",
    badge: "BESTSELLER", inStock: true, isNew: false, isSale: true,
    warranty: "Original Publisher Print", emiStarting: 18,
    description: "A magical story about following your dreams and listening to your heart. Santiago's journey teaches us the essential wisdom of listening to the omens strewn along life's path.",
    specs: { "Author": "Paulo Coelho", "Pages": "208 Pages", "Publisher": "HarperOne", "Language": "English", "Format": "Paperback Collector's Edition", "ISBN": "978-0062315007" },
    tags: ["fiction", "philosophy", "classic", "bestseller"],
    reviewList: [],
    qaList: []
  }
];

// ── EXPANDED COUPON CODES ──
const COUPONS = {
  "SAVE10":    { discount: 10,  type: "percent", label: "10% Off All Products",       minOrder: 0 },
  "FLAT100":   { discount: 100, type: "flat",    label: "₹100 Flat Off",              minOrder: 500 },
  "FLAT200":   { discount: 200, type: "flat",    label: "₹200 Flat Off",              minOrder: 1000 },
  "FLASH50":   { discount: 50,  type: "percent", label: "50% Off Electronics",        minOrder: 500, cat: "electronics" },
  "WELCOME":   { discount: 15,  type: "percent", label: "15% Welcome Offer",          minOrder: 0 },
  "BEAUTY20":  { discount: 20,  type: "percent", label: "20% Off Beauty Products",    minOrder: 0, cat: "beauty" },
  "BOOK30":    { discount: 30,  type: "percent", label: "30% Off Books",              minOrder: 0, cat: "books" },
  "SPORT15":   { discount: 15,  type: "percent", label: "15% Off Sports",             minOrder: 0, cat: "sports" },
  "SHOPMORE":  { discount: 300, type: "flat",    label: "₹300 Off on Orders ₹2000+",  minOrder: 2000 },
  "NEWUSER":   { discount: 20,  type: "percent", label: "20% New User Discount",      minOrder: 0 },
  "MEGA1000":  { discount: 1000,type: "flat",    label: "₹1,000 Off Orders ₹5,000+", minOrder: 5000 },
  "FREESHIP":  { discount: 49,  type: "flat",    label: "Free Delivery on Any Order", minOrder: 0 }
};

// ── AVAILABLE BRANDS ──
const BRANDS = [
  "SoundMax", "TechWear", "ActionPro", "GameForce", "AudioX", "BoomBox", "ViewMax", "DeskPro",
  "UrbanWear", "DenimCo", "BloomStyle", "SoleKing", "EliteWear", "VisionElite", "EcoCarry",
  "ComfortSeat", "ZenHome", "EcoKitchen", "LumiDesk", "BrewMaster", "SleepWell",
  "FlexFit", "PowerLift", "RunFast", "BandStrong", "SpeedPro",
  "GlowLab", "GlamKit", "ClearSkin", "AgeLess",
  "Random House", "Harriman House", "Piatkus", "Harper", "Crown Business", "Warner Books"
];

// ── HELPER FUNCTIONS ──
function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

function getProductsByCategory(cat) {
  if (!cat || cat === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.cat === cat);
}

function getProductsByBrand(brand) {
  if (!brand || brand === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
}

function getProductsByTag(tag) {
  return PRODUCTS.filter(p => p.tags.includes(tag));
}

function getRelatedProducts(product, limit = 4) {
  return PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, limit);
}

function getTrendingProducts(limit = 8) {
  return [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, limit);
}

function getNewArrivals(limit = 8) {
  return PRODUCTS.filter(p => p.isNew).slice(0, limit);
}

function getSaleProducts(limit = 8) {
  return PRODUCTS.filter(p => p.isSale).slice(0, limit);
}

function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.cat.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q)) ||
    (p.brand && p.brand.toLowerCase().includes(q))
  );
}

function getDiscountPercent(p) {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

function applyCoupon(code, cart, subtotal) {
  const c = COUPONS[code.toUpperCase()];
  if (!c) return { valid: false, message: '❌ Invalid coupon code.' };
  if (subtotal < c.minOrder) return { valid: false, message: `❌ Minimum order ${formatPrice(c.minOrder)} required.` };

  // Category specific coupon check
  if (c.cat) {
    const hasCategoryItem = cart.some(item => {
      const p = getProductById(item.id);
      return p && p.cat === c.cat;
    });
    if (!hasCategoryItem) {
      return { valid: false, message: `❌ This coupon is valid only on ${c.cat} items.` };
    }
  }

  let discount = 0;
  if (c.type === 'percent') discount = Math.round(subtotal * c.discount / 100);
  if (c.type === 'flat') discount = Math.min(c.discount, subtotal);
  return { valid: true, discount, message: `✅ "${code}" applied! ${c.label}.` };
}
