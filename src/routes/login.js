const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('Login');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const hasLeadingOrTrailingSpace = (str) => /^\s|\s$/.test(str);
        const inputs = { password, email};
        for (const [key, value] of Object.entries(inputs)) {
            const strValue = String(value); // Convert the value to a string
            if (hasLeadingOrTrailingSpace(strValue)) {
                return res.status(400).send(`Inputs must not contain leading or trailing spaces`);
            }
        }

        // Validate required fields
        if (!password || !email) {
            return res.status(400).send('All fields are required.');
        }
         // Validate email format
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
             return res.status(400).send('Invalid email format.');
         }

        const user = await User.findOne({ Email: email });

        //Validate if user's email is present.
        if(!user){
            return res.status(401).send('Invalid login credentials');
        }

        //Validate if password is correct.
        const validateUser = await bcrypt.compare(password, user.Password);
        if(!validateUser){
             return res.status(404).send('Invalid credentials');
        }


        if (user && validateUser) {
            const token = jwt.sign({ id: user._id, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.redirect('/');
        }

        // res.status(401).send('Invalid login credentials');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
