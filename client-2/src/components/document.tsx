import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { EventEmitter } from 'events';
import { TextArea } from '@thumbtack/thumbprint-react';
import { useParams } from 'react-router-dom';
import config from '../config';

import { Document, CreateOp, GetChanges } from '../lib';

const eventEmitter = new EventEmitter();


export default function DocumentView () {

  const params : any = useParams();
  const docId = params.docId;

  const url = config.url;

  const [document, setDocument] = useState(new Document([]));
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(false);

  // load a document
  const loadDoc = (ops : any) => {
    const opList = [];
    for (const op of ops) {
      opList.push(CreateOp(op));
    }
    setDocument(new Document(opList));
  }

  // register confirmed op
  const registerConfirmed = (op : any) => {
    console.log('Register confirmed');
    const operation = CreateOp(op);
    document.addConfirmedOp(operation, op.index);
  }

  // socket connection
  useEffect(() : any => {
    console.log('Setting up sockets');
    const socket = socketIOClient(url, { transports : ['websocket'] });
    console.log('Sockets connected.')
    socket.emit('loadDoc', { docId: docId });

    socket.on('fullDoc', (ops : any) => {
      loadDoc(ops);
    });

    socket.on('new-op', (op) => {
      registerConfirmed(op);
    });

    socket.on('op-acknowledged', () => { 
      setWaiting(false);
    })

    eventEmitter.on('local-op', (opInfo) => {
      socket.emit('operation', opInfo);
    });

    // eventEmitter.on('local-text-change', updateTextArea);

    eventEmitter.on('local-ops-change', sendLocalOp);


    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    sendLocalOp();
  }, [waiting]);

  // send local ops to server
  const sendLocalOp = () => {
    console.log('Sending Local Ops');
    if (!waiting && document.localOps.length > 0) {
      setWaiting(true);
      const opInfo : any = document.pullLocalOp();
      opInfo.docId = docId;
      eventEmitter.emit('local-op', opInfo);
    }
  }

  useEffect(() => {
    updateTextArea();
  }, []);

  // control textarea
  const updateTextArea = () => {
    console.log('Control Text Area');
    setText(document.localText);
  }


  // local change
  const localChange = (newText : string) => {
    console.log("Local change.");
    const newOps = GetChanges(text, newText);
    for (const op of newOps) {
      document.addLocalOp(op);
    }
    updateTextArea();
  }


  return (
    <div>
      <h1>Document</h1>
      <form>
        <TextArea value={text} onChange={v => localChange(v)} />
      </form>
    </div>
  )
}