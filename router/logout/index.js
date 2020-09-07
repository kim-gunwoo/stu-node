
const express = require('express');
const router = express.Router(); 
const path = require('path'); 

router.get('/', function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;