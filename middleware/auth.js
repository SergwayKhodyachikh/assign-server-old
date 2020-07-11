const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ServerError = require('../utils/ServerError');
const { JWT_KEY } = require('../config/env');

const verifyJWT = promisify(jwt.verify);
const isBearerAuth = token => /^Bearer /.test(token);

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    // check if the header contain authorization header that contain bearer token
    if (authHeader && isBearerAuth(authHeader)) [, token] = authHeader.split(' ');
    if (!token) throw new ServerError('invalid credentials', 401);

    // verify jwt token and user
    const decode = await verifyJWT(token, JWT_KEY).catch(() => {
      throw new ServerError('invalid credentials', 401);
    });
    const user = await User.findByPk(decode.sub);
    if (!user) throw new ServerError('invalid credentials', 401);

    // check if the token was generated after the last time the user details was updated
    if (user.authUserChanged(decode.iat)) throw new ServerError('invalid credentials', 401);

    // grant access to protected route
    req.user = user;
    next();
  } catch (ex) {
    next(ex);
  }
};
