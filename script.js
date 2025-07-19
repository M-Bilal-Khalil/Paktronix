// Product Array
const products = [
  { id: 1, name: "Gaming Laptop", price: 1200, image: "assets/laptop.jpg", description: "Core i7 7700k, Rx580 6GB Graphics Card, 16GB RAM, 1TB HDD, 256GB SSD, 4k Display" },
  { id: 2, name: "Graphics Card", price: 500, image: "assets/graphics_card.jpg", description: "GTX 1080TI, 11GB Ultra fast GDDR5X Memory, VR Ready, G-SYNC, Gaming GPU" },
  { id: 3, name: "PlayStation 5", price: 700, image: "assets/ps5.jpg", description: "AMD 8-core Zen 2 Processor, 16GB of GDDR6 RAM, Ultra-fast 825GB NVMe SSD" },
  { id: 4, name: "AMD Processor", price: 400, image: "assets/processor.jpg", description: " AMD Ryzen 5 3500 6-core, 6-thread processor, Base clock 3.6 GHz, boost clock 4.1 GHz" },
];

// Utility: Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Utility: Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Utility: Get total cart count
function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Render products on index.html
function renderProducts() {
  const row = document.getElementById("products-row");
  if (!row) return; // Only run on index.html
  row.innerHTML = "";
  products.forEach(product => {
    const col = document.createElement("div");
    // Responsive grid classes
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top product-img img-fluid" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Price: $${product.price}</p>
          <p class="card-text text-muted" style="font-size:0.9em;">${product.description}</p>
          <button class="btn btn-dark mt-auto add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  // Add event listeners for Add to Cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      addToCart(parseInt(this.dataset.id));
      showCartAlert();
    });
  });
}

// Add product to cart
function addToCart(productId) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

// Update cart count badge
function updateCartCount() {
  const count = getCartCount();
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

// Redirect to cart.html when cart icon is clicked
const cartBtn = document.getElementById("cart-btn");
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}

// Render cart on cart.html
function renderCart() {
  const cartTable = document.getElementById("cart-table-body");
  if (!cartTable) return; // Only run on cart.html
  const cart = getCart();
  cartTable.innerHTML = "";
  let totalQty = 0;
  let totalPrice = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    totalQty += item.quantity;
    totalPrice += product.price * item.quantity;
    const tr = document.createElement("tr");
    tr.className = "cart-item";
    tr.innerHTML = `
      <td><img src="${product.image}" class="cart-img img-fluid" alt="${product.name}"></td>
      <td>${product.name}</td>
      <td>$${product.price}</td>
      <td>
        <button class="btn btn-sm btn-secondary me-1" onclick="changeQty(${item.id}, -1)">-</button>
        ${item.quantity}
        <button class="btn btn-sm btn-secondary ms-1" onclick="changeQty(${item.id}, 1)">+</button>
      </td>
      <td>$${product.price * item.quantity}</td>
    `;
    cartTable.appendChild(tr);
  });
  const qtyElem = document.getElementById("total-qty");
  const priceElem = document.getElementById("total-price");
  if (qtyElem) qtyElem.textContent = totalQty;
  if (priceElem) priceElem.textContent = "$" + totalPrice;
}

// Change quantity (+/-) in cart
window.changeQty = function(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart(cart);
  renderCart();
}

// Show cart alert
function showCartAlert() {
  const alert = document.getElementById('cart-alert');
  if (!alert) return;
  alert.classList.remove('d-none');
  setTimeout(() => {
    alert.classList.add('d-none');
  }, 2500);
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCount();
  renderCart();
});