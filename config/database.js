const Sequelize = require('sequelize');

//connect to sql
//this will eventually be a environment variable
module.exports = new Sequelize('promos', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});