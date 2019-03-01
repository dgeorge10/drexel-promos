const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Post = require('../models/Post');
const EventType = require('../models/EventType')
const Sequelize = require('sequelize');
const formidable = require('formidable');
const imgur = require('imgur');
const fs = require('fs');
const Op = Sequelize.Op;

//put in .env
let key = "1262ec9c7e6efcc";

//get list of posts
router.get('/', (req,res) => {
    //check that the session has loggedin = true
    if(req.session.loggedin)
    {
        Post.findAll({
            order: [
                ['likes', 'DESC'],
                ['event_date', 'ASC']
            ]
        })
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
    console.log('add')
    //scrape fields from request body
    let { title, content, type, event_date, youtube, image } = req.body;
    let id = req.session.userid
    let username = req.session.username;
    
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
        errors.push({ text: "Please select an event type"})
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
            event_date,
            youtube,
            image: req.session.image
        })
    } else {

        //do anything to standardize fields (good for searching)
        //scrape video id from url
        if(youtube){
            var video_id = youtube.split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
        }
        
        //insert into table, hydrate post model
        Post.create({ 
            title,
            content,
            type,
            event_date,
            likes: 1,
            user_id: id,
            username,
            youtube: video_id,
            image_url: req.session.image
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
    //SELECT * FROM promos.posts WHERE type LIKE CONCAT('%', term,'%' ) OR title LIKE CONCAT('%', term,'%' ) OR type LIKE CONCAT('%', term,'%' );
    Post.sequelize
        .query('SELECT * FROM posts WHERE type LIKE \'%'+term+'%\' OR title LIKE \'%'+term+'%\' OR type LIKE \'%'+term+'%\'', 
           { mapToModel: true,
             model: Post }
        )
        .then(posts =>{ console.log(posts); res.render('posts', { posts })})
        .catch(err => console.log(err))


    //DEPRECATED
    //Select * from posts where content like %term%
    // Post.findAll({
    //     where: {
    //         content: {
    //             [Op.like]: '%' + term + '%'
    //         },
    //         title: {
    //             [Op.like]: '%' + term + '%'
    //         },
    //         type: {
    //             [Op.like]: '%' + term + '%'
    //         }

    //     },
    //     order: [
    //         ['likes', 'DESC']
    //     ]
    // })
    //  .then(posts => {
    //      res.render('posts', { posts })
    //  })
    //  .catch(err => console.log(err))

});

router.put('/addLike', (req,res) => {
    let id = req.body.postId;
    //UPDATE development.posts SET likes = likes+1 WHERE id = post_id;
    Post.sequelize
      .query('UPDATE development.posts SET likes = likes+1 WHERE id =' +id)
      .then(posts => {
        res.render('posts', { posts })
      })
      .catch(err => console.log(err));
});

router.get('/getEventTypes', (req,res) => {
    console.log('inside get event types')
    let types = [];
    db.query("SELECT * FROM development.`event-types`", {
        model: EventType,
        mapToModel: true   
    })
        .then(result => {
            for(let i = 0; i < result.length; i++){
                types.push(result[i].dataValues)
            }
            res.send(types)
        })
        .catch(err => console.log(err))
})

router.post('/saveImage', (req,res) => {
    console.log('that tickled')
    let image = "";
    let form = new formidable.IncomingForm({
        uploadDir: __dirname + '/tmp',
        keepExtensions: true
    });
    let path = "";
    form.parse(req, function(err, fields, files) {
        if(err) throw err;
        console.log(files.file)
        path = files.file.path;
        imgur.setClientId(key);
        //put in .env
        imgur.setCredentials('djg365@drexel.edu', 'testing123', key)
        imgur.setAPIUrl("https://api.imgur.com/3/");

        imgur.uploadFile(path)
            .then((json) => { 
                image = json.data.link;
                console.log(image);
                req.session.image = image;
                fs.unlinkSync(path);
                res.send(image);
            })
            .catch(err => console.log("failed to upload" + err));
    });
   

});

//export the router
module.exports = router;
