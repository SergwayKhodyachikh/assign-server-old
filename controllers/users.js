const _ = require('lodash');
const passport = require('passport');
const User = require('../models/user');
const ServerError = require('../utils/ServerError');
const { facebookOptions } = require('../config/env');

exports.createUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) throw new ServerError('the email address already in use', 400);

    user = await User.create(req.body);

    const token = user.generateAuthToken();

    res
      .header('Authorization', token)
      .status(201)
      .send({ status: 'success', token, user: _.pick(user, ['id', 'name', 'email']) });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'email', 'name'] });

    if (!user) throw new ServerError('the user with the given Id was not found', 404);

    res.send({ status: 'success', user });
  } catch (err) {
    next(err);
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) throw new ServerError('invalid credentials', 400);

    const validPassword = await user.comparePassword(req.body.password);
    if (!validPassword) throw new ServerError('invalid credentials', 400);
    const token = user.generateAuthToken();

    res
      .header('Authorization', token)
      .send({ status: 'success', token, user: _.pick(user, ['id', 'name', 'email']) });
  } catch (err) {
    next(err);
  }
};

exports.authenticateGoogleOauth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

exports.authenticateFacebookOauth = passport.authenticate('facebook', {
  scope: ['public_profile', 'email'],
  successRedirect: facebookOptions.callbackURL,
  session: false,
});

exports.oauthSuccessCallback = (req, res) => {
  const token = req.user.generateAuthToken();
  const emitCurrentUser = req.app.get('emit_current_user');

  emitCurrentUser('OAUTH_AUTH', {
    token,
    user: _.pick(req.user, ['id', 'name', 'email']),
  });
  res.send('<script>window.close();</script>');
};
