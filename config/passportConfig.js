var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

// Passport "serializes" objects to make them easy 
//to store by converting the user to an identifier.
//to do this: (cb is callback)
passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

// Passport "deserializes" objects by taking the user's
// serialization id and looking it up in the database.
passport.deserializeUser((id, cb) => 
	db.User.findOne({
        where: { id }
    }).then(user => {
		cb(null, user);
    }).catch(cb));

// Set up the local auth strategy 
passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, (username, password, cb) => {
	db.User.findOne({
		where: { username }
	}).then(user => {
        // if successfully log in, returns and stores the user that has logged in in the session
        !user || !user.validPassword(password) ? cb(null, false) : cb(null, user)
        
        // if error, call callback which moves the app forward
	}).catch(cb);
}));

module.exports = passport;