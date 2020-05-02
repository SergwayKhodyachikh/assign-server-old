const { database } = require('./env');

// sequelize-cli database connection configuration
const connection = {
  ...database,
  dialect: 'postgres',
};

module.exports = {
  development: connection,
  test: connection,
  production: connection,
};
