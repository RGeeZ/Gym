window.onload = async function() {
    // Step 1: Get the session ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    // if (!sessionId) {
    //     alert("Session ID is missing. Please try again.");
    //     return;
    // }

    const cartDataElement = document.getElementById('cartData');
const cartId = cartDataElement.dataset.cartId;
const orderId = cartDataElement.dataset.orderId;

// Log to confirm
console.log('Cart ID from paymentsuccess:', cartId);
console.log('Order ID:', orderId);

    try {
        // Step 2: Send a request to the backend to verify payment
        const response = await fetch(`/process-payment/${cartId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               // sessionId: sessionId,  // Send the session ID to your backend
                cartId: cartId,  // You can send the cart ID from your template or URL
                orderId: orderId  // If order ID is available, include it
            })
        });

        const result = await response.json();

        if (result.message === 'Payment successful. Order and cart deleted.') {
            // Optionally, redirect user to a confirmation page or homepage
            window.location.href = '/';
        } else {
            alert('There was an issue with processing your payment. Please try again.');
        }

    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Something went wrong. Please try again.");
    }
};