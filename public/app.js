const products = [
  { id: 1, name: 'Ceramic Pour-Over', price: 34, emoji: '☕', category: 'Kitchen' },
  { id: 2, name: 'Linen Table Runner', price: 28, emoji: '🧵', category: 'Textiles' },
  { id: 3, name: 'Oak Desk Lamp', price: 89, emoji: '💡', category: 'Lighting' },
  { id: 4, name: 'Woven Storage Basket', price: 42, emoji: '🧺', category: 'Decor' },
  { id: 5, name: 'Minimalist Wall Clock', price: 56, emoji: '🕰️', category: 'Decor' },
  { id: 6, name: 'Stoneware Vase Set', price: 48, emoji: '🏺', category: 'Decor' },
  { id: 7, name: 'Wool Throw Blanket', price: 65, emoji: '🧶', category: 'Textiles' },
  { id: 8, name: 'Brass Candle Holder', price: 22, emoji: '🕯️', category: 'Lighting' },
  { id: 9, name: 'Bamboo Cutting Board', price: 31, emoji: '🍽️', category: 'Kitchen' },
  { id: 10, name: 'Cotton Throw Pillow', price: 24, emoji: '🛋️', category: 'Textiles' },
  { id: 11, name: 'Pendant Light Fixture', price: 112, emoji: '🏮', category: 'Lighting' },
  { id: 12, name: 'Terracotta Planter', price: 19, emoji: '🪴', category: 'Decor' },
];

const categories = ['All', 'Kitchen', 'Decor', 'Textiles', 'Lighting'];
let activeCategory = 'All';
let searchTerm = '';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

const grid = document.getElementById('productGrid');
const noResults = document.getElementById('noResults');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const toast = document.getElementById('toast');
const searchInput = document.getElementById('searchInput');
const filterPills = document.getElementById('filterPills');

function renderFilterPills() {
  filterPills.innerHTML = categories.map(cat => `
    <button class="pill ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');
  filterPills.querySelectorAll('.pill').forEach(btn => {
    btn.onclick = () => {
      activeCategory = btn.dataset.cat;
      renderFilterPills();
      renderProducts();
    };
  });
}

function renderProducts() {
  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-image">${p.emoji}</div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="product-price">$${p.price.toFixed(2)}</p>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`${product.name} added to cart`);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  cartCountEl.textContent = totalItems;
  cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>$${item.price.toFixed(2)}</span>
      </div>
      <div class="qty-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function openCart() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
}
function closeCart() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
}

document.getElementById('cartBtn').onclick = openCart;
document.getElementById('closeCart').onclick = closeCart;
cartOverlay.onclick = closeCart;

document.getElementById('checkoutBtn').onclick = () => {
  if (cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }
  window.location.href = '/checkout.html';
};

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderProducts();
});

renderFilterPills();
renderProducts();
renderCart();
