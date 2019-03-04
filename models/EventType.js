const Sequelize = require('sequelize');
const db = require('../config/database')
//Model for a post
const EventType = db.define('type', {
    type:{
        type: Sequelize.STRING
    }
})

module.exports = EventType;