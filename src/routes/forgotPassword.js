const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.get('/ForgotPassword', (req, res) => {
    res.render('ForgotPassword', { EmailContact: true });
});

router.post('/forgot-password', async (req, res) => {
    console.log('Request Body:', req.body); // Debug incoming data
    const { stage, email, contact, password } = req.body;
    // const email = req.body.email;
    // const stage = req.body.stage;

    try {
        if (stage === 'emailContact') {
            console.log('Stage: emailContact');
            // Validate email and contact
            const user = await User.findOne({ Email: email });
            console.log(`user is from post forgot-password: ${user}`)
            if (!user) {
                console.log('User not found');
                return res.render('ForgotPassword', {
                    EmailContact: true,
                    error: 'User with this email does not exist.',
                });
            }

            if (user.Contact !== contact) {
                console.log('Contact does not match');
                return res.render('ForgotPassword', {
                    EmailContact: true,
                    error: 'Contact number does not match.',
                });
            }

            console.log('Validation passed, moving to password reset');
            // Email and contact are valid, move to password reset
            return res.render('ForgotPassword', { Password: true, email });
        }

        if (stage === 'password') {
            console.log('Stage: password');
            // Update the password
            console.log(email);
            const user = await User.findOne({ Email: email });
            if (!user) {
                console.log('User not found during password reset');
                return res.render('ForgotPassword', {
                    EmailContact: true,
                    error: 'Something went wrong.',
                });
            }

            user.Password = await bcrypt.hash(password, 10);
            console.log(`password from fp ${user.Password}`);
            await user.save();

            console.log('Password updated, redirecting to login');
            return res.redirect('/login');
        }

        console.log('Unhandled stage:', stage);
        res.status(400).send('Invalid stage');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
