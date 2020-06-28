const express = require('express');
const path = require('path');
const cors = require('cors');
const { PORT } = require('./config/env');
const { failure, success } = require('./util/log');
const routes = require('./routes');
const database = require('./config/database');
const errorHandler = require('./middleware/errorHandle');
const notFound = require('./routes/notFound');

const MAX_BYTES = 52428800;

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

const app = express();

module.exports = (async () => {
  await database(); // database initialize
  app.use(express.json({ limit: MAX_BYTES })); // json body parser
  app.use(express.static(path.join(__dirname, 'public'))); // static files parser
  app.use(
    cors({
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Type', 'Authorization'],
    })
  ); // allow cors origin
  app.options('*', cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
  })); // allow cors origin for option request
  app.use('/api/v1', routes); // rest api routes
  app.use('*', notFound); // page not found error handler
  app.use(errorHandler); // error handler

  return app.listen(PORT, () => success(`listening on port ${PORT}`));
})();
