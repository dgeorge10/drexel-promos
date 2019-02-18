const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Post = require('../models/Post');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//get list of posts
router.get('/', (req,res) => {
    //check that the session has loggedin = true
    if(req.session.loggedin)
    {
        Post.findAll()
        .then(posts => {
            //if we found posts, render the posts page with a list of them
            res.render('posts', { 
                posts
            })
        })
        .catch(err => console.log(err))
    } else {
        //user is not logged in
        res.render('posts', {msg:'You are not logged in'})
    }
});

    

//display add post form
//same logic as above method ^^
router.get('/add', (req,res) => {
    if(req.session.loggedin) { res.render('add') }
    else{res.render('add', {msg:'You are not logged in'})}
}); 

//add a post
router.post('/add', (req,res) => {
    //scrape fields from request body
    let { title, content, type, event_date } = req.body;
    //errors array that will have unique errors pushed to it
    let errors = [];

    //validation
    if(!title){
        errors.push({ text: "Please add a post title"})
    }
    if(!content){
        errors.push({ text: "Please add post content"})
    }
    if(!type){
        errors.push({ text: "Please add an event type"})
    }
    if(!event_date){
        errors.push({ text: "Please select a date"})
    }

    //check for erorrs
    if(errors.length > 0){
        res.render('add', {
            errors, 
            title, 
            content, 
            type, 
            event_date
        })
    } else {

        //do anything to standardize fields (good for searching)

        //insert into table, hydrate post model
        Post.create({ 
            title,
            content,
            type,
            event_date
        })
        .then(post => res.redirect('/posts'))
        .catch(err => console.log(err))
    }

});

//search for posts
router.get('/search',(req,res) =>{

    //TODO: lock down for only logged in users
    let { term } = req.query;

    term = term.toLowerCase();
    //same as:
    //Select * from posts where content like %term%
    Post.findAll({
        where: {
            content: {
                [Op.like]: '%' + term + '%'
            }
        }
    })
     .then(posts => {
         res.render('posts', { posts })
     })
     .catch(err => console.log(err))

});

//export the router
module.exports = router;
