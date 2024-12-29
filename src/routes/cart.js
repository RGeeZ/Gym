const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { Authenticated } = require('../middleware/middleware');
const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');
const Payment = require('../models/payment') 


router.post('/add-to-cart', Authenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body; // Ensure quantity is provided or default to 1

        console.log(`User ID: ${userId}, Product ID: ${productId}, Quantity: ${quantity}`);

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid or missing product ID' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const currentUser = await User.findById(userId);
        if (!currentUser || !currentUser.Address) {
            return res.status(400).json({ error: 'Invalid user or missing address' });
        }
        const validQuantity = Number(quantity) || 1; 

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            // Create a new cart if none exists
            cart = new Cart({
                userId,
                address: currentUser.Address,
                items: [{
                    productId,
                    productName: product.Name,
                    productPrice: product.Price,
                    productImage: product.Image || 'No Image Available',
                    quantity,
                }],
                totalPrice: product.Price * validQuantity,
            });
        } else {
            // Check if the product is already in the cart
            const existingItem = cart.items.find(item => 
                item.productId.equals(productId)
            );

            if (existingItem) {
                existingItem.quantity += validQuantity;
            } else {
                cart.items.push({
                    productId,
                    productName: product.Name,
                    productPrice: product.Price,
                    productImage: product.Image || 'No Image Available',
                    quantity: validQuantity
                });
            }

            // Update the total price
            cart.totalPrice += product.Price * validQuantity;
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (err) {
        console.error('Error in /add-to-cart:', err);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
});
router.get('/cart',Authenticated, async (req,res) =>{
    const userId = req.user.id;
    console.log(`User ID from cart: ${userId}`);

    const response = await Cart.findOne({ userId: userId });
    console.log(response);
    // console.log(`order from /cart call ${order}`)
    res.render('Cart',{response});
})
router.post('/api/checkout', Authenticated, async(req,res)=>{
    const user = req.user.id;
    const current_order = await Cart.findOne({userId: user});
    const current_user = await User.findById(user);
    console.log(`user from /api/checkout ${current_user.Address}`);
    if(current_order.address === "Dummy_Address"){
        return res.status(200).json({redirect: '/UpdateAddress'});
       
    }else{
        res.status(200).json({ redirect: '/payment' });
    }

})
router.post('/process-payment/:id', Authenticated,async (req, res) => {
    // const cart = await Cart.findById(req.params.id);
    // const {cartId, orderId } = req.body;

    try {
        


        //code is for stripe connection
        // Step 1: Retrieve the session from Stripe
       // const session = await stripe.checkout.sessions.retrieve(sessionId);

        // if (!session) {
        //     return res.status(400).send('Session not found.');
        // }

        // // Step 2: Verify that the payment was successful
        // if (session.payment_status === 'paid') {
        // } else {
        //     return res.status(400).send('Payment failed.');
        // }



        //Below code will be added in if condition post adding stripe
            // 3. Fetch and delete related data
            const cart = await Cart.findById(req.params.id);
            console.log(`Cart from process-payment ${cart}`)
            //const order = await Order.findById(cart.orderId);
          //  const orderItems = order.OrderItem;  // Order items to delete

            // Save cart to Payment Schema
            
            if (cart) {
                const payment = new Payment({
                    userId: cart.userId,
                    address: cart.address,
                    totalPrice: cart.totalPrice,
                    orderItems: cart.items,
                   // orderId: order._id,
                    cartId: req.params.id
                });
                const final = await payment.save();
                console.log(`Here we go at last ${final}`);
           }

            // // Delete related OrderItems
            // for (const itemId of orderItems) {
            //     await OrderItem.findByIdAndDelete(itemId);
            // }

            // // // Delete the Order and Cart
            // await Order.findByIdAndDelete(cart.orderId);
            await Cart.findByIdAndDelete(req.params.id);
            // await Cart.deleteMany({ userId: req.user.id });


            return res.status(200).json({ message: 'Payment successful. Order and cart deleted.' });
        

    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).send('Server error occurred.');
    }
});


router.post('/api/cart/manage', Authenticated, async (req, res) => {
        try {
            const { action, productId, quantity } = req.body;
    
            if (!action || !productId) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }
    
            const userId = req.user.id;
    
            // Find the user's cart
            const cart = await Cart.findOne({ userId: userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: 'Cart not found' });
            }
    
            if (action === 'update') {
                // Ensure cart items are valid
                if (!cart.items || !Array.isArray(cart.items)) {
                    return res.status(400).json({ success: false, message: 'Cart items not found or invalid' });
                }
    
                // Find the item to update
                const item = cart.items.find(item => String(item.productId) === String(productId));
                if (item) {
                    item.quantity = quantity; // Update the quantity
                } else {
                    return res.status(404).json({ success: false, message: 'Product not found in cart' });
                }
            } else if (action === 'remove') {
                // Filter the cart items to remove the product
                cart.items = cart.items.filter(item => String(item.productId) !== String(productId));
            } else {
                return res.status(400).json({ success: false, message: 'Invalid action' });
            }
    
            // Recalculate the total price after update or removal
            cart.totalPrice = cart.items.reduce((total, item) => {
                return total + (item.productPrice * item.quantity);
            }, 0);
    
            // Save the updated cart to the database
            await cart.save();
    
            // Send the response once the cart is updated
            return res.json({ success: true, cart });
    
        } catch (error) {
            console.error('Error processing cart:', error);
            // Ensure no response has been sent before sending this error response
            if (!res.headersSent) {
                return res.status(500).json({ success: false, message: 'Failed to update cart' });
            }
        }
    });
    
// app.get('/cart1', Authenticated, (req,res) =>{
//     res.render('Cart1.hbs');
// })
router.get('/api/cart1', Authenticated, async(req,res)=>{
    const userId = req.user.id;
    console.log(`User ID from cart1: ${userId}`);

    const response = await Cart.findOne({ userId: userId }).lean();
    // console.log(`order from /cart call ${order}`)
    console.log(`order from /cart1 call  ${JSON.stringify(response, null, 2)}`);
    if (!response) {
        return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({response});
})

router.get('/checkout', Authenticated, async(req,res) =>{
    const user = req.user.id;
    const current_user = await Order.findOne({User: user});
    console.log(`user from /checkout ${current_user.Address}`);
    if(current_user.Address != "Dummy_Address"){
        res.status(201).send({message: 'Fill Address details'})
    }
    res.status(400).send({ message: 'Address is present' })
})

module.exports = router;
