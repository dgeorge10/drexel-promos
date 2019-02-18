const express = require('express');
const router = express.Router();
const db = require('../config/database');
const user = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs')

require('../config/passport')(passport, user);

//render login page
router.get('/login', (req,res) => res.render('login'));

//handle login attempts
router.post('/login', (req,res) => {
    let { email, password } = req.body;
    
    var savedPass = "";
    user.findAll({ where: {
        email
    }})
    .then(user => {
        // if there is no user this will break
        savedPass = user[0].password;
        bcrypt.compare(password, savedPass, (err, result) => {
            if (result) {
                console.log('success')
                req.session.userid = email;
                req.session.loggedin = true;
                req.session.username = email;
                res.redirect('/posts')
            }else{
                console.log('fail')
                res.render('login', {msg:"Error logging in", email})
            }
        });
    })
    .catch(err => console.log(err))
    
});

router.get('/register', (req,res) => res.render('register'))

router.post('/register', (req,res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];

    if(!username || !email || !password || !password2){
        errors.push({msg: "All fields must be entered"})
    }
    if(password !== password2){
        errors.push({msg: "Passwords do not match"})
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2
        })
    } else {
        //add to db
        let salt = bcrypt.genSaltSync(10);
        bcrypt.hash(password, salt, null, function(err, hash) {
            if(err) throw err;
            const newUser = user.build({
                username,
                password: hash,
                email
            });
            newUser.save()
             .then(() => {
                console.log('user saved');
                res.render('login', { msg: "Registration complete"})
             })
            .catch(err => console.log(err))
        });
        
    }
});

module.exports = router;