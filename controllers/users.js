const _ = require('lodash');
const User = require('../models/user');
const ServerError = require('../util/ServerError');

exports.createUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) throw new ServerError('the email address already in use');

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
