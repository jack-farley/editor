import express, { Application, Request, Response } from 'express';
import config from './config';
import { FileSystem } from './files';

const fs = new FileSystem();


async function setupSockets(app : Application) {

  const server = require('http').Server(app);
  const io = require('socket.io')(server);

}

async function setupRoutes(app : Application) {

  // route for getting current documents
  app.get('/', function(req : Request, res : Response) {
    res.send(200).json(JSON.stringify(fs.getDocuments()));
  });

  // route for creating a document
  app.post('/', function(req : Request, res : Response) {

    var name = req.body.name;
    if (!name) name = "New Document";

    var content = req.body.content;
    if (!content) content = "";

    const doc = fs.createDocument(name, content);

    res.send(200).json(JSON.stringify(doc));
  });

}

async function startServer() {
  const app = express();

  setupSockets(app);
  setupRoutes(app);

  // start the server
  app.listen(config.port, () => {

    console.log( `Server listening on port: ${ config.port }` );

  }).on('error', err => {
    process.exit(1);
  });
}

startServer();