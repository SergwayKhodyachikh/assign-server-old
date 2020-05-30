const { Sequelize } = require('sequelize');
const { database, env } = require('./env');
const { query } = require('../util/log');

// sequelize database connection configuration
module.exports = new Sequelize(...Object.values(database), {
  dialect: 'postgres',
  logging: env.isDev ? query : false,
  define: {
    underscored: true,
  },
});
