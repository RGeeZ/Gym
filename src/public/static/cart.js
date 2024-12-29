let payNowBtn = document.getElementById('pay-now');
// let IncreaaseBtn = document.getElementById('');
// let DecreaseBtn = document.getElementById('');
payNowBtn.addEventListener('click', async () => {
   try{
    const response = await fetch(`/api/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json()
    if (data.redirect) {
        console.log(`Redirecting to: ${data.redirect}`);
        window.location.href = data.redirect; // Perform manual redirection
    }
    console.log(`this is response ${data}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    // window.location.href = `/payment`;
   }catch(error){ 
    console.log(`Error from cart.js ${e}`);
   }
})
// document.addEventListener("DOMContentLoaded", () => {
//     const cartContainer = document.querySelector(".cart-container");
//     const payNowBtn = document.getElementById("pay-now");

//     async function updateCart(action, item) {
//         const response = await fetch("/api/cart", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action, item })
//         });
//         const data = await response.json();
//         renderCart(data.cart);
//     }

//     function renderCart(items) {
//         cartContainer.innerHTML = "";
//         items.forEach(item => {
//             const cartItem = document.createElement("div");
//             cartItem.classList.add("cart-item");
//             cartItem.innerHTML = `
//                 <img src="${item.productImage}" alt="${item.productName}" class="item-image">
//                 <div class="item-details">
//                     <h2>${item.productName}</h2>
//                     <p>Price: $<span>${item.productPrice}</span></p>
//                     <div>
//                         <button onclick="updateCart('update', { id: '${item.id}', quantity: ${item.quantity - 1} })">-</button>
//                         <span>${item.quantity}</span>
//                         <button onclick="updateCart('update', { id: '${item.id}', quantity: ${item.quantity + 1} })">+</button>
//                     </div>
//                 </div>
//                 <button onclick="updateCart('remove', { id: '${item.id}' })">Remove</button>
//             `;
//             cartContainer.appendChild(cartItem);
//         });
//     }
//     payNowBtn.addEventListener('click', async () => {
//         try{
//          const response = await fetch(`/api/checkout`, {
//              method: 'POST',
//              headers: {
//                  'Content-Type': 'application/json',
//              }
//          });
//          const data = await response.json()
//          if (data.redirect) {
//              console.log(`Redirecting to: ${data.redirect}`);
//              window.location.href = data.redirect; // Perform manual redirection
//          }
//          console.log(`this is response ${data}`)
//          if (!response.ok) {
//              throw new Error(`HTTP error! status: ${response.status}`);
//            }
//          // window.location.href = `/payment`;
//         }catch(error){
//          console.log(`Error from cart.js ${e}`);
//         }
//      })



//     // Initial cart load
//     updateCart("load");
// });



// Function to update the quantity of a product in the cart
function updateCart(productId, newQuantity) {
    if (newQuantity < 1) {
        alert("Quantity must be at least 1. Use the Remove button to delete the item.");
        return;
    }

    fetch("/api/cart/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "update",
            productId,
            quantity: newQuantity
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderCart(data.cart);
            } else {
                alert(data.message);
            }
        });
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    fetch("/api/cart/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "remove",
            productId
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderCart(data.cart);
            } else {
                alert(data.message);
            }
        });
}

// Function to fetch and render the cart
function fetchAndRenderCart() {
    fetch("/api/cart")
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            if (data.response && data.response.items) {
                renderCart(data.response); // Pass the full response
            } else {
                alert(data.message || "Failed to fetch cart items.");
            }
        })
        .catch(error => {
            console.error("Error fetching cart data:", error);
            alert("Failed to fetch cart data. Please try again later.");
        });
}

// Function to render the cart
function renderCart(cart) {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = ""; // Clear existing cart

    if (!cart.items || cart.items.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.items.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.productImage}" alt="${item.productName}" class="item-image">
            <div class="item-details">
                <h2>${item.productName}</h2>
                <p>Price: $<span class="item-price">${item.productPrice}</span></p>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" onclick="updateCart('${item.productId}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" onclick="updateCart('${item.productId}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.productId}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;

        cartContainer.appendChild(cartItem);
    });

    // Add the "Pay Now" button to the bottom of the cart container
    const payNowButton = document.createElement("button");
    payNowButton.className = "pay-now";
    payNowButton.innerText = "Pay Now";
    payNowButton.onclick = async() => {
        // alert("Proceeding to payment...");
        try{
            const response = await fetch(`/api/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json()
            if (data.redirect) {
                console.log(`Redirecting to: ${data.redirect}`);
                window.location.href = data.redirect; // Perform manual redirection
            }
            console.log(`this is response ${data}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
            // window.location.href = `/payment`;
           }catch(error){
            console.log(`Error from cart.js ${e}`);
           }
        // Redirect to payment or handle the action
    };
    cartContainer.appendChild(payNowButton);
}

// Initialize the cart page
window.onload = function () {
    fetchAndRenderCart();
};



