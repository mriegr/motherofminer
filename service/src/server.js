const app = require('./app');
const debug = require('debug')('server:server');
const http = require('http');
const mongoose = require('mongoose');
const CONFIG = require('./config');

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
    default:
      throw error;
  }
}

mongoose.connect(`mongodb://${CONFIG.db.host}/${CONFIG.db.name}`).then(
  () => {
    console.log(
      `${new Date().getTime()
        } - DB connection has been established successfully.`
    );
    const server = http.createServer(app);
    server.on('error', onError);
    server.on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string' ? `Pipe ${port}` : `Port ${port}`;
      debug(`Listening on ${bind}`);
    });
    return server.listen(port, () => {
      console.log(`api listening on port ${port}`);
    });
  },
  (err) => {
    console.error(
      `${new Date().getTime()} - Unable to connect to the database: `,
      err
    );
    process.exit(3);
  }
);
