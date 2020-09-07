const express = require('express');
const app = express();
const router = express.Router(); 

// 상대경로를 사용
const path = require('path'); 

// mysql 
const mysql = require('mysql');
const connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'maria',
  database : 'mysql'
});

router.post('/textpost', function(req, res) {
    //req.body : post req 처리시
    // obj 형태로 받아옴
    console.log('req.body', req.body);
    //res.send("<h1>textpost  "+req.body.txt+"</h1>");

    // view engine
    res.render('viewpage.ejs',{'txt': req.body.txt})
});

router.post('/ajaxsend', function(req, res) { 
    let data = {};

    let query = connection.query("select user, host from user where User = 'gun'", function(err, rows){
        if(err) throw err;
        if(rows[0]){
            console.log(rows[0]);
            data.result = 'ok';
            data.name = rows[0].User;
        }else {
            data.result = 'none';
            data.name = "";
        }
        res.json(data);
    });

    //res.json({'result': 'ok', 'txt': req.body.txt})
});

module.exports = router;