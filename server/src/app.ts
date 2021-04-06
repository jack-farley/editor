import express from 'express';
import config from './config';

async function startServer() {
  const app = express();

  // start the server
  app.listen(config.port, () => {

    console.log( `Server listening on port: ${ config.port }` );

  }).on('error', err => {
    process.exit(1);
  });
}

startServer();