import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { TextArea } from '@thumbtack/thumbprint-react';
import { EventEmitter } from 'events';

import { getDocIds } from '../../lib/files';
import getConfig from 'next/config';
import { Document, CreateOp, GetChanges } from '../../lib';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const endpoint = serverRuntimeConfig.backendApi;
const eventEmitter = new EventEmitter();


export default function DocumentView ({ docId }) {

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
    const operation = CreateOp(op);
    document.addConfirmedOp(operation, op.index);
  }

  // socket connection
  useEffect(() : any => {
    const socket = socketIOClient(endpoint);
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


    return () => socket.disconnect();
  }, []);

  // send local ops to server
  useEffect(() => {
    if (!waiting && document.localOps.length > 0) {
      setWaiting(true);
      const opInfo : any = document.pullLocalOp();
      opInfo.docId = docId;
      eventEmitter.emit('local-op', opInfo);
    }
  }, [document.localOps, waiting]);

  // control textarea
  useEffect(() => {
    setText(document.localText);
  }, [document.localText, ])


  // local change
  const localChange = (newText : string) => {
    const newOps = GetChanges(text, newText);
    for (const op of newOps) {
      document.addLocalOp(op);
    }
  }


  return (
    <div>
      <h1>Document</h1>

      <TextArea 
        value={text}
        onChange={v => localChange(v)}
      />
    </div>
  )
}

export async function getStaticPaths() {
  const paths = getDocIds();
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const docId = params.docId;
  return {
    props: {
      docId
    }
  }

}