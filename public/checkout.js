const cart = JSON.parse(localStorage.getItem('cart') || '[]');

const summaryItems = document.getElementById('summaryItems');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutInner = document.getElementById('checkoutInner');
const orderSuccess = document.getElementById('orderSuccess');
const cardNumber = document.getElementById('cardNumber');
const expiry = document.getElementById('expiry');

function renderSummary() {
  if (cart.length === 0) {
    summaryItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    return;
  }
  summaryItems.innerHTML = cart.map(item => `
    <div class="summary-item">
      <span>${item.name} × ${item.qty}</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
  summaryTotal.textContent = `$${subtotal.toFixed(2)}`;
}

// Auto-format card number as user types
cardNumber.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = val.replace(/(\d{4})(?=\d)/g, '$1 ');
});

// Auto-format expiry MM/YY
expiry.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
  e.target.value = val;
});

document.getElementById('paymentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  localStorage.removeItem('cart');
  checkoutInner.style.display = 'none';
  orderSuccess.style.display = 'block';
});

renderSummary();
