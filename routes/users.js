const express = require('express');
const router = express.Router();
const db = require('../config/database');
const user = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs')

//passport
require('../config/passport')(passport, user);

//render login page
router.get('/login', (req,res) => res.render('login'));

//handle login attempts
router.post('/login', (req,res) => {
    //scrape email and pass from request body
    let { email, password } = req.body;
    
    //this sucks, but will be reworked w/ passport eventually
    //find all the users where the email in the db matches the entered email
    var savedPass = "";
    user.findAll({ where: {
        email
    }})
    //if we find a user
    .then(user => {
        // if there is no user this will break
        savedPass = user[0].password;
        //use bcrypt to compare the saved password in the db with what was entered
        bcrypt.compare(password, savedPass, (err, result) => {
            if (result) {
                console.log('success')
                //set up some session variables to detect if a user is logged in
                //this will eventually be replaced by passport stuff
                req.session.userid = email;
                req.session.loggedin = true;
                req.session.username = email;
                res.redirect('/posts')
            }else{
                console.log('fail')
                //re-render the login page with the correct error message
                //and whatever the email was that the user entered
                res.render('login', {msg:"Error logging in", email})
            }
        });
    })
    .catch(err => console.log(err))
    
});

//register get req
router.get('/register', (req,res) => res.render('register'))

//register post req
router.post('/register', (req,res) => {
    //scrape all the fields from request body
    const { username, email, password, password2 } = req.body;
    //error array that will be pushed to and rendered 
    let errors = [];

    //error checking
    if(!username || !email || !password || !password2){
        errors.push({msg: "All fields must be entered"})
    }
    if(password !== password2){
        errors.push({msg: "Passwords do not match"})
    }
    //if there were errors with the form, re-render register page with the
    //fields that they entered
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
        //encrypt the password
        let salt = bcrypt.genSaltSync(10);
        bcrypt.hash(password, salt, null, function(err, hash) {
            if(err) throw err;
            //build the user model so we can save to the DB with sequelize
            const newUser = user.build({
                username,
                password: hash,
                email
            });
            newUser.save()
             .then(() => {
                console.log('user saved');
                //render the login page with a message
                res.render('login', { msg: "Registration complete"})
             })
            .catch(err => console.log(err))
        });
        
    }
});

//export the router back to app.js
module.exports = router;