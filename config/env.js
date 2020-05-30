require('dotenv').config({ debug: true });
const crypto = require('crypto');

const { NODE_ENV, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

const PORT = process.env.PORT || 5000;

const JWT_KEY = process.env.JWT_KEY || crypto.randomBytes(32).toString('hex');

const env = {
  isDev: !NODE_ENV || NODE_ENV === 'development',
  isTest: NODE_ENV === 'test',
  isProd: NODE_ENV === 'production',
};

const database = {
  database: env.isTest ? `${DATABASE_NAME}-test` : DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
};

module.exports = { env, database, NODE_ENV, PORT, JWT_KEY };
