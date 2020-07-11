const ServerError = require('../util/ServerError');

module.exports = (req, res, next) => {
  const url = /\?/.test(req.originalUrl) ? req.originalUrl.split('?')[0] : req.originalUrl;

  next(new ServerError(`can't find ${url} on this server`, 404));
};
