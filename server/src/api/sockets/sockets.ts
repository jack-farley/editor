import { Application } from 'express';
import { Socket } from 'socket.io';
import { Container } from 'typedi';
import { Logger } from 'winston';
import http from 'http';

import eventEmitter from '../../loaders/events';
import { DocumentService } from '../../services';
import { InsertOp, DeleteOp, OpType } from '../../operations';


const sockets = (server : http.Server) => {

  const logger : Logger = Container.get('logger');

  const io = require('socket.io')(server);


  io.on('connection', (socket: Socket) => {
    logger.info('A user connected.');

    let currentDocId : string;

    // load document
    socket.on('load-doc', (data: any) => {
      logger.info('A user requested to load a document.');

      const docId = data.docId;
      currentDocId = docId;
      logger.info(docId);

      const DocumentServiceInstance = Container.get(DocumentService);
      DocumentServiceInstance.loadDoc(docId).then((ops) => {
        logger.info(ops);
        socket.emit('full-doc', ops);
        logger.info('Sent full document.');
      }).catch((err) => {
        logger.error(err);
      });
    });

    // operation event
    socket.on('operation', (data: any) => {
      logger.info('A user sent an operation.');
      logger.info(data);

      const docId = data.docId;
      const index = data.index;

      // insert op
      if (data.type === OpType.InsertOp) {
        const location = data.location;
        const text = data.text;

        const op = new InsertOp(socket.id, index, location, text, true);

        const DocumentServiceInstance = Container.get(DocumentService);
        DocumentServiceInstance.pushClientOp(docId, op).then((ops) => {
          // send back the ops that were added
          socket.emit('op-acknowledged', ops);
          logger.info('Send Acknowledgement.');
        }).catch((err) => {
          logger.error(err);
        });
      }

      // delete op
      else if (data.type === OpType.DeleteOp) {
        const location = data.location;
        const length = data.length;

        const op = new DeleteOp(socket.id, index, location, length, true);

        const DocumentServiceInstance = Container.get(DocumentService);
        DocumentServiceInstance.pushClientOp(docId, op).then((ops) => {
          // send back the ops that were added
          socket.emit('op-acknowledged', ops);
          logger.info('Sent Acknowledgement.')
        }).catch((err) => {
          logger.error(err);
        });
      }

      else {
        // acknowledge
        logger.error('Op Denied');
        socket.emit('op-denied');
      }
    });



    // listen for new ops

    eventEmitter.on('new-op', (data: any) => {
      logger.info('A new event has been registered.');

      if (data.docId === currentDocId) {
        logger.info('Sending new op.');
        logger.info(data.op);
        socket.emit('new-op', data.op);
      }
    });


    socket.on('disconnect', () => {
      socket.disconnect();
      logger.info('A user diconnected.');
      eventEmitter.removeAllListeners();
    });
  });
}

export default sockets;