
// 라우터 리팩토링 
const express = require('express');
const router = express.Router(); 
const path = require('path'); 

router.use('/main',require('./main/main'));
router.use('/user',require('./user/user'));
router.use('/join',require('./join/indes'));
router.use('/login', require('./login/index'));
router.use('/logout', require('./logout/index'));

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../page/form.html'));
});

module.exports = router;