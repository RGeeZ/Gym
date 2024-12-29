const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { isAuthenticated } = require('../middleware/middleware');

router.get('/api/product', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

router.get('/product', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('Products', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading products page');
    }
});

router.get('/product/:id', async (req, res) => {
    try {
        if (!isAuthenticated(req)) {
            console.log("User not authenticated, redirecting to login.");
            req.session.returnTo = req.originalUrl;
            return res.redirect('/login');
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).render('error', { message: 'Product not found' });
        }
        res.render('OneProduct', { product });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

module.exports = router;
