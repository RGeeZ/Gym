const cartDataElement = document.getElementById('cartData');
const cartId = cartDataElement.dataset.cartId;
const orderId = cartDataElement.dataset.orderId;

// Log to confirm
console.log('Cart ID:', cartId);
console.log('Order ID:', orderId);
document.getElementById('payButton').addEventListener('click', async () => {
    try {
        // Prepare the data to send
        const data = {
            cartId: cartId,    // Cart ID from your template
            orderId: orderId     // Order ID from your template
        };

        // Send a POST request to the server
        console.log(JSON.stringify(data));
        const response = await fetch('/stripe-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Convert the data to JSON format
        });

        // Parse the response
        const result = await response.json();

        // Handle success or failure
        if (response.ok) {
            alert('Payment successful!'); // Success message
            console.log(`cart id from payment.js ${cartId}`);
            window.location.href = `/payment-success/${cartId}`; // Redirect on success
        } else {
            alert(`Payment failed: ${result.error}`);
        }
    } catch (error) {
        console.error('Error during payment:', error);
        alert('An error occurred. Please try again.');
    }
});