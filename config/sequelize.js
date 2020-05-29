const { Sequelize } = require('sequelize');
const { database, env } = require('./env');
const { success, failure, query } = require('../util/log');

// sequelize database connection configuration
module.exports = async () => {
  try {
    const sequelize = new Sequelize(...Object.values(database), {
      dialect: 'postgres',
      logging: env.isDev ? query : false,
      define: {
        underscored: true,
      },
    });

    await sequelize.authenticate();

    success('database connection established');

    return sequelize;
  } catch (err) {
    failure('database connection failed\n', err);
    process.exit(1);
  }
};
