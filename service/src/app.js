const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const routeDownloads = require('./routes/downloads');

const app = express();

app.set('trust proxy', 'loopback');

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', routeDownloads);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  // const message = req.app.get('env') === 'development' ? err : {};
  const message = err;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    status: 'error',
    message: err.message,
  });
});
/* eslint-enable no-unused-vars */

module.exports = app;
