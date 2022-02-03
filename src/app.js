require('dotenv').config();

const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const buildTwitterStrategy = require('./auth/twitter');

const { ensureAuthenticated } = require('./utils');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

//Use the Twitter OAuth2 strategy within Passport.
if (process.env.TWITTER_CLIENT_ID) {
  passport.use(buildTwitterStrategy());
}

const app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: 'views/layout.ejs' });
app.use(expressLayouts);
app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
);

// Initialize Passport
app.use(passport.initialize());

// Also use passport.session() middleware, to support persistent login sessions (recommended).
app.use(passport.session());

app.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function (req, res) {
  console.debug(req.user);
  res.render('account', { user: req.user });
});

app.get('/login', function (req, res) {
  res.render('login', { user: req.user });
});

//#region Twitter routes
app.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    scope: ['tweet.read', 'tweet.write', 'users.read', 'follows.read'],
  }),
  function (req, res) {
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  }
);

// GET /auth/twitter/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);
//#endregion

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;
  res.locals.user = req.user;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);
