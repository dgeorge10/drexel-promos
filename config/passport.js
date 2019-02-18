const bcrypt = require('bcrypt-nodejs');

module.exports = function(passport, user){
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false
    }, function(email, password, done){
        User.findOne({
            where:{
                email
            }
        }).then((user) => {
            if(user){
                return done(null, false, { message: "That email is already taken"})
            } else {
                bcrypt.hashSync(password, bcrypt.genSalt(10), null, function(err,hash){ 
                    if(err) throw err;
                    var data = {
                        email,
                        password: hash,
                        password
                    };
                    User.create(data)
                        .then((newUser, created) => {
                            if(!newUser){
                                return done(null, false);
                            }
                            if(newUser){
                                return done(null, newUser)
                            }
                        })
                        .catch(err => console.log(err))
                 });
            }
        })
        .catch(err => console.log(err))
    
    }   
    ));

    //serializing
    passport.serializeUser( (user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser( (id, done) => {
        User.findById(id)
         .then(user => {
            if(user){
                done(null, user);
            }
         })
         .catch(err => console.log(err));
    });

};