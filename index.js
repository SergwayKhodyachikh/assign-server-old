const app = require('express')();
const { PORT } = require('./config/env');
const { failure, success } = require('./util/log');

/**
 * log the error description and exit the application
 * @param ex error description
 */
const handleEx = ex => {
  failure(ex);
  process.exit(1);
};

process.on('uncaughtException', handleEx);
process.on('unhandledRejection', handleEx);

module.exports = (async () => {
  await require('./config/sequelize')();

  return app.listen(PORT, () => success(`listening on port ${PORT}`));
})();
