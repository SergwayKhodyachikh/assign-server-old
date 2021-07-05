require('dotenv').config({ debug: true });
const crypto = require('crypto');

const randomKey = crypto.randomBytes(32).toString('hex');

const {
  NODE_ENV,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CLIENT_BASE_URL,
  SECRET_KEY,
} = process.env;

const PORT = process.env.PORT || 5000;

const clientUrl = CLIENT_BASE_URL || 'http://localhost:3000';

const APP_SECRET_KEY = SECRET_KEY || randomKey;

const env = {
  isDev: !NODE_ENV || NODE_ENV === 'development',
  isTest: NODE_ENV === 'test',
  isProd: NODE_ENV === 'production',
};

const databaseName = DATABASE_NAME || 'assign-old';

const database = {
  database: env.isTest ? `${databaseName}-test` : databaseName,
  username: DATABASE_USERNAME || 'postgres',
  password: DATABASE_PASSWORD || 'postgres',
};

const databaseHost = DATABASE_HOST;

const googleOptions = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/v1/users/google/callback',
};

const facebookOptions = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/api/v1/users/facebook/callback',
  profileFields: ['emails', 'name'],
};

const githubOptions = {
  clientID: process.env.GITHUB_KEY,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: '/api/v1/users/github/callback',
  scope: [ 'user:email' ]
};

module.exports = {
  env,
  database,
  databaseHost,
  NODE_ENV,
  PORT,
  APP_SECRET_KEY,
  googleOptions,
  facebookOptions,
  githubOptions,
  clientUrl,
};
