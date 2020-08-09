const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const User = require('../models/user');
const { googleOptions, facebookOptions, githubOptions } = require('../config/env');

module.exports = app => {
  /**
   * get object name with the givenName and familyName concatenate them and return a string of a full name
   * @param {object} name object name with the givenName and familyName string properties
   * @returns {string} concatenated string of the givenName and familyName properties
   * @default name return 'unknown' string if the name obj is missing fields
   * @function
   */
  const convertNameFromObjToString = name =>
    name && name.givenName && name.familyName ? `${name.givenName} ${name.familyName}` : 'Unknown';

  /**
   * extract the email and name nested properties from the profile object modify and return them as strings properties
   * @param {object} profile object with email arr and name obj properties
   * @returns {object} return an object with string properties: name and email.
   * @function
   */
  const extractProfileInfo = profile => {
    const email = profile.emails[0].value;
    const name = profile.displayName
      ? profile.displayName
      : convertNameFromObjToString(profile.name);

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
  const handleOauth = async (_accessToken, _refreshToken, profile, done) => {
    const { email, name } = extractProfileInfo(profile);

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    const user = await createNewUser(name, email);
    return done(null, user);
  };

  passport.use(new GoogleStrategy(googleOptions, handleOauth));
  // passport.use(new FacebookStrategy(facebookOptions, handleOauth));
  passport.use(new GithubStrategy(githubOptions, handleOauth));
  app.use(passport.initialize());
};
