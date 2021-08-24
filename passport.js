const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.Users,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJWT;

// basic HTTP authentication for login requests
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password' 
}, (username, password, callback) => {
        console.log(username + ' ' + password);
        Users.findOne({ Username: username }, (error, user) => {
            if(error) {
                console.log(error);
                return callback(error);
            }
            if(!user) {
                console.log('incorrect username');
                return(null, false, {message: 'Incorrect username or password.'});
            }
            console.log('finished');
            return callback(null, user);
        });
    }
));

// JWT Strategy (for any request after login)
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));