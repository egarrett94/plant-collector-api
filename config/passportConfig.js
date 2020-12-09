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
	db.user.findById(id).then(user => {
		cb(null, user);
	}).catch(cb));

// Set up the local auth strategy 
passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, (username, password, cb) => {
	db.User.find({
		where: { username }
	}).then(user => {
		if(!user || !user.validPassword(password)) {
			cb(null, false);
		} else {
			//if successfully log in, returns the user
			//that has logged in. this is what will be 
			//used to store in our session
			cb(null, user);
		};
		//if any error, then call callback which will
		//push the program to the next thing that the 
		//app is supposed to do
	}).catch(cb);
}));

module.exports = passport;