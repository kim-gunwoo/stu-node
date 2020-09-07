const express = require('express');
const app = express();
const router = express.Router(); 

// 상대경로를 사용
const path = require('path'); 
const { render } = require('ejs');


// router main 파일상에서는 /main -> / 가 된다
// 세션에 아이디 정보가 있을경우만 접근
router.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname, '../../page/form.html'));
    if(!req.user) res.render('login.ejs');
    res.render('main.ejs', {id: req.user})
});


module.exports = router;