const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ServerError = require('../util/ServerError');
const { JWT_KEY } = require('../config/env');

const verifyJWT = promisify(jwt.verify);
const isBearerAuth = token => /^Bearer /.test(token);
const credentialsError = new ServerError('invalid credentials', 401);

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    // check if the header contain authorization header that contain bearer token
    if (authHeader && isBearerAuth(authHeader)) [, token] = authHeader.split(' ');
    if (!token) throw credentialsError;

    // verify jwt token and user
    const decode = await verifyJWT(token, JWT_KEY);
    const user = await User.findByPk(decode.sub);
    if (!user) throw credentialsError;

    // check if the token was generated after the last time the user details was updated
    if (user.authUserChanged(decode.iat)) throw credentialsError;

    // grant access to protected route
    req.user = user;
  } catch (ex) {
    next(ex);
  }
};
