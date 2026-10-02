/**
 * VÉRIDIAN // Zinc Atelier
 * Pure JavaScript E-Commerce Store Engine
 * Includes: Auth, Catalog, Cart Display, Cart Edit, Checkout, Reviews
 */

// 1. Initial State & Data
const STORE_DATA = {
  products: [
    {
      id: "prod-1",
      name: "Monolith Architectural Zinc Planter",
      category: "planters",
      categoryLabel: "Planters",
      price: 185,
      originalPrice: 215,
      rating: 4.9,
      reviewsCount: 38,
      description: "Cold-patinated solid zinc alloy vessel engineered with internal root aeration channels. Hand-finished with an olive-zinc oxidation patina.",
      specs: ["Material: 99.4% Cast Zinc Alloy", "Dimensions: 28cm x 22cm x 22cm", "Weight: 4.2 kg", "Drainage: Dual-chamber system"],
      stock: 12,
      svgColor: "#1b382b"
    },
    {
      id: "prod-2",
      name: "Verdant Luminaire Desk Lamp No. 04",
      category: "lighting",
      categoryLabel: "Lighting",
      price: 240,
      originalPrice: 280,
      rating: 5.0,
      reviewsCount: 29,
      description: "Precision-milled matte zinc-green body with spun solid brass accents. Features a 2700K museum-grade warm CRI 98 LED diffused through borosilicate glass.",
      specs: ["Finish: Dark zinc-green anodization", "LED: 2700K warm circadian, CRI 98+", "Dimmer: Brass touch dial", "Cord: 2.0m woven forest green"],
      stock: 8,
      svgColor: "#224736"
    },
    {
      id: "prod-3",
      name: "Cold-Pressed Conifer Botanical Essence (50ml)",
      category: "botanicals",
      categoryLabel: "Botanicals",
      price: 88,
      rating: 4.8,
      reviewsCount: 46,
      description: "Wild-harvested subalpine fir, hinoki cypress, and cold-pressed juniper berry in organic squalane. Deep zinc-green UV bottle with heavy metal cap.",
      specs: ["Notes: Damp moss, Siberian fir, juniper", "Volume: 50ml / 1.7 fl oz", "Dispenser: Machined zinc dropper", "Harvest: High Alps"],
      stock: 24,
      svgColor: "#152a20"
    },
    {
      id: "prod-4",
      name: "Prism Faceted Terrarium Vessel",
      category: "vessels",
      categoryLabel: "Vessels",
      price: 160,
      rating: 4.9,
      reviewsCount: 35,
      description: "Faceted geometric biosphere built with hand-soldered weathered zinc metal seams and optical-clarity plate glass. Includes preserved mountain cushion moss.",
      specs: ["Seams: Hand-soldered zinc came", "Glass: 3mm low-iron float glass", "Starter Bed: Preserved cushion moss", "Care: Zero-water requirement"],
      stock: 14,
      svgColor: "#274e3c"
    },
    {
      id: "prod-5",
      name: "Cast Zinc Botanical Mist Nebulizer",
      category: "botanicals",
      categoryLabel: "Botanicals",
      price: 125,
      originalPrice: 145,
      rating: 4.7,
      reviewsCount: 19,
      description: "Solid zinc-weighted pneumatic fine-droplet plant mister. Generates an ultra-fine 30-micron vapor plume designed specifically for delicate flora.",
      specs: ["Chamber: Machined brass & zinc alloy", "Atomization: 30 micron plume", "Volume: 350ml reservoir", "Trigger: Sculpted thumb lever"],
      stock: 16,
      svgColor: "#1a3427"
    },
    {
      id: "prod-6",
      name: "Architectural Zinc Horizon Incense Monolith",
      category: "vessels",
      categoryLabel: "Vessels",
      price: 74,
      rating: 4.9,
      reviewsCount: 52,
      description: "Minimalist 30cm extruded zinc incense burner tray with integrated magnetic ash collector. Patinated in dark forest verdigris tones.",
      specs: ["Body: Die-cast zinc extrusion", "Length: 320mm x 45mm x 18mm", "Catch: Magnetic ash release", "Includes: 15 Hinoki incense sticks"],
      stock: 20,
      svgColor: "#183226"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      author: "Elena Rostova",
      role: "Architectural Designer, Zurich",
      rating: 5,
      date: "March 14, 2026",
      verified: true,
      title: "Flawless weight and exquisite patina finish",
      comment: "The Monolith Zinc Planter exceeded every expectation. The contrast between the cold-cast zinc-green tones and the white limestone in my study is striking. Exceptional manufacturing rigor.",
      helpful: 24
    },
    {
      id: "rev-2",
      author: "Marcus Vance",
      role: "Creative Director, London",
      rating: 5,
      date: "February 28, 2026",
      verified: true,
      title: "The Verdant Luminaire is an heirloom work",
      comment: "The brass touch dial responsiveness and the deep matte zinc chassis give it an unmatched presence. The 2700K optical diffusion illuminates drafting paper without glare.",
      helpful: 19
    },
    {
      id: "rev-3",
      author: "Sora Takahashi",
      role: "Botanical Curator, Kyoto",
      rating: 5,
      date: "January 19, 2026",
      verified: true,
      title: "True sensory luxury with conifer depth",
      comment: "The Hinoki and subalpine notes in the Conifer Essence are remarkably authentic. The heavy zinc dropper cap feels wonderful in hand. Ordering two more bottles today.",
      helpful: 15
    }
  ]
};

// Global Store State
let cart = JSON.parse(localStorage.getItem('veridian_cart') || '[]');
let activeFilter = 'all';
let activeSort = 'featured';
let appliedCoupon = null;
let currentUser = JSON.parse(localStorage.getItem('veridian_user') || 'null');

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderReviews();
  updateCartUI();
  updateAuthUI();
  setupEventListeners();
});

// Helper: SVG Graphic Generator for crisp offline standalone preview
function getProductSVG(product) {
  return `
    <svg viewBox="0 0 400 300" class="w-100 h-100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${product.svgColor}" />
          <stop offset="100%" stop-color="#0d1b14" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="#f2f5f4" />
      <circle cx="200" cy="150" r="90" fill="url(#grad-${product.id})" opacity="0.95" />
      <rect x="150" y="90" width="100" height="120" rx="6" fill="#14271e" />
      <line x1="150" y1="130" x2="250" y2="130" stroke="#4ade80" stroke-width="2" />
      <circle cx="200" cy="100" r="16" fill="#2d5a46" />
      <text x="200" y="250" font-family="'Syne', sans-serif" font-size="12" font-weight="bold" fill="#1b352a" text-anchor="middle" letter-spacing="1">
        VÉRIDIAN · ${product.categoryLabel.toUpperCase()}
      </text>
    </svg>
  `;
}

// 2. Render Products
function renderProducts() {
  const container = document.getElementById('productGrid');
  if (!container) return;

  let filtered = [...STORE_DATA.products];
  if (activeFilter !== 'all') {
    filtered = filtered.filter(p => p.category === activeFilter);
  }

  // Sorting
  if (activeSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (activeSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  container.innerHTML = filtered.map(product => {
    return `
      <div class="col">
        <div class="card card-product h-100">
          <div class="product-img-frame cursor-pointer" onclick="openProductModal('${product.id}')">
            ${getProductSVG(product)}
            <div class="position-absolute top-0 end-0 p-2">
              <span class="badge bg-white text-zinc-dark shadow-sm px-2 py-1 small fw-semibold">
                ★ ${product.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div class="card-body p-3 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="meta-label text-zinc-green">${product.categoryLabel}</span>
                <span class="small text-muted">${product.stock} in stock</span>
              </div>
              <h5 class="font-display fw-bold text-zinc-dark fs-6 mb-2 cursor-pointer" onclick="openProductModal('${product.id}')">
                ${product.name}
              </h5>
              <p class="text-secondary small mb-3 line-clamp-2" style="font-size: 0.82rem;">
                ${product.description}
              </p>
            </div>
            <div>
              <div class="d-flex justify-content-between align-items-baseline mb-3">
                <div class="d-flex align-items-baseline gap-2">
                  <span class="fs-5 fw-bold font-display text-zinc-green tabular-nums">$${product.price}</span>
                  ${product.originalPrice ? `<span class="text-decoration-line-through text-muted small tabular-nums">$${product.originalPrice}</span>` : ''}
                </div>
                <button class="btn btn-sm btn-link text-zinc-dark p-0 text-decoration-none fw-medium" onclick="openProductModal('${product.id}')">
                  Specs & Details →
                </button>
              </div>
              <button class="btn btn-zinc-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2" onclick="addToCart('${product.id}')">
                <i class="bi bi-bag-plus"></i>
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Render Reviews
function renderReviews() {
  const container = document.getElementById('reviewsList');
  if (!container) return;

  container.innerHTML = STORE_DATA.reviews.map(rev => {
    const stars = Array(rev.rating).fill('<i class="bi bi-star-fill text-warning"></i>').join('');
    return `
      <div class="review-card">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="fw-bold text-zinc-dark">${rev.author}</span>
              ${rev.verified ? '<span class="badge bg-zinc-50 text-zinc-green border border-zinc-subtle small py-0.5">Verified Patron</span>' : ''}
            </div>
            <div class="small text-muted">${rev.role} · ${rev.date}</div>
          </div>
          <div class="fs-6">${stars}</div>
        </div>
        <h6 class="fw-bold text-zinc-dark mt-2 mb-1">${rev.title}</h6>
        <p class="text-secondary small m-0">${rev.comment}</p>
        <div class="mt-3 pt-2 border-top d-flex justify-content-between align-items-center small text-muted">
          <span>Was this review helpful?</span>
          <button class="btn btn-sm btn-light border py-0 px-2" onclick="this.innerHTML='✓ Helpful (' + (${rev.helpful} + 1) + ')'; this.disabled=true;">
            Helpful (${rev.helpful})
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Cart Operations (Add, Display, Edit, Remove)
function addToCart(productId, qty = 1) {
  const product = STORE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ product, quantity: qty });
  }

  saveCart();
  updateCartUI();

  // Show Offcanvas feedback
  const offcanvasEl = document.getElementById('cartOffcanvas');
  if (offcanvasEl) {
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
    bsOffcanvas.show();
  }
}

function updateCartQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.product.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  saveCart();
  updateCartUI();
}

function clearCart() {
  if (confirm('Are you sure you want to empty your shopping bag?')) {
    cart = [];
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('veridian_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById('cartCountBadge');
  const drawerCount = document.getElementById('cartDrawerCount');
  if (badge) badge.textContent = totalCount;
  if (drawerCount) drawerCount.textContent = totalCount + ' items';

  const container = document.getElementById('cartItemsContainer');
  const footer = document.getElementById('cartFooterSection');

  if (cart.length === 0) {
    if (container) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-bag-x fs-1 text-muted d-block mb-3"></i>
          <h6 class="font-display fw-bold text-zinc-dark">Your Bag is Empty</h6>
          <p class="text-secondary small mb-3">You haven't added any zinc pieces to your collection yet.</p>
          <button class="btn btn-sm btn-zinc-dark px-3" data-bs-dismiss="offcanvas">
            Explore Collection
          </button>
        </div>
      `;
    }
    if (footer) footer.classList.add('d-none');
    updateThreshold(0);
    return;
  }

  if (footer) footer.classList.remove('d-none');

  let subtotal = 0;
  if (container) {
    container.innerHTML = cart.map(item => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="cart-item-row">
          <div style="width: 54px; height: 54px;" class="rounded overflow-hidden flex-shrink-0 bg-white border">
            ${getProductSVG(item.product)}
          </div>
          <div class="flex-grow-1 min-w-0">
            <h6 class="fw-bold text-zinc-dark fs-6 mb-0 text-truncate" style="font-size: 0.85rem;">
              ${item.product.name}
            </h6>
            <div class="text-zinc-green fw-semibold small tabular-nums">$${item.product.price}</div>
            
            <!-- Quantity Stepper (Edit Cart) -->
            <div class="d-flex align-items-center gap-2 mt-2">
              <button class="stepper-btn" onclick="updateCartQuantity('${item.product.id}', -1)">-</button>
              <span class="small font-mono fw-bold px-1 tabular-nums">${item.quantity}</span>
              <button class="stepper-btn" onclick="updateCartQuantity('${item.product.id}', 1)">+</button>
              <button class="btn btn-link text-danger p-0 ms-2 small" onclick="removeFromCart('${item.product.id}')" title="Remove">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div class="text-end">
            <div class="fw-bold font-display text-zinc-dark tabular-nums">$${itemTotal}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Calculations
  const discountRate = appliedCoupon === 'ZINC15' ? 0.15 : 0;
  const discountAmount = subtotal * discountRate;
  const freeThreshold = 150;
  const shipping = subtotal >= freeThreshold || subtotal === 0 ? 0 : 18;
  const finalTotal = subtotal - discountAmount + shipping;

  // Update Cart Drawer Values
  document.getElementById('cartSubtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('cartDiscount').textContent = '-$' + discountAmount.toFixed(2);
  document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
  document.getElementById('cartTotal').textContent = '$' + finalTotal.toFixed(2);

  updateThreshold(subtotal);

  // Update Checkout Modal Values if open
  const checkoutSub = document.getElementById('checkoutSubtotal');
  const checkoutDisc = document.getElementById('checkoutDiscount');
  const checkoutShip = document.getElementById('checkoutShipping');
  const checkoutTot = document.getElementById('checkoutTotal');
  const checkoutSummary = document.getElementById('checkoutSummaryItems');

  if (checkoutSub) checkoutSub.textContent = '$' + subtotal.toFixed(2);
  if (checkoutDisc) checkoutDisc.textContent = '-$' + discountAmount.toFixed(2);
  if (checkoutShip) checkoutShip.textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
  if (checkoutTot) checkoutTot.textContent = '$' + finalTotal.toFixed(2);

  if (checkoutSummary) {
    checkoutSummary.innerHTML = cart.map(i => `
      <div class="d-flex justify-content-between small">
        <span class="text-truncate me-2">${i.product.name} × ${i.quantity}</span>
        <span class="tabular-nums fw-medium">$${(i.product.price * i.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }
}

function updateThreshold(subtotal) {
  const threshold = 150;
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const bar = document.getElementById('shippingProgressBar');
  const percentLabel = document.getElementById('shippingThresholdPercent');
  const textLabel = document.getElementById('shippingThresholdText');

  if (bar) bar.style.width = percent + '%';
  if (percentLabel) percentLabel.textContent = percent + '%';
  if (textLabel) {
    if (subtotal >= threshold) {
      textLabel.textContent = '✓ Complimentary Courier Freight Unlocked!';
    } else {
      textLabel.textContent = 'Add $' + (threshold - subtotal).toFixed(2) + ' for Free Courier';
    }
  }
}

// 5. Product Quick View Modal
function openProductModal(productId) {
  const product = STORE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modalProductTitle').textContent = product.name;
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductCategory').textContent = product.categoryLabel.toUpperCase();
  document.getElementById('modalProductPrice').textContent = '$' + product.price;
  document.getElementById('modalProductOriginalPrice').textContent = product.originalPrice ? '$' + product.originalPrice : '';
  document.getElementById('modalProductDesc').textContent = product.description;
  document.getElementById('modalProductImgContainer').innerHTML = getProductSVG(product);

  const specsList = document.getElementById('modalProductSpecs');
  if (specsList) {
    specsList.innerHTML = product.specs.map(s => `<li class="mb-1 text-secondary">· ${s}</li>`).join('');
  }

  const addBtn = document.getElementById('modalAddToCartBtn');
  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(product.id);
      const modalEl = document.getElementById('productDetailModal');
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    };
  }

  const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
  modal.show();
}

// 6. User Auth (Signup / Login)
function updateAuthUI() {
  const authBtnText = document.getElementById('authBtnText');
  if (!authBtnText) return;

  if (currentUser) {
    authBtnText.textContent = currentUser.name.split(' ')[0];
  } else {
    authBtnText.textContent = 'Account';
  }
}

// 7. Event Listeners Setup
function setupEventListeners() {
  // Category Filter clicks
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.getAttribute('data-filter');
      renderProducts();
    });
  });

  // Sort change
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderProducts();
    });
  }

  // Clear Cart
  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);

  // Apply Coupon
  const couponBtn = document.getElementById('applyCouponBtn');
  if (couponBtn) {
    couponBtn.addEventListener('click', () => {
      const code = document.getElementById('couponCodeInput').value.trim().toUpperCase();
      const msg = document.getElementById('couponMessage');
      if (code === 'ZINC15') {
        appliedCoupon = 'ZINC15';
        msg.className = 'small text-success mb-2';
        msg.textContent = '✓ 15% Atelier Patron discount applied!';
      } else {
        appliedCoupon = null;
        msg.className = 'small text-danger mb-2';
        msg.textContent = 'Invalid promo code. Use code: ZINC15';
      }
      updateCartUI();
    });
  }

  // Checkout Form Submission
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('checkoutEmail').value;
      const orderId = '#VER-' + Math.floor(10000 + Math.random() * 90000);

      document.getElementById('confirmedOrderId').textContent = orderId;
      document.getElementById('confirmedEmail').textContent = email;

      document.getElementById('checkoutFormWrapper').classList.add('d-none');
      document.getElementById('orderSuccessScreen').classList.remove('d-none');

      // Clear cart
      cart = [];
      saveCart();
      updateCartUI();
    });
  }

  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      currentUser = { name: email.split('@')[0], email };
      localStorage.setItem('veridian_user', JSON.stringify(currentUser));
      updateAuthUI();
      bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
      alert('Welcome back, ' + currentUser.name + '. Authenticated as Atelier Patron.');
    });
  }

  // Signup Form Submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      currentUser = { name, email };
      localStorage.setItem('veridian_user', JSON.stringify(currentUser));
      updateAuthUI();
      bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
      alert('Welcome to VÉRIDIAN Atelier, ' + name + '! Your patron account is active.');
    });
  }

  // Review Form Submission
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('reviewAuthor').value;
      const rating = parseInt(document.getElementById('reviewRating').value);
      const title = document.getElementById('reviewTitle').value;
      const comment = document.getElementById('reviewComment').value;

      STORE_DATA.reviews.unshift({
        id: 'rev-' + Date.now(),
        author,
        role: 'Verified Patron',
        rating,
        date: 'Today',
        verified: true,
        title,
        comment,
        helpful: 1
      });

      renderReviews();
      bootstrap.Modal.getInstance(document.getElementById('writeReviewModal')).hide();
      reviewForm.reset();
      alert('Thank you! Your patron review has been verified and published.');
    });
  }
}
