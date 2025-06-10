
document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.querySelector('#cart-icon');
  const cartPanel = document.querySelector('#cart');
  const closeCart = document.querySelector('#close-cart');
  const cartContent = document.querySelector('.cart-content');
  const totalPriceEl = document.querySelector('.total-price');
  const buyBtn = document.querySelector('.btn-buy');
  const productBoxes = document.querySelectorAll('.product-box');

  let cart = [];

  // Open/close cart
  cartIcon?.addEventListener('click', () => cartPanel.classList.add('active'));
  closeCart?.addEventListener('click', () => cartPanel.classList.remove('active'));

  // Add product to cart
  productBoxes.forEach(box => {
    const addCartBtn = box.querySelector('.add-cart');
    const title = box.querySelector('.product-title').innerText;
    const priceText = box.querySelector('.price').innerText.replace(/ksh\s*/i, '').replace(/,/g, '');
    const price = parseFloat(priceText);
    const imgSrc = box.querySelector('.product-img').src;

    addCartBtn.addEventListener('click', () => {
      const existing = cart.find(item => item.title === title);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ title, price, imgSrc, quantity: 1 });
      }
      updateCartUI();
    });
  });

  // Update cart display
  function updateCartUI() {
    cartContent.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartContent.innerHTML = '<p>Your cart is empty</p>';
      totalPriceEl.textContent = 'ksh 0';
      return;
    }

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartBox = document.createElement('div');
      cartBox.classList.add('cart-box');
      cartBox.innerHTML = `
        <img src="${item.imgSrc}" class="cart-img" />
        <div class="detail-box">
          <div class="cart-product-title">${item.title}</div>
          <div class="cart-price">ksh ${item.price.toLocaleString()}</div>
          <input type="number" value="${item.quantity}" class="cart-quantity" min="1" />
        </div>
        <i class="bx bx-trash-alt cart-remove"></i>
      `;

      // Quantity input
      cartBox.querySelector('.cart-quantity').addEventListener('change', (e) => {
        let newQty = parseInt(e.target.value);
        if (isNaN(newQty) || newQty < 1) newQty = 1;
        item.quantity = newQty;
        updateCartUI();
      });

      // Remove product
      cartBox.querySelector('.cart-remove').addEventListener('click', () => {
        cart = cart.filter(p => p.title !== item.title);
        updateCartUI();
      });

      cartContent.appendChild(cartBox);
    });

    totalPriceEl.textContent = 'ksh ' + total.toLocaleString();
  }

  // Buy now button
  buyBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    localStorage.setItem('cartData', JSON.stringify(cart));
    localStorage.setItem('cartTotal', total);

    window.location.href = 'delivery.html';
  });

  // Init
  updateCartUI();
});

