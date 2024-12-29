const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { Authenticated } = require('../middleware/middleware');
const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');




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

// Route to handle the user profile update
router.post('/update-profile', Authenticated, async (req, res) => {
    try {
        // Assume user is logged in and user ID is stored in session
        const userId = req.user.id;

        // Get the updated data from the form
        const { name, email, contact, address } = req.body;

        // Find the user and update the changed fields
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Only update fields that are provided (not undefined)
        if (name) user.Name = name;
        if (email) user.Email = email;
        if (contact) user.Contact = contact;
        if (address) user.Address = address; 

        await user.save();

        res.redirect('/user-profile'); // Redirect back to the profile page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/api/UpdateAddress', Authenticated, async(req,res) =>{
    const {address} = req.body;
    const user = req.user.id;
    try{
        const current_user = await User.findById(user);
        const current_order = await Cart.findOne({userId: user});
        if(!current_user){
            return res.status(404).json({ message: 'User not found' });
        }
        current_user.Address = address; // Update the address field (assuming it's a simple string)
        await current_user.save();
        current_order.address = address;
        await current_order.save();
        // const updatedUser = await Order.findOneAndUpdate(
        //     { User: user },
        //     { $set: { Address: address } },
        //     { new: true }
        // );
        // console.log(updatedUser);
        
        return res.status(200).json({ message: 'Address updated successfully' });

    }catch(e){
        console.error(e);
        return res.status(500).json({ message: 'Error updating address' });
    }
})


router.get('/UpdateAddress', Authenticated, (req, res) => {
    res.render('updateAddress');
});

module.exports = router;