import { Application } from 'express';
import { Socket } from 'socket.io';
import { Container } from 'typedi';
import { EventEmitter } from 'events';
import { Logger } from 'winston';

import { DocumentService } from '../../services';
import { InsertOp, DeleteOp, OpType } from '../../operations';


const sockets = (app : Application) => {

  const logger : Logger = Container.get('logger');

  const http = require('http').Server(app);
  const io = require('socket.io')(http);


  io.on('connection', (socket: Socket) => {
    logger.info('A use connected.');

    let currentDocId : string;

    // load document
    io.on('loadDoc', (data: any) => {
      logger.info('A user requested to load a document.');

      const docId = data.docId;
      currentDocId = docId;

      const DocumentServiceInstance = Container.get(DocumentService);
      const ops = DocumentServiceInstance.loadDoc(docId);

      io.to(socket.id).emit('fullDoc', ops);
    });

    // operation event
    io.on('operation', async (data: any) => {
      logger.info('A user sent an operation.');

      const docId = data.docId;
      const index = data.index;

      // insert op
      if (data.type === OpType.InsertOp) {
        const location = data.location;
        const text = data.text;

        const op = new InsertOp(index, location, text);

        const DocumentServiceInstance = Container.get(DocumentService);
        const addedOps = await DocumentServiceInstance.pushClientOp(docId, op);

        // send back the ops that were added
        io.to(socket.id).emit('op-acknowledged');
      }

      // delete op
      else if (data.type === OpType.DeleteOp) {
        const location = data.location;
        const length = data.length;

        const op = new DeleteOp(index, location, length);

        const DocumentServiceInstance = Container.get(DocumentService);
        const addedOps = await DocumentServiceInstance.pushClientOp(docId, op);

        // send back the ops that were added
        io.to(socket.id).emit('op-acknowledged');
      }

      // acknowledge
      io.to(socket.id).emit('op-denied');
    });



    // listen for new ops
    const eventEmitter = new EventEmitter();

    eventEmitter.on('new_op', (data: any) => {
      logger.info('A new event has been registered.');

      if (data.docId === currentDocId) {
        io.to(socket.id).emit('new-op', data.op);
      }
    });


    socket.on('disconnect', () => {
      logger.info('A user diconnected.');
    });
  });
}

export default sockets;