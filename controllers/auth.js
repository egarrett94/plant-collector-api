var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router();

router.get('/signup', (req, res) => {
    res.send('signup GET endpoint');
});

router.post('/signup', async (req, res) => {
    console.log(req.body)
    await db.User.findOrCreate({
        where: {username: req.body.username},
        defaults: {
            bio: '',
            password: req.body.password
        }
    }).then(data => {
        const [user, isCreated] = data;

        if (isCreated === true) {
            console.log(`created ${user.username}`)
            passport.authenticate('local', {
                successFlash: 'account created!'
            })
            res.send(`created ${user.username}`)
        } else {
            console.log(`${user.username} already exists`);
            req.flash('error', 'gee this account exists already')
            res.send(`${user.username} already exists`)
        }
    }).catch(error => {
		console.log('error occurred!');
		console.log(error.message);
		req.flash('error', error.message);
		res.status(401);
	});
})

router.get('/login', (req, res) => {
    res.send('login GET endpoint');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log({err, user, info})
        if (err) { return next(err); }
        if (!user) { return res.send("could not log you in!"); }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.send(`logged ${user.username} in`);
        });
      })(req, res, next);
});

router.get('/logout', (req,res) => {
    req.logout();
    res.send('logged out!')
});

module.exports = router;