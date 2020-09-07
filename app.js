
// express 기본 설정
const express = require('express');
const app = express();
const port = 5000;
// post req 처리 설정
const bodyParser = require('body-parser');


// passport 처리 설정
const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;


// session 처리 설정
const session = require('express-session');

// flash 처리 설정
const flash = require('connect-flash');

// passport 및 session flash 설정 router 위에 배치 (라우터에서 사용)
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// mysql 
const mysql = require('mysql');
const connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'maria',
  database : 'mysql'
});


app.listen(port, function(){
    console.log("sev-node start ==> port", port);
});

// 정적인 파일을 가져오는 경로 지정 , 라우터 없이 파일을 가져올 수 있음
app.use(express.static('page')); // sendFile() 사용경로

// post 형태의 req
// Content-Type : application/x-www-form-urlencoded
// extended 는 중첩된 객체표현을 허용 여부 설정 true : 허용 , false : 비허용  
/*
extended: true = qs모듈을 사용하여 쿼리 스트링 값을 해석
extended: false = querystring 모듈을 사용하여 쿼리 스트링 값을 해석
let data = { info: { name: 'andy', age: 33 }, hobby[1]: sport, hobby[2]: coding }; 
//qs.parse(data) 의 결과 
{ info: { name: 'sejoon', age: '30' }, hobby: ['sport', 'coding'] } 
//querystring.parse(data)의 결과 
{ 'info[name]': 'andy', 'info[age]': '33', 'hobby[1]': 'sport', 'hobby[2]': 'coding' }
*/
app.use(bodyParser.urlencoded({extended: true}));
// json 형태의 req
// Content-Type : application/json
app.use(bodyParser.json());



// view engine ejs 
app.set('view engine','ejs');




// URL Routing
/*
app.get('/', function(req, res) {
    //req.param() get req 처리시
    //res.send("<h1>/</h1>");
    // sendFile() : 클라이언트에게 파일 제공
    //res.sendFile('/Users/gun/Documents/sev-node/page/main.html');
    // __dirname : 현재디렉토리 경로를 가져옴
    console.log(__dirname); 
    //res.sendFile(__dirname+'/page/main.html');
    res.sendFile(__dirname+'/page/form.html');
});
*/
// Post 처리
app.post('/textpost', function(req, res) {
    //req.body : post req 처리시
    // obj 형태로 받아옴
    console.log('req.body', req.body);
    //res.send("<h1>textpost  "+req.body.txt+"</h1>");

    // view engine
    res.render('viewpage.ejs',{'txt': req.body.txt})
});





app.post('/ajaxsend', function(req, res) { 
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

// router 사용
/*
const main = require('./router/main');

app.use('/main', main);
app.use('/user',require('./router/user'));
*/
// router 리팩토링
app.use(require('./router/index'));