import 'reflect-metadata'; // for decorators
import express, { Application } from 'express';
import config from './config';
import load from './loaders';


async function setupSockets(app : Application) {

  const server = require('http').Server(app);
  const io = require('socket.io')(server);

}

async function startServer() {
  const app = express();

  // load
  load(app);

  // start the server
  app.listen(config.port, () => {

    console.log( `Server listening on port: ${ config.port }` );

  }).on('error', err => {
    process.exit(1);
  });
}

startServer();