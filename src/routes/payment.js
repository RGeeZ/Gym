const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { Authenticated } = require('../middleware/middleware');
const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');

router.get('/payment', Authenticated, async(req,res) =>{
    const user = req.user.id;
    const cart = await Cart.findOne({userId: user})
    console.log(`cart from payment get request ${cart}`)
    res.render('Payment', { cart });
})

router.post('/stripe-checkout', Authenticated, async(req,res) =>{
    //Will do this one later when I will put stripe here
    return res.status(200).json({ message: 'Payment is successfull' });

})
router.get('/payment-success/:id', async (req, res) => {
    // Check if the provided ID is a valid ObjectId
    const cartId = req.params.id;
    console.log(cartId);
    
    // If the ID is not a valid ObjectId, return an error response
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).send('Invalid cart ID');
    }

    try {
        // Fetch the cart from the database using the valid ObjectId
        const cart = await Cart.findById(cartId);
        
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Render the Payment Success page with the cart details
        res.render('Paymentsuccess', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error occurred.');
    }
});

router.get('/user-profile', Authenticated, async (req, res) => {
    try {
        // Assume user is logged in and user ID is stored in session
        const userId = req.user.id;
        const user = await User.findById(userId);
        console.log(`user from updateuser ${user}`);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('userprofile', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;