const express = require('express');
const exphb = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
var helpers = require('handlebars-helpers')();
var passport = require('passport');
var session = require('express-session');

const db = require('./config/database')

//connect to DB
db.authenticate()
    .then(() => console.log('Database connected!'))
    .catch((err) => console.log(err))

const app = express();

//for passport (ignore)
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//set view engine to be handlebars
//default page layout will be 'main.handlebars'
app.engine('handlebars', exphb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//bodyParser setup
app.use(bodyParser.urlencoded({extended: false}))

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//index route
app.get('/', (req,res) => res.render('index', { layout: 'landing' }));

//this doesn't do anything besides destroy the session
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});

//routes
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

//start on port 5000 or on whichever port the server allows
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));