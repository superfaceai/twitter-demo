require('dotenv').config();

const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('@superfaceai/passport-twitter-oauth2');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

//Use the Twitter OAuth2 strategy within Passport.
passport.use(
  new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
      clientType: 'private',
    },
    (accessToken, refreshToken, profile, done) => {
      if (!done) {
        throw new TypeError(
          'Missing req in verifyCallback; did you enable passReqToCallback in your strategy?'
        );
      }
      const provider = profile.provider;
      if (!provider) {
        throw new TypeError('Missing strategy provider name');
      }
      console.log('verifyCallback', {
        provider,
        accessToken,
        refreshToken,
        profile,
      });

      // To keep the example simple, the user's profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the provider's account with a user record in your database,
      // and return that user instead.
      return done(null, {
        displayName: profile.displayName,
      });
    }
  )
);

const app = express();

app.use(passport.initialize());

app.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    scope: ['tweet.read', 'tweet.write', 'users.read', 'follows.read'],
  })
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
