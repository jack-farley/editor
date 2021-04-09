import { Service, Container } from "typedi";
import { EventEmitter } from 'events';

import { TransformOpService } from '.';
import { Operation, InsertOp, DeleteOp } from '../operations';
import { FileSystem } from '../files';

const fs = FileSystem;

@Service()
export default class DocumentService {

  private eventEmitter: EventEmitter = new EventEmitter();


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

  public createDocument(name: string, startingText: string) {
    const doc = fs.createDocument(name);

    if (startingText.length > 0) {
      this.addOp(doc.id, new InsertOp(0, 0, startingText));
    }
  }

  public getDocuments() {
    return fs.getDocumentIds();
  }

  private getDocString(docId: string) {
    const doc = fs.getDocument(docId);

    var res = "";

    for (var index = 0; index < doc.operations.length; index ++) {
      const op = doc.operations[index];
      
      if (op instanceof InsertOp) {
        const firstSection = res.slice(0, op.location);
        const secondSection = res.slice(op.location + op.text.length, res.length);
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

    return res;
  }





  // DOCUMENT SERVICES

  // add an operation to the document
  private addOpToDoc(docId: string, op: Operation) {

    // push the op to the document
    op.index = this.getNumOps(docId);
    this.addOp(docId, op);


    // notify listeners of the operation
    this.eventEmitter.emit('new_op_' + docId, op);
  }

  // send an operation from the client to the document
  public pushClientOp(docId : string, op : Operation) {

    // transform the operation

    const opQueue = [];
    opQueue.push(op);

    // keep transforming the operation(s) until it is ready to be added
    while (opQueue.length > 0) {
      const op = opQueue.shift();
      
      // if our operation has been fully transformed, add it to the document
      const numOps = this.getNumOps(docId);
      if (op.index >= numOps) {
        op.index = numOps;
        this.addOp(docId, op);
      }

      // otherwise, continue transforming
      else {
        const transformOpInstance = Container.get(TransformOpService);
        const transformed : Operation[] = 
        transformOpInstance.TransformOp(this.getOp(docId, op.index), op);
        opQueue.concat(transformed);
      }
    }

  }
}