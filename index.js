require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const ejsLayouts = require('express-ejs-layouts');
const bodyparser = require('body-parser');
const session = require('express-session'); 
const flash = require('connect-flash');
const passport = require('./config/passportConfig');
const isLoggedIn = require('./middleware/isLoggedIn');

const app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));
app.use(favicon(path.join(__dirname + '/public/favicon.ico')));

app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next) => {
	//before every route, attach the flash messages
	//and current user to res.locals
	res.locals.alerts = req.flash();
	res.locals.currentUser = req.user;
	next();
});

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/test', (req, res) => {
    res.send({
        test: "string",
        data: {
            look: 'it is working'
        }
    })
})

app.get('/session-test', isLoggedIn, (req, res) => {
    res.send({
        test: "string",
        data: {
            look: 'it is working',
            isLoggedIn: isLoggedIn
        }
    })
})

app.post('/', async (req, res) => {
    const username = req.body.username.trim();
    const token = req.body['g-recaptcha-response'];
    const recaptchaPassed = await didTheyPass(token);

    if (!recaptchaPassed) {
        res.redirect('/failure?error=2')
    }

    const isUserValid = await isUsernameValid(username);

    if (!isUserValid) {
        res.redirect('/failure?error=3')
    };

    const spam = await isItSpam(username);

    if (spam) {
        res.redirect('/failure?error=1')
    } else {
        res.redirect('/success?username=' + username)
    }
});

app.get('/success', async (req, res) => {
    const username = req.query.username;
    const link = process.env.ENVIRONMENT !== "dev" ? await getTweetLink(username) : '/yeet';
    res.render('success', { username, link });
})

app.get('/failure', (req, res) => res.render('failure', { error: errorMessages[req.query.error] }))

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;