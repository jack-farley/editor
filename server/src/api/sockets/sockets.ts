import { Application } from 'express';
import { Socket } from 'socket.io';
import { Container } from 'typedi';

import { DocumentService } from '../../services';
import { InsertOp, DeleteOp, OpType } from '../../operations';


const sockets = (app : Application) => {

  const http = require('http').Server(app);
  const io = require('socket.io')(http);


  io.on('connection', function(socket: Socket) {
    console.log('A user connected.');

    // load document
    io.on('loadDoc', function (data: any) {
      const docId = data.docId;
  
      const DocumentServiceInstance = Container.get(DocumentService);
      const ops = DocumentServiceInstance.loadDoc(docId);
  
      io.to(socket.id).emit('fullDoc', {ops: ops});
    });

    // operation event
    io.on('operation', async function (data: any) {
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
        io.to(socket.id).emit('acknowledge-op', {addedOps: addedOps});
      }
  
      // delete op
      else if (data.type === OpType.DeleteOp) {
        const location = data.location;
        const length = data.length;
  
        const op = new DeleteOp(index, location, length);
  
        const DocumentServiceInstance = Container.get(DocumentService);
        const addedOps = await DocumentServiceInstance.pushClientOp(docId, op);

        // send back the ops that were added
        io.to(socket.id).emit('op-added', {addedOps: addedOps});
      }

      // acknowledge
      io.to(socket.id).emit('op-denied');
    });



    socket.on('disconnect', function () {
      console.log('A user disconnected.');
    });
  });
}

export default sockets;