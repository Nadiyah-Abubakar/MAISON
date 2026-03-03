// ---- DATA ----
const products = [
    { id: 1, name: 'Arles Lounge Chair', brand: 'MAISON COLLECTION', price: 1290, oldPrice: 1650, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80', tag: 'New', category: 'Living Room', desc: 'The Arles Lounge Chair is a masterpiece of comfort and form. Featuring a solid oak frame and premium upholstery, it brings a sense of refined relaxation to any living space.' },
    { id: 2, name: 'Lumière Oak Dining Table', brand: 'NORDIC CRAFT', price: 2480, oldPrice: null, img: 'assets/images/lumiere_oak_dining_table.png', tag: null, category: 'Dining', desc: 'Crafted from sustainable European white oak, the Lumière table celebrates natural beauty through clean lines and exceptional joinery. Perfect for both casual family meals and formal dinners.' },
    { id: 3, name: 'Calme Linen Sofa', brand: 'ATELIER PARIS', price: 3890, oldPrice: 4600, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', tag: 'Sale', category: 'Living Room', desc: 'Sink into the ultimate comfort of the Calme Linen Sofa. Its deep seating and feather-filled cushions are wrapped in Italian stonewashed linen for a relaxed yet sophisticated look.' },
    { id: 4, name: 'Serene Platform Bed', brand: 'MAISON COLLECTION', price: 1870, oldPrice: null, img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80', tag: 'New', category: 'Bedroom', desc: 'A minimalist sanctuary for your bedroom. The Serene Platform Bed features a low profile and integrated headboard, focusing on pure materials and peaceful design.' },
    { id: 5, name: 'Côte Marble Console', brand: 'STONE ATELIER', price: 780, oldPrice: 980, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', tag: 'Sale', category: 'Living Room', desc: 'The Côte Console is an elegant statement piece featuring a hand-selected marble top supported by a slender, powder-coated steel frame. A perfect focal point for hallways.' },
    { id: 6, name: 'Clermont Writing Desk', brand: 'NORDIC CRAFT', price: 1140, oldPrice: null, img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80', tag: null, category: 'Office', desc: 'The Clermont Desk combines functionality with artisanal detail. With its integrated cable management and soft-close drawers, it makes working from home a true pleasure.' },
    { id: 7, name: 'Velvet Accent Chair', brand: 'MAISON COLLECTION', price: 490, oldPrice: 620, img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', tag: 'Sale', category: 'Living Room', desc: 'A touch of luxury for any corner. This velvet accent chair features deep jewel tones and elegant tapered legs, adding a bold pops of color and sophisticated style.' },
    { id: 8, name: 'Woven Rattan Daybed', brand: 'TERRA STUDIO', price: 2200, oldPrice: null, img: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=400&q=80', tag: 'New', category: 'Outdoor', desc: 'Bring the vacation home with the Woven Rattan Daybed. Handcrafted by master weavers, it uses weather-resistant materials to create a durable and beautiful outdoor retreat.' },
];

let cart = JSON.parse(localStorage.getItem('maison_cart')) || [];
let budgetMax = 99999;
let wishlist = new Set(JSON.parse(localStorage.getItem('maison_wishlist')) || []);

// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
        cursorRing.style.left = e.clientX + 'px';
        cursorRing.style.top = e.clientY + 'px';
    }, 80);
});
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(0.7)';
});
document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
});

// ---- LOADER ----
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2000);
});

// ---- HEADER SCROLL ----
window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 40);
});

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---- RENDER PRODUCTS ----
function renderProducts(list) {
    const grid = document.getElementById('productsGrid');
    if (!list.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--muted);font-style:italic">No products found in this price range.</div>`;
        return;
    }
    grid.innerHTML = list.map((p, i) => `
    <div class="product-card reveal reveal-delay-${(i % 4) + 1}" style="opacity:1;transform:none">
      <div class="product-img" onclick="openQuickView(${p.id})">
        ${p.tag ? `<div class="product-tag">${p.tag}</div>` : ''}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-actions" onclick="event.stopPropagation()">
          <button class="btn-add" onclick="addToCart(${p.id})">Add to Cart</button>
          <button class="btn-wish ${wishlist.has(p.id) ? 'active' : ''}" id="wish-${p.id}" onclick="toggleWish(${p.id})">♡</button>
        </div>
      </div>
      <div class="product-brand">${p.brand}</div>
      <div class="product-name" onclick="openQuickView(${p.id})" style="cursor:none">${p.name}</div>
      <div class="product-price">
        <span class="price-current">$${p.price.toLocaleString()}</span>
        ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toLocaleString()}</span>` : ''}
        ${p.oldPrice ? `<span class="price-save">SAVE $${(p.oldPrice - p.price).toLocaleString()}</span>` : ''}
      </div>
    </div>
  `).join('');
}
renderProducts(products);

// ---- BUDGET FILTER ----
function applyBudget(min, max, btn) {
    budgetMax = max;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const filtered = products.filter(p => p.price >= min && p.price <= max);
    renderProducts(filtered);
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showNotif(`Showing products up to $${max === 99999 ? '∞' : max.toLocaleString()}`);
}

function filterCategory(cat) {
    const filtered = products.filter(p => p.category === cat);
    renderProducts(filtered);
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.chip')[0].classList.add('active');
}

function updateRange(val) {
    const v = parseInt(val);
    document.getElementById('rangeDisplay').textContent = '$' + v.toLocaleString();
    const pct = (v / 10000) * 100;
    document.getElementById('budgetRange').style.background =
        `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--border) ${pct}%)`;
    const filtered = products.filter(p => p.price <= v);
    renderProducts(filtered);
    if (v < 500) showBudgetToast("Great finds under $" + v.toLocaleString() + "!");
}

// ---- CART ----
function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const existing = cart.find(x => x.id === id);
    if (existing) { existing.qty++; }
    else { cart.push({ ...p, qty: 1 }); }
    updateCartUI();
    saveData();
    showNotif(`${p.name} added to cart`);
}

function toggleCart() {
    document.getElementById('cartOverlay').classList.toggle('open');
}

function toggleWishlist() {
    document.getElementById('wishlistOverlay').classList.toggle('open');
}

function updateCartUI() {
    const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const count = cart.reduce((s, x) => s + x.qty, 0);
    document.getElementById('cartCount').textContent = count;
    const itemsEl = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');

    if (!cart.length) {
        itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        footer.style.display = 'none';
        return;
    }
    footer.style.display = 'block';
    itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          <button class="cart-remove" onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
    document.getElementById('cartSubtotal').textContent = '$' + total.toLocaleString();
    document.getElementById('cartTotalDisplay').textContent = '$' + total.toLocaleString();
}

function updateWishlistUI() {
    const itemsEl = document.getElementById('wishlistItems');
    const footer = document.getElementById('wishlistFooter');

    if (wishlist.size === 0) {
        itemsEl.innerHTML = '<div class="cart-empty">Your wishlist is empty</div>';
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';
    const wishItems = Array.from(wishlist).map(id => products.find(p => p.id === id)).filter(p => p);

    itemsEl.innerHTML = wishItems.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="btn-add" style="padding: 6px 12px; font-size: 0.6rem;" onclick="addToCart(${item.id})">Add to Cart</button>
          <button class="cart-remove" onclick="toggleWish(${item.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addAllToCart() {
    wishlist.forEach(id => {
        const p = products.find(x => x.id === id);
        if (p) {
            const existing = cart.find(x => x.id === id);
            if (existing) { existing.qty++; }
            else { cart.push({ ...p, qty: 1 }); }
        }
    });
    wishlist.clear();
    updateCartUI();
    updateWishlistUI();
    saveData();
    renderProducts(products);
    showNotif('All items added to cart');
}

function saveData() {
    localStorage.setItem('maison_cart', JSON.stringify(cart));
    localStorage.setItem('maison_wishlist', JSON.stringify(Array.from(wishlist)));
}

function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if (!item) return;
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) cart = cart.filter(x => x.id !== id);
    updateCartUI();
    saveData();
}

function removeItem(id) {
    cart = cart.filter(x => x.id !== id);
    updateCartUI();
    saveData();
}

// click outside cart/wishlist to close
document.getElementById('cartOverlay').addEventListener('click', function (e) {
    if (e.target === this) toggleCart();
});
document.getElementById('wishlistOverlay').addEventListener('click', function (e) {
    if (e.target === this) toggleWishlist();
});
document.getElementById('cartBtn').addEventListener('click', toggleCart);
document.getElementById('wishlistBtn').addEventListener('click', toggleWishlist);

// ---- WISHLIST ----
function toggleWish(id) {
    if (wishlist.has(id)) {
        wishlist.delete(id);
        showNotif('Removed from wishlist');
    } else {
        wishlist.add(id);
        showNotif('Saved to wishlist ♡');
    }
    const btn = document.getElementById('wish-' + id);
    if (btn) btn.classList.toggle('active', wishlist.has(id));
    updateWishlistUI();
    saveData();
}

// ---- CHECKOUT LOGIC ----
function openCheckout() {
    if (cart.length === 0) {
        showNotif('Your cart is empty');
        return;
    }
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('checkoutModal').classList.add('open');
    nextStep(1); // Ensure we start at step 1
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('open');
}

function nextStep(step) {
    if (step === 2) {
        const name = document.getElementById('check-name').value;
        const email = document.getElementById('check-email').value;
        const addr = document.getElementById('check-address').value;
        if (!name || !email || !addr) {
            showNotif('Please fill in all shipping details');
            return;
        }
        document.getElementById('confirm-name').textContent = name.split(' ')[0];
    }

    if (step === 3) {
        const card = document.getElementById('check-card').value;
        if (!card) {
            showNotif('Please enter payment details');
            return;
        }
        cart = [];
        saveData();
        updateCartUI();
    }

    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + step).classList.add('active');

    document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active'));
    for (let i = 1; i <= step; i++) {
        document.getElementById('dot-' + i).classList.add('active');
    }
}

// ---- MOBILE NAV ----
function toggleMobileNav() {
    document.getElementById('mobileNav').classList.toggle('open');
}

// ---- SEARCH ----
document.getElementById('searchBtn').addEventListener('click', toggleSearch);
function toggleSearch() {
    document.getElementById('searchModal').classList.toggle('open');
    if (document.getElementById('searchModal').classList.contains('open')) {
        setTimeout(() => document.getElementById('searchInput').focus(), 100);
    }
}
// ---- QUICK VIEW ----
function openQuickView(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');

    content.innerHTML = `
    <button class="product-modal-close" onclick="closeQuickView()">✕</button>
    <div class="product-modal-img"><img src="${p.img}" alt="${p.name}"></div>
    <div class="product-modal-info">
      <div class="product-modal-brand">${p.brand}</div>
      <h3 class="product-modal-name">${p.name}</h3>
      <div class="product-modal-price">$${p.price.toLocaleString()}</div>
      <p class="product-modal-desc">${p.desc}</p>
      <div class="product-modal-actions">
        <button class="btn-primary" onclick="addToCart(${p.id});closeQuickView()">Add to Cart</button>
        <button class="btn-ghost" onclick="toggleWish(${p.id})">Wishlist</button>
      </div>
    </div>
  `;
    modal.classList.add('open');
}

function closeQuickView() {
    document.getElementById('productModal').classList.remove('open');
}

document.getElementById('productModal').addEventListener('click', function (e) {
    if (e.target === this) closeQuickView();
});

// ESC to close all modals
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeQuickView();
        document.getElementById('searchModal').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('open');
        document.getElementById('wishlistOverlay').classList.remove('open');
    }
});
function handleSearch(q) {
    const el = document.getElementById('searchResults');
    if (!q.trim()) { el.innerHTML = ''; return; }
    const results = products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase())
    );
    if (!results.length) {
        el.innerHTML = `<span style="color:var(--taupe)">No results for "${q}"</span>`;
        return;
    }
    el.innerHTML = results.map(p => `
    <div style="display:flex;gap:16px;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);cursor:none"
         onclick="toggleSearch();document.getElementById('featured').scrollIntoView({behavior:'smooth'})">
      <img src="${p.img}" style="width:48px;height:48px;object-fit:cover;opacity:0.8">
      <div>
        <div style="color:var(--cream);font-size:0.9rem;font-family:'Cormorant Garamond',serif">${p.name}</div>
        <div style="color:var(--taupe);font-size:0.7rem;margin-top:3px">$${p.price.toLocaleString()}</div>
      </div>
    </div>
  `).join('');
}

// ---- NEWSLETTER ----
function subscribe() {
    const val = document.getElementById('emailInput').value;
    if (!val || !val.includes('@')) { showNotif('Please enter a valid email'); return; }
    document.getElementById('emailInput').value = '';
    showNotif('You\'re subscribed! Welcome to MAISON.');
}

// ---- NOTIFICATIONS ----
function showNotif(msg) {
    const el = document.getElementById('notif');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2800);
}

function showBudgetToast(msg) {
    const el = document.getElementById('budgetToast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

// init UI
updateCartUI();
updateWishlistUI();
