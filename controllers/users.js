const _ = require('lodash');
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

exports.getCurrentUser = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'email', 'name'] });

  if (!user) throw new ServerError('the user with the given Id was not found', 404);

  res.send({ status: 'success', user });
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
