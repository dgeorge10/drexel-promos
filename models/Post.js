const Sequelize = require('sequelize');
const db = require('../config/database')
//Model for a post
const Post = db.define('post', {
    title:{
        type: Sequelize.STRING
    },
    content:{
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    event_date: {
        type: Sequelize.DATE
    },
    likes:{
        type: Sequelize.INTEGER
    },
    user_id:{
        type: Sequelize.INTEGER
    },
    username:{
        type: Sequelize.STRING
    },
    youtube: {
        type: Sequelize.STRING
    },
    image_url:{
        type: Sequelize.STRING
    }
})

module.exports = Post;