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
} = process.env;

const PORT = process.env.PORT || 5000;

const clientUrl = CLIENT_BASE_URL || 'http://localhost:3000';

const JWT_KEY = process.env.JWT_KEY || randomKey;

const env = {
  isDev: !NODE_ENV || NODE_ENV === 'development',
  isTest: NODE_ENV === 'test',
  isProd: NODE_ENV === 'production',
};

const databaseName = DATABASE_NAME || 'assign';

const database = {
  database: env.isTest ? `${databaseName}-test` : databaseName,
  username: DATABASE_USERNAME || 'postgres',
  password: DATABASE_PASSWORD || 'postgres',
};

const databaseHost = DATABASE_HOST;

const google = {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  callbackURL: `${CLIENT_BASE_URL}/api/auth/google/callback`,
};

module.exports = { env, database, databaseHost, NODE_ENV, PORT, JWT_KEY, google, clientUrl };
