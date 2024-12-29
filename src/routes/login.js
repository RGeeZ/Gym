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
        const user = await User.findOne({ Email: email });

        if (user && await bcrypt.compare(password, user.Password)) {
            const token = jwt.sign({ id: user._id, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.redirect('/');
        }

        res.status(401).send('Invalid login credentials');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
