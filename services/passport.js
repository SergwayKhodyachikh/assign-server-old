const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const { APP_SECRET_KEY, google, facebook } = require('../config/env');

module.exports = app => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
      done(null, user);
    });
  });

// const LocalStrategy = require('passport-local').Strategy;
  // passport.use(
  //   new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  //     try {
  //       // verifyUser
  //       const user = await User.findOne({ where: { email } });
  //       if (!user) return done(null, false);
  //       // verifyPassword
  //       const isMatch = await user.comparePassword(password);
  //       return isMatch ? done(null, user) : done(null, false);
  //     } catch (err) {
  //       return done(err);
  //     }
  //   })
  // );

  /**
   * get object name with the givenName and familyName concatenate them and return a string of a full name
   * @param {object} name object name with the givenName and familyName string properties
   * @returns {string} concatenated string of the givenName and familyName properties
   * @default name return 'unknown' string if the name obj is missing fields
   * @function
   */
  const convertNameFromObjToString = name =>
    name.givenName && name.familyName ? `${name.givenName} ${name.familyName}` : 'Unknown';

  /**
   * extract the email and name nested properties from the profile object modify and return them as strings properties
   * @param {object} profile object with email arr and name obj properties
   * @returns {object} return an object with string properties: name and email.
   * @function
   */
  const extractProfileInfo = profile => {
    const email = profile.emails[0].value;
    const name = convertNameFromObjToString(profile.name);

    return { email, name };
  };

  /**
   * receive name and email strings and insert a new User instance into the database
   * @param {string} name
   * @param {string} email
   * @returns return user model instance.
   * @function
   */
  const createNewUser = async (name, email) => {
    const user = User.build({ name, email });
    await user.save();
    return user;
  };

  /**
   * handle oAuth success authentication
   * @param {string} accessToken
   * @param {any} refreshToken
   * @param {object} profile
   * @param {Function} done
   * @function
   */
  const handleOauth = async (accessToken, refreshToken, profile, done) => {
    const { email, name } = extractProfileInfo(profile);

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    const user = await createNewUser(name, email);
    done(null, user);
  };

  passport.use(
    new GoogleStrategy(
      {
        clientID: google.clientID,
        clientSecret: google.clientSecret,
        callbackURL: google.callbackURL,
      },
      handleOauth
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: facebook.clientID,
        clientSecret: facebook.clientSecret,
        callbackURL: facebook.callbackURL,
        profileFields: ['id', 'emails', 'name'],
      },
      handleOauth
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
      keys: [APP_SECRET_KEY],
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
