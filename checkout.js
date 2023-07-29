// checkout.js

// Function to generate product HTML
function generateProductHTML(product) {
    return `
    <div class="col-12 col-md-6 col-lg-4 mb-4">
      <div class="card h-100 d-flex flex-column justify-content-between p-3">
      <img src="${product.image}" alt="${product.name}" class="img-thumbnail ">
      <div class="product-info">
        <h4>${product.name}</h4>
        <p>Price: $${product.price}</p>
        <p>Quantity: ${product.quantity}</p>
      </div>
      </div>
    </div>
    `;
  }
  
  // Function to display the selected products in the order summary container
  function displayOrderSummary(cart) {
    const orderSummaryContainer = document.querySelector('.order-summary');
    if (cart.length === 0) {
      orderSummaryContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
    } else {
      const orderSummaryHTML = cart.map((product) => generateProductHTML(product)).join('');
      orderSummaryContainer.innerHTML = orderSummaryHTML;
    }
  }
  
  // Function to calculate the total price of the selected products
  function calculateTotalPrice(cart) {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  }
  
  // Function to handle the checkout form submission
  function handleCheckout(event) {
    alert("order placed successfully")
    form.reset();
    event.preventDefault();
    // Your code for handling the form submission
  }
  
  // Event listener for the checkout form submission
  document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
  
  // Load cart data from local storage
  const cartData = localStorage.getItem('cart');
  let cart = [];
  if (cartData) {
    cart = JSON.parse(cartData);
  }
  
  // Display the selected products in the order summary container
  displayOrderSummary(cart);
  
  // Calculate the total price of the selected products and display it in the order summary
  const totalPrice = calculateTotalPrice(cart);
  const orderSummaryContainer = document.querySelector('.order-summary');
  orderSummaryContainer.insertAdjacentHTML('beforeend', `<p class="text-center mt-4">Total Price: $${totalPrice.toFixed(2)}</p>`);
  