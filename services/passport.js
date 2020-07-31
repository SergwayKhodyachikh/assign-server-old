const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = app => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
      done(null, user);
    });
  });

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // verifyUser
        const user = await User.findOne({ where: { email } });
        if (!user) return done(null, false);
        // verifyPassword
        const isMatch = await user.comparePassword(password);
        return isMatch ? done(null, user) : done(null, false);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/users/google/callback',
      },
      async (accessToken, refreshToken, { emails, name }, done) => {
        const email = emails[0].value;
        const fullName =
          name.givenName && name.familyName ? `${name.givenName} ${name.familyName}` : 'Unknown';

        const existingUser = await User.findOne({
          where: { email },
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({ email, name: fullName }).save();
        done(null, user);
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/api/v1/users/facebook/callback',
        profileFields: ['id', 'emails', 'name'],
      },
      async (accessToken, refreshToken, { emails, name }, done) => {
        const email = emails[0].value;
        const fullName =
          name.givenName && name.familyName ? `${name.givenName} ${name.familyName}` : 'Unknown';

        const existingUser = await User.findOne({
          where: { email },
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({
          email,
          name: fullName,
        }).save();
        done(null, user);
      }
    )
  );

  app.use(
    cookieSession({
      /* 30 days in total */
      maxAge:
        30 /* days */ *
        24 /* hours */ *
        60 /* minutes */ *
        60 /* seconds */ *
        1000 /* milliseconds */,
      keys: [process.env.COOKIE_KEY],
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
