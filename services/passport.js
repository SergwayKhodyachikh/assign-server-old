// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth2').Strategy;
// const User = require('../models/user');
// const { google } = require('../config/env');

// module.exports = app => {
//   passport.serializeUser();

//   passport.deserializeUser();

//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: google.GOOGLE_CLIENT_ID,
//         clientSecret: google.GOOGLE_CLIENT_SECRET,
//         callbackURL: google.callbackURL,
//       },
//       async (accessToken, refreshToken, data, done) => {
//         console.log(accessToken);
//       }
//     )
//   );
// };
