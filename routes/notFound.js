const ServerError = require('../util/ServerError');

module.exports = (req, res, next) => {
  next(new ServerError(`can't find ${req.originalUrl} on this server`, 404));
};
