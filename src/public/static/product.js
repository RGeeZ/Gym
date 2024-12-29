async function fetchProducts() {
    try {
      // Fetch the products from the API (testing locally or deployed backend)
      
      const response = await fetch('http://localhost:3000/api/product');
      console.log(response.url); // To see if you were redirected to another URL
console.log(response.status); // To see the HTTP status code

      console.log(response);      // Uncomment for deployed backend URL:
      // const response = await fetch('https://your-backend-api.com/api/products');
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const products = await response.json();
      console.log(products);
  
      const productGrid = document.getElementById('powder-cards-container');
      productGrid.innerHTML = ''; // Clear any existing content
  
      // Loop through each product and create its card
      products.forEach(product => {
        const productCard = document.createElement('div');
        console.log(`product._id from product.js ${product._id}`)
  
        // Add 'card' class to each product card
        productCard.classList.add('card');
  
        // Add content and buttons to the product card
        productCard.innerHTML = `
          <a href="/product/${product._id}" class="product-link">
            <h3>${product.Name}</h3>
            <p>${product.Description}</p>
            <p class="price">${product.Price.toFixed(2)}</p>
          </a>
          <div class="price-button-container">
          </div>
        `;   //Initial buttons are thses             <button class="buy-now">Buy Now</button>     AND      <button class="add-to-cart">Add to Cart</button>
        //<button class="buy-now" id="buy-now-btn" data-product-id="{{product._id}}">Buy Now</button>    
        //<button class="add-to-cart" id="add-to-cart-btn">Add to Cart</button>
         
        productGrid.appendChild(productCard);
  
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  
  // Fetch and display products as soon as the script is loaded
  fetchProducts();

