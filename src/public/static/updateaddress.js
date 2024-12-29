document.getElementById('submit-address').addEventListener('click', async () => {
    const addressInput = document.querySelector('input[type="text"]').value;
    console.log(JSON.stringify({ address: addressInput }));
    if (addressInput.trim() === '') {
      alert('Please enter a valid address.');
      return;
    }

    try {
      const response = await fetch('/api/UpdateAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: addressInput })
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      // Redirect user to the next page after address is updated
      window.location.href = '/payment'; // Example: Redirect to payment page
    } catch (error) {
      console.log(`Error: ${error.message}`);
      alert('There was an issue updating the address. Please try again.');
    }
  });