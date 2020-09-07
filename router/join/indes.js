const express = require('express');
const router = express.Router(); 
const path = require('path'); 

// mysql 
const mysql = require('mysql');
const passport = require('passport');
const { connect } = require('http2');
const connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'maria',
  database : 'stu'
});
connection.connect();
/*
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../page/join.html'))
});
*/
router.get('/', function(req, res) {
  let msg;
  let errmsg = req.flash('error');
  if(errmsg) msg = errmsg;

  res.render('join.ejs',{'msg': msg});
});
/*
router.post('/', function(req, res) {
  console.log(req.body);
  let id = req.body.id;
  let pw = req.body.pw;
  let nm = req.body.nm;
  
  /*
  connection.query('insert into user (id, pw, nm) values ("'+ req.body.id+'" , "'+ req.body.pw+"' , '"+req.body.nm +'" )',
    function(err, rows){
      if(err) throw err;
      console.log("join insert");
    });
  
 let sql = {id:id, pw:pw, nm: nm};
 connection.query('insert into user set ?', sql, function(err, rows){
      if(err) throw err;
      else {
        console.log("join insert", rows.insertId, req.body.id);
        res.render('mainpage.ejs', {txt: req.body.id});
      }
    });
});
*/

//const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;

passport.use('local-join', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    passReqToCallback: true
  }, function(req, id, pw, done){
    console.log('local-join ');
    connection.query('select * from user where id = ?', [id], function(err, rows){
      if(err) return done(err);
      if(rows.length){    
        return done(null, false, {message: 'id exsist'})
      }else {
        let sql = {id: id, pw: pw};
        connection.query('insert into user set ?', sql, function(err, rows){
          if(err) throw err;
          return done(null, {'id': id, 'isid': rows.insertId});
        })
      }
    })
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser ', user)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser ', id)
  done(null, id)
  /*User.findById(id, function(err, user) {
    done(err, user);
  });*/
});

router.post('/', passport.authenticate('local-join', { 
  successRedirect: '/main',
  failureRedirect: '/join',
  failureFlash: true 
}));





module.exports = router;