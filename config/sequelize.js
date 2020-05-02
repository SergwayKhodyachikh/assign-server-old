const { Sequelize } = require('sequelize');
const { cyan, green, red } = require('chalk');
const { database, env } = require('./env');

const { log, error } = console;

const logQuery = query => log(cyan(`\n${query}\n`));

// sequelize database connection configuration
module.exports = async () => {
  try {
    const sequelize = new Sequelize(...Object.values(database), {
      dialect: 'postgres',
      logging: env.isDev ? logQuery : false,
      define: {
        underscored: true,
      },
    });

    await sequelize.authenticate();

    log(green('database connection established'));

    return sequelize;
  } catch (err) {
    error(red('database connection failed\n', err));
    process.exit(1);
  }
};
