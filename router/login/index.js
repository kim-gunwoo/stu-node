const express = require('express');
const router = express.Router(); 
const path = require('path'); 
const mysql = require('mysql');
const passport = require('passport');
const connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'maria',
  database : 'stu'
});
connection.connect();


router.get('/', function(req, res) {
  res.render('login.ejs');
});


const LocalStrategy = require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    passReqToCallback: true
  }, function(req, id, pw, done){
    connection.query('select * from user where id = ?', [id], function(err, rows){
        if(err) return done(err);
        if(rows.length){
            return done(null, {id: id});
        }else {
            return done(null, false, {message: 'user no exist'})
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
});


router.post('/', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if(err) return res.status(500).json(err);
        if(!user) return res.status(401).json(info.message);
        req.logIn(user, function(err){
            if(err) return next(err);
            return res.json(user);
        });
    })(req, res, next)
});



module.exports = router;