import 'reflect-metadata'; // for decorators
import express from 'express';
import http from 'http';
import config from './config';
import load from './loaders';

async function startServer() {
  const app = express();

  const server = http.createServer(app);

  // load
  load(app, server);

  // start the server
  server.listen(config.port, () => {

    console.log( `Server listening on port: ${ config.port }` );

  }).on('error', err => {
    process.exit(1);
  });
}

startServer();