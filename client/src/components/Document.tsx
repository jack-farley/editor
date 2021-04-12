import React, { useState, useEffect, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { TextArea } from '@thumbtack/thumbprint-react';
import { useParams } from 'react-router-dom';

import { SocketContext } from '../context/socket';
import { Document, CreateOp, GetChanges } from '../lib';


export default function DocumentView () {

  const params : any = useParams();
  const docId = params.docId;

  const socket : Socket = useContext(SocketContext);

  const [document, setDocument] = useState(new Document([]));
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [localOps, setLocalOps] = useState(0);
  const [textAreaChange, setTextAreaChange] = useState(false);


  // local change
  const localChange = (newText : string) => {
    console.log("Local change.");
    const newOps = GetChanges(text, newText);
    for (const op of newOps) {
      document.addLocalOp(op);
    }
    setTextAreaChange(true);
    setLocalOps(document.localOps.length);
  }

  // update the text area
  useEffect(() => {
    // control textarea
    const updateTextArea = () => {
      console.log('Control Text Area');
      setText(document.localText);
    }

    updateTextArea();
    setTextAreaChange(false);

  }, [textAreaChange, document])

  // load the document
  useEffect(() => {
    console.log('Loading Document.');
    socket.emit('load-doc', { docId: docId });
  }, [socket, docId]);


  // socket connection for loading a document
  useEffect(() => {
    // load a document
    const loadDoc = (ops : any) => {
      console.log('Received loaded document.');
      console.log(ops);
      const opList = [];
      for (const op of ops) {
        opList.push(CreateOp(op));
      }
      console.log(opList);
      setDocument(new Document(opList));
    }

    socket.on('full-doc', loadDoc);
    console.log('Full doc listener set up.');
    // disconnect
    return () => {
      socket.off('full-doc', loadDoc);
    }
  }, [socket]);


  // socket connection for op acknowledgements
  useEffect(() => {
    const opAcknowledged = () => {
      console.log('Op Acknowledged.');
      setWaiting(false);
    }

    socket.on('op-acknowledged', opAcknowledged);

    // disconnect
    return () => {
      socket.off('op-acknowledged', opAcknowledged);
    }
  }, [socket]);


  // socket connection for receiving a confirmed op
  useEffect(() => {

    // register confirmed op
    const registerConfirmed = (op : any) => {
      console.log('Register confirmed');
      const operation = CreateOp(op);
      document.addConfirmedOp(operation, op.index);
      setTextAreaChange(true);
      setLocalOps(document.localOps.length);
    }

    socket.on('new-op', registerConfirmed);
    
    // diconnect listeners
    return () => {
      socket.off('new-op', registerConfirmed);
    };
  }, [socket, document]);



  // handle local operations
  useEffect(() => {

    // send local ops to server
    const sendLocalOp = async () => {
      if (socket && !waiting && document.localOps.length > 0) {
        console.log('Sending Local Op');
        setWaiting(true);

        // get the op
        const opInfo : any = document.pullLocalOp();
        opInfo.docId = docId;

        console.log(socket);

        // send the op
        socket.emit('operation', opInfo);
        console.log('Local operation sent.');
        console.log(socket);

        setLocalOps(document.localOps.length);
      }
    }
    sendLocalOp();
  }, [socket, document, docId, waiting, localOps]);


  return (
    <div>
      <h1>Document</h1>
      <form>
        <TextArea value={text} onChange={v => localChange(v)} />
      </form>
    </div>
  )
}