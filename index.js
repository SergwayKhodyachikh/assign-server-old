// eslint-disable-next-line import/order
const { PORT, clientUrl, env } = require('./config/env');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST']
  }
});
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { failure, success } = require('./utils/log');
const routes = require('./routes');
const database = require('./config/database');
const errorHandler = require('./middleware/errorHandle');
const notFound = require('./routes/notFound');
const passportService = require('./services/passport');

const MAX_BYTES = 52428800;

const CORS_OPTIONS = {
  origin: clientUrl,
  exposedHeaders: ['Content-Type', 'Authorization', 'socketId'],
  allowedHeaders: ['Content-Type', 'Authorization', 'socketId'],
  credentials: true
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

app.set('io', io);

// io.on('connect', socket => {
//   app.set('emit_current_user', (event, payload) => {
//     io.to(app.get('socketId')).emit(event, { type: event, payload });
//   });
// });

module.exports = (async () => {
  await database(); // database initialize
  passportService(app); // setup passport service
  if (env.isDev) app.use(morgan('dev')); // setup morgan logger
  app.use(express.json({ limit: MAX_BYTES })); // json body parser
  app.use(express.static(path.join(__dirname, 'public'))); // static files parser
  app.use(cors(CORS_OPTIONS)); // allow cors origin
  app.options('*', cors(CORS_OPTIONS)); // allow cors origin for option request
  app.use('/api/v1', routes); // rest api routes
  app.use('*', notFound); // page not found error handler
  app.use(errorHandler); // error handler

  return server.listen(PORT, () => success(`listening on port ${PORT}`));
})();
