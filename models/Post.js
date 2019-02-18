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
    }
})

module.exports = Post;