const _ = require('lodash');
const passport = require('passport');
const User = require('../models/user');
const ServerError = require('../utils/ServerError');

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

exports.saveCurrentUserSocketConnection = (req, res, next) => {
  req.app.set('socketId', req.headers.cookie.split('=')[1]);
  next();
};

exports.authenticateGoogleOauth = (req, res, next) =>
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: req.query.socketId
  })(req, res, next);

// exports.authenticateFacebookOauth = passport.authenticate('facebook', {
//   scope: ['public_profile', 'email'],
//   session: false,
// });

exports.authenticateGithubOauth = (req, res, next) =>
  passport.authenticate('github', {
    session: false,
    state: req.query.socketId
  })(req, res, next);

exports.oauthSuccessCallback = (req, res) => {
  // generate user jwt token (the function in the model)
  const token = req.user.generateAuthToken();
  req.app
    // get the socket io client
    .get('io')
    // set the socket io
    .to(req.query.state)
    // emit an event with type and payload to the client
    .emit('OAUTH_AUTH', {
      type: 'OAUTH_AUTH',
      payload: { token, user: _.pick(req.user, ['id', 'name', 'email']) }
    });
  // close the popup window on the client side
  res.send('<script>window.close();</script>');
};
