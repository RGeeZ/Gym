const urlParts = window.location.pathname.split('/');
const buyNowBtn = document.getElementById('buy-now-btn');
const addToCartBtn = document.getElementById('add-to-cart-btn');

// Add event listener for "Buy Now" button
buyNowBtn.addEventListener('click', async () => {
    const productId = urlParts.length > 2 ? urlParts[urlParts.length - 1] : null;
    console.log(`Product ID for "Buy Now": ${productId}`);
    
    try {
        const response = await fetch(`/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        // Parse the response JSON
        const data = await response.json();
        console.log(`Response from server:`, data);

        // Check the response status
        if (response.ok) { // If response status is 200-299
            window.location.href = '/cart';
        } else {
            console.error(`Failed to add product: ${data.error || 'Unknown error'}`);
            alert(`Failed to add product: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
    }
});

// Add event listener for "Add to Cart" button
addToCartBtn.addEventListener('click', async () => {
    const productId = urlParts.length > 2 ? urlParts[urlParts.length - 1] : null;
    console.log(`Product ID for "Add to Cart": ${productId}`);
    
    try {
        const response = await fetch(`/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
            credentials: 'same-origin',
        });

        if (response.ok) {
            alert('Product added to cart!');
        } else {
            const data = await response.json();
            console.error(`Failed to add product: ${data.error || 'Unknown error'}`);
            alert(`Failed to add product: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
    }
});



