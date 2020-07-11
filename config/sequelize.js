const { Sequelize } = require('sequelize');
const { database, env, databaseHost } = require('./env');
const { query } = require('../utils/log');

// sequelize database connection configuration
module.exports = new Sequelize(...Object.values(database), {
  host: databaseHost,
  dialect: 'postgres',
  logging: env.isProd ? false : query,
  define: {
    underscored: true,
  },
});
