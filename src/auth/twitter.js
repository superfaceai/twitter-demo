const TwitterStrategy = require('@superfaceai/passport-twitter-oauth2');
const { createVerifyCallback } = require('../utils');

module.exports = function () {
  return new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
      clientType: 'private',
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
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
      const existingUser = req.user || {};

      // To keep the example simple, the user's profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the provider's account with a user record in your database,
      // and return that user instead.
      return done(null, {
        ...existingUser,
        displayName: profile.displayName,
        [provider]: { profile, accessToken, refreshToken },
      });
    }
  );
};
