const Sequelize = require('sequelize');
//db url
//CLEARDB_DATABASE_URL: mysql://b9a7e88e2bf1f2:3d95f38b@us-cdbr-iron-east-03.cleardb.net/heroku_77d9ccd35541c17?reconnect=true
//clear db: heroku_77d9ccd35541c17, b9a7e88e2bf1f2, 3d95f38b
//us-cdbr-iron-east-03.cleardb.net

//aws url: 

//connect to sql
//this will eventually be a environment variable
module.exports = new Sequelize('development', 'admin', 'admin123', {
    host: 'promos.ci8ounq43brm.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

//local

// module.exports = new Sequelize('promos', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
//     operatorsAliases: false,
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });