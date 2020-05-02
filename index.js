const app = require('express')();
const { PORT } = require('./config/env');

const handleError = err => {
  console.log(err);
  process(1)
};

process.on('uncaughtException', ex => console.log(ex));
process.on('unhandledRejection', err => console.log(err));

module.exports = (async () => {
  await require('./config/sequelize')();

  return app.listen(PORT, () => console.log(`listening on port ${chalk.green(PORT)}`));
})();
