const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const express = require('express');
const path = require('path');
const cors = require('cors');
const { PORT, clientUrl } = require('./config/env');
const { failure, success } = require('./utils/log');
const routes = require('./routes');
const database = require('./config/database');
const errorHandler = require('./middleware/errorHandle');
const notFound = require('./routes/notFound');
const passportService = require('./services/passport');

const MAX_BYTES = 52428800;

const CORS_OPTIONS = {
  origin: clientUrl,
  exposedHeaders: ['Content-Type', 'Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

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

io.on('connect', socket => {
  app.set('emit_current_user', (event, payload) => {
    socket.emit(event, { type: event, payload });
  });
});

module.exports = (async () => {
  await database(); // database initialize
  passportService(app); // setup passport service
  app.use(express.json({ limit: MAX_BYTES })); // json body parser
  app.use(express.static(path.join(__dirname, 'public'))); // static files parser
  app.use(cors(CORS_OPTIONS)); // allow cors origin
  app.options('*', cors(CORS_OPTIONS)); // allow cors origin for option request
  app.use('/api/v1', routes); // rest api routes
  app.use('*', notFound); // page not found error handler
  app.use(errorHandler); // error handler

  return server.listen(PORT, () => success(`listening on port ${PORT}`));
})();
