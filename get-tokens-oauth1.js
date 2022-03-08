const util = require('util');
const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');
const session = require('express-session');

const EXIT_ON_SUCCESS = true;

require('dotenv').config();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

function onAuthSuccess(payload) {
  if (process.stdout.isTTY) {
    console.error(`\nPaste this into "tokens.json" file:`);
  }
  console.log(JSON.stringify(payload));
  if (EXIT_ON_SUCCESS) {
    setTimeout(() => {
      process.exit();
    }, 1000);
  }
}

//Use the Twitter OAuth2 strategy within Passport.
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
    },
    (token, tokenSecret, profile, done) => {
      onAuthSuccess({ token, tokenSecret });
      return done(null, {
        displayName: profile.displayName,
      });
    }
  )
);

const app = express();

app.use(passport.initialize());
app.use(
  session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
);

app.get('/', function (req, res) {
  res.redirect('/auth/twitter');
});

app.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    state: false,
  })
);

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/error?login' }),
  function (req, res) {
    res.end(
      '<h1>Authentication succeeded</h1>See the console for the initial access and refresh tokens.<br>You can close this page.'
    );
  }
);

app.get('/error', (req, res, next) => {
  next(new Error('Login failure'));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.end(
    `<h1>Error</h1><pre>${util.format(err)}</pre><a href='/'>Try again?</a>`
  );
});

app.listen(3000, () => {
  console.error(`👉 Visit ${process.env.BASE_URL}`);
});
