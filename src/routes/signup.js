const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    try {
        const { name, age, password, confirm_password, email, contact, address } = req.body;


        // Check for leading/trailing spaces
        const hasLeadingOrTrailingSpace = (str) => /^\s|\s$/.test(str);
        const inputs = { name, age, password, confirm_password, email, contact, address };
        for (const [key, value] of Object.entries(inputs)) {
            const strValue = String(value); // Convert the value to a string
            if (hasLeadingOrTrailingSpace(strValue)) {
                return res.status(400).send(`Inputs must not contain leading or trailing spaces`);
            }
        }

        // User verification if user is alreadypresent or not
        const user = await User.findOne({Email: email});
        if(user){

            return res.status(400).send('email already exists.')
         
        }
        // Validate required fields
        if (!name || !age || !password || !confirm_password || !email || !contact || !address) {
            return res.status(400).send('All fields are required.');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send('Invalid email format.');
        }

        if (password !== confirm_password) {
            return res.status(400).send('Passwords do not match.');
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send('Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.');
        }

        // Validate contact number
        if (!/^\d{10}$/.test(contact)) {
            return res.status(400).send('Contact must be a valid 10-digit number.');
        }
        
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            Name: name.trim(),
            Age: age,
            Password: hashedPassword,
            Confirm_password: hashedPassword,
            Email: email.toLowerCase(),
            Contact: contact,
            Address: address.trim()
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.Email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(201).redirect('/');
        
    } catch (error) {
        //console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
