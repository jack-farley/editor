import React, { useState, useEffect, useContext, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';

import { SocketContext } from '../context/socket';
import { Document, CreateOp, GetChanges, MoveCursor } from '../lib';


export default function DocumentView () {

  const params : any = useParams();
  const docId = params.docId;

  const socket : Socket = useContext(SocketContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [doc, setDoc] = useState(new Document([]));
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [localOps, setLocalOps] = useState(0);
  const [textAreaChange, setTextAreaChange] = useState(false);


  // local change
  const localChange = (newText : string) => {
    console.log("Local change.");
    const newOps = GetChanges(text, newText);
    for (const op of newOps) {
      doc.addLocalOp(op);
    }
    setTextAreaChange(true);
    setLocalOps(doc.localOps.length);
  }

  // update the text area
  useEffect(() => {

    if (textareaRef.current) {
      const startSel = textareaRef.current.selectionStart;
      const endSel = textareaRef.current.selectionEnd;

      const oldText = text;
      const newText = doc.localText;

      setText(doc.localText);

      const { start: newStart, end: newEnd } = 
      MoveCursor(oldText, newText, startSel, endSel);

      textareaRef.current.setSelectionRange(newStart, newEnd);

    }
    else {
      setText(doc.localText);
    }

    setTextAreaChange(false);

  }, [textAreaChange, doc])

  // load the doc
  useEffect(() => {
    console.log('Loading Document.');
    socket.emit('load-doc', { docId: docId });
  }, [socket, docId]);


  // socket connection for loading a doc
  useEffect(() => {
    // load a doc
    const loadDoc = (ops : any) => {
      console.log('Received loaded doc.');
      const opList = [];
      for (const op of ops) {
        opList.push(CreateOp(op, socket.id));
      }
      setDoc(new Document(opList));
    }

    socket.on('full-doc', loadDoc);
    // disconnect
    return () => {
      socket.off('full-doc', loadDoc);
    }
  }, [socket]);


  // socket connection for op acknowledgements
  useEffect(() => {
    const opAcknowledged = (ops : any) => {
      console.log('Local op acknowledged.');
      if (!doc.hasPending()) setWaiting(false);
    }

    socket.on('op-acknowledged', opAcknowledged);

    // disconnect
    return () => {
      socket.off('op-acknowledged', opAcknowledged);
    }
  }, [socket, doc]);


  // socket connection for receiving a confirmed op
  useEffect(() => {

    // register confirmed op
    const registerConfirmed = (op : any) => {
      console.log('Register confirmed');
      const operation = CreateOp(op, socket.id);
      doc.pushConfirmedOp(operation, op.index);
      
      setTextAreaChange(true);
      setLocalOps(doc.localOps.length);
      if (!doc.hasPending()) setWaiting(false);
    }

    socket.on('new-op', registerConfirmed);
    
    // diconnect listeners
    return () => {
      socket.off('new-op', registerConfirmed);
    };
  }, [socket, doc]);



  // handle local operations
  useEffect(() => {

    // send local ops to server
    const sendLocalOp = async () => {
      if (socket && !waiting && doc.localOps.length > 0) {
        console.log('Sending Local Op');
        setWaiting(true);

        // get the op
        const opInfo : any = doc.pullLocalOp();
        opInfo.docId = docId;

        // send the op
        socket.emit('operation', opInfo);

        setLocalOps(doc.localOps.length);
      }
    }
    sendLocalOp();
  }, [socket, doc, docId, waiting, localOps]);


  const onChangeTextArea = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    localChange(value);
  }


  return (
    <div>
      <h1>Document</h1>
      <form>
        <textarea ref={textareaRef} value={text} onChange={onChangeTextArea} />
      </form>
    </div>
  )
}