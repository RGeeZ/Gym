const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('landing');
});

router.get('/home', (req, res) => {
    res.status(200).render('landing');
});

module.exports = router;
