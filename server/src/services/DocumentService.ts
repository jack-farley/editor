import { Service, Container } from "typedi";
import { EventEmitter } from 'events';

import { TransformOpService } from '.';
import { Operation, InsertOp, DeleteOp } from '../operations';
import { FileSystem } from '../files';
import logger from "../loaders/logger";
import eventEmitter from '../loaders/events';

const fs = FileSystem;

@Service()
export default class DocumentService {


  // DOCUMENT ABSTRACTION

  private getNumOps(docId: string) {
    return fs.getDocument(docId).operations.length;
  }

  private getOp(docId: string, index: number) {
    return fs.getDocument(docId).operations[index];
  }

  private addOp(docId: string, op: Operation) {
    fs.getDocument(docId).operations.push(op);
  }

  private createDoc(name: string, startingText: string) {
    const doc = fs.createDocument(name);

    if (startingText.length > 0) {
      this.addOp(doc.id, new InsertOp("", 0, 0, startingText, true));
    }

    return doc.id;
  }

  private getDocs() {
    return Array.from(fs.getDocumentIds());
  }

  private getDocString(docId: string) {
    const doc = fs.getDocument(docId);

    let res = "";

    for (const op of doc.operations) {

      if (op instanceof InsertOp) {
        const firstSection = res.slice(0, op.location);
        const secondSection = res.slice(op.location, res.length);
        res = firstSection + op.text + secondSection;
        continue;
      }
      else if (op instanceof DeleteOp) {
        const firstSection = res.slice(0, op.location);
        const secondSection = res.slice(op.location + op.length, res.length);
        res = firstSection + secondSection;
        continue;
      }
    }
    console.log(res);

    return res;
  }

  private getOps (docId: string) {
    logger.info(fs.getDocument(docId));
    return fs.getDocument(docId).operations;
  }





  // DOCUMENT SERVICES

  public async getDocuments() {
    return this.getDocs();
  }

  public async createDocument(name: string, text: string) {
    return this.createDoc(name, text);
  }

  // add an operation to the document
  private addOpToDoc(docId: string, op: Operation) {

    // push the op to the document
    op.index = this.getNumOps(docId);
    this.addOp(docId, op);


    // notify listeners of the operation
    logger.info('Emitting new op event.');
    eventEmitter.emit('new-op', {docId, op});
  }

  // send an operation from the client to the document
  public async pushClientOp(docId : string, op : Operation) {

    // transform the operation

    const opQueue = [];
    opQueue.push(op);

    const addedOps = [];

    // keep transforming the operation(s) until it is ready to be added
    while (opQueue.length > 0) {
      const currentOp = opQueue.shift();

      // if our operation has been fully transformed, add it to the document
      const numOps = this.getNumOps(docId);
      if (currentOp.index >= numOps) {
        currentOp.index = numOps;
        this.addOp(docId, currentOp);
        addedOps.push(op);
      }

      // otherwise, continue transforming
      else {
        const transformOpInstance = Container.get(TransformOpService);
        const transformed : Operation[] =
        transformOpInstance.TransformOp(this.getOp(docId, currentOp.index), currentOp);
        opQueue.concat(transformed);
      }
    }

    for (const addedOp of addedOps) {
      this.addOpToDoc(docId, addedOp);
    }

    // send back the ops that have been added
    return addedOps.map((addedOp) => {return addedOp.toJSON()});
  }

  public async loadDoc(docId : string) {
    logger.info('Loading document in service');
    const ops = this.getOps(docId);
    logger.info(ops);
    const res = ops.map((op) => {return op.toJSON()});
    logger.info(res);
    return res;
  }
}