function generateProductHTML(product) {
  return `
    <div class="col-12 col-md-6 col-lg-4 mb-4">
      <div class="card h-100 d-flex flex-column justify-content-between">
        <img src="${product.image}" class="card-img-top h-50 p-3" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <h4 class="card-text">${product.price} $</h4>
          <button class="btn btn-primary add-to-cart"   data-product-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}
function displayProducts() {
  const productContainer = document.getElementById("product-container");

  // Use the 'map' function to create an array of product HTML strings
  const productHTMLArray = products.map((product, index) => generateProductHTML(product, index));

  // Join the array of HTML strings into a single string
  const productHTML = productHTMLArray.join("");

  // Set the innerHTML of the container to display the products
  productContainer.innerHTML = productHTML;

  
}
// Call the displayProducts function to display the products on page load
document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
});
document.addEventListener('DOMContentLoaded', () => {
  displayProducts();

  // Load cart data from local storage
  const cartData = localStorage.getItem('cart');
  if (cartData) {
    cart = JSON.parse(cartData);
    updateCartCount();
    displayCartItems();
  }
});
// Initialize the cart array to store added items
let cart = [];


function addToCart(productId) {
  // Find the product in the products array based on the productId
  const selectedProduct = products.find((product) => product.id === productId);

  // Check if the product is already in the cart
  const cartItemIndex = cart.findIndex((item) => item.id === productId);

  if (cartItemIndex !== -1) {
    // If the product is already in the cart, increase the quantity
    cart[cartItemIndex].quantity++;
    
  } else {
    // If the product is not in the cart, add it with a quantity of 1
    cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: selectedProduct.price,
      quantity: 1,
    });
  }

  // Update the cart count in the navbar
  updateCartCount();

  // Display the updated cart items in the cart modal
  displayCartItems();
  saveCartToLocalStorage();
}
function updateProductBadges() {
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach((button) => {
    const productId = parseInt(button.dataset.productId);
    const cartItemIndex = cart.findIndex((item) => item.id === productId);
    if (cartItemIndex !== -1) {
      const quantityBadge = document.createElement('span');
      quantityBadge.classList.add('badge', 'bg-warning', 'position-absolute', 'top-0', 'end-0', 'mt-1', 'me-1');
      quantityBadge.textContent = cart[cartItemIndex].quantity;
      button.appendChild(quantityBadge);
    }
  });
}

function updateCartCount() {
  const cartCountElement = document.querySelector('.count');
  cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function displayCartItems() {
  const cartItemsContainer = document.querySelector('#cart .modal-body');
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    // If the cart is empty, display a message
    cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
    const cartFooter = document.querySelector('#cart .modal-footer p');
    cartFooter.textContent = `Total Price: $${0}`;
  } else {
    // If the cart has items, display the cart items and total price
    cart.forEach((item) => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item', 'd-flex', 'align-items-center');

      cartItem.innerHTML = `
        <img src="${item.image}" alt="Product Image" class="product-img">
        <div class="product-details">
          <h4>${item.name}</h4>
          <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
          <div class="quantity">
          <button class="btn btn-sm btn-info btn-decrease" data-product-id="${item.id}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="btn btn-sm btn-info btn-increase" data-product-id="${item.id}">+</button>
        </div>
        </div>
        <button class="btn btn-danger btn-remove" data-product-id="${item.id}">Remove</button>
      `;

      cartItemsContainer.appendChild(cartItem);

      updateProductBadges();
    });

    function removeProductBadges() {
      const badges = document.querySelectorAll('.add-to-cart .badge');
      badges.forEach((badge) => badge.remove());
    }
    
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const productId = parseInt(event.target.dataset.productId);
        removeFromCart(productId);
        removeProductBadges();
        updateProductBadges()
      });
    });
    // Calculate the total price
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Set the total price in the cart modal footer
    const cartFooter = document.querySelector('#cart .modal-footer p');
    cartFooter.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
     
       // Add click event listeners for the quantity increase and decrease buttons
       const increaseButtons = document.querySelectorAll('.btn-increase');
       const decreaseButtons = document.querySelectorAll('.btn-decrease');
   
       increaseButtons.forEach((button) => {
         button.addEventListener('click', (event) => {
           const productId = parseInt(event.target.dataset.productId);
           increaseQuantity(productId);
         });
       });
   
       decreaseButtons.forEach((button) => {
         button.addEventListener('click', (event) => {
           const productId = parseInt(event.target.dataset.productId);
           decreaseQuantity(productId);
         });
       });
     
    const clearCartButton = document.querySelector('.clear-cart');
    clearCartButton.addEventListener('click', () => {
      // Clear the cart by removing all items from the cart array
      cart = [];
      cartFooter.textContent = `Total Price: $0`
      updateCartCount();
      // Display the message that the cart is empty
      displayCartItems();

        // Update the product badges
        removeProductBadges();
    });
    
  }
}

function removeFromCart(productId) {
  // Find the index of the product in the cart array
  const cartItemIndex = cart.findIndex((item) => item.id === productId);

  if (cartItemIndex !== -1) {
    // If the product is found in the cart, remove it from the cart array
    cart.splice(cartItemIndex, 1);
 
    // Update the cart count in the navbar
    updateCartCount();

    // Redisplay the updated cart items in the cart modal
    displayCartItems();
    
    saveCartToLocalStorage();
  }
}
function increaseQuantity(productId) {
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity++;
    displayCartItems();
    updateCartCount();
    saveCartToLocalStorage();
  }
}

function decreaseQuantity(productId) {
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity--;
    displayCartItems();
    updateCartCount();
    saveCartToLocalStorage();
  }
}

// Event delegation to handle "Add to Cart" button clicks
// app.js
// Event delegation to handle "Add to Cart" button clicks
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('add-to-cart')) {
    const productId = parseInt(event.target.dataset.productId);
    addToCart(productId);
    
  }
});

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log(cart)
}

// Event listener for the cart icon
document.getElementById('cart-icon').addEventListener('click', () => {
  // Show the cart modal using Bootstrap's modal methods
  const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
  cartModal.show();
});

// Event listener for the "shown.bs.modal" event
document.getElementById('cartModal').addEventListener('shown.bs.modal', () => {
  // Display the updated cart items and total price in the cart modal
  displayCartItems();

  
});

// Event delegation to handle "Add to Cart" button clicks


document.getElementById('contactForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.checkValidity()) {
    // Form is valid, show the success message and reset the form
    document.getElementById('successMessage').classList.remove('d-none');
    form.reset();
  }
});




