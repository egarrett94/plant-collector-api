var express = require('express');
var router = express.Router();

router.get('/signup', (req, res) => {
    res.send('signup endpoint');
});

router.get('/login', (req, res) => {
    res.send('login endpoint');
});

module.exports = router;