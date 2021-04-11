import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { EventEmitter } from 'events';

import { getDocIds } from '../../lib/files';
import { Document, CreateOp, GetChanges } from '../../lib';


const eventEmitter = new EventEmitter();


export default function DocumentView ({ docId, url }) {

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
    const socket = socketIOClient(url);
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


    return () => socket.disconnect();
  }, []);

  // send local ops to server
  useEffect(() => {
    console.log('Sending Local Ops');
    if (!waiting && document.localOps.length > 0) {
      setWaiting(true);
      const opInfo : any = document.pullLocalOp();
      opInfo.docId = docId;
      eventEmitter.emit('local-op', opInfo);
    }
  }, [document.localOps, waiting]);

  // control textarea
  useEffect(() => {
    console.log('Control Text Area');
    setText(document.localText);
  }, [document.localText, ])


  // local change
  const localChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Local Change');
    const newText = e.target.value;
    const newOps = GetChanges(text, newText);
    for (const op of newOps) {
      document.addLocalOp(op);
    }
  }


  return (
    <div>
      <h1>Document</h1>
      <form>
        <textarea value={text} onChange={localChange} />
      </form>

      <h1>Bottom</h1>
    </div>
  )
}

export async function getStaticPaths() {
  const docIds = await getDocIds();
  const paths = docIds.map((docId) => {
    return {
      params: {
        docId: docId
      }
    }
  });
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const docId = params.docId;
  const url = process.env.API_URL;
  return {
    props: {
      docId,
      url
    }
  }

}