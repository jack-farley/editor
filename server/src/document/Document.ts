import uniqid from 'uniqid';
import { EventEmitter } from 'events';
import { Operation, TransformOp, InsertOp, DeleteOp } from './operations';
import { assert } from 'node:console';
import { Lock } from '../util/Lock';


class Document {

  private eventEmitter: EventEmitter = new EventEmitter();
  private Lock = new Lock();

  // the id of the document
  private id: string;

  private currentText: string;
  private currentVersion: number;

  // the list of operations
  private operations: Operation[];

  // create a document
  constructor (startingText : string) {
    this.id = uniqid();

    this.currentText = "";
    this.currentVersion = -1;

    this.operations = [];

    // add the starting text
    this.transformAndAdd(new InsertOp(0, 0, startingText));
  }


  /**
   * Add Operations to the Document.
   */

  // once an operation has been transformed, add it to the document
  private addOpToDoc (op: Operation) {
    assert(op.index === this.operations.length);
    this.operations.push(op);

    // update the current document
    this.currentText = this.generateDoc(this.currentText, this.currentVersion);

    // notify listeners of the operation
    this.eventEmitter.emit('new_op_' + this.id, op);
  }

  // transform an operation and add it to the document
  private transformAndAdd (op: Operation) {

    const opQueue = [];
    opQueue.push(op);

    // keep transforming the operation(s) until it is ready to be added
    while (opQueue.length > 0) {
      const op = opQueue.shift();
      
      // if our operation has been fully transformed, add it to the document
      if (op.index >= this.operations.length) {
        this.addOpToDoc(op);
      }

      // otherwise, continue transforming
      else {
        const transformed : Operation[] = TransformOp(this.operations[op.index], op);
        opQueue.concat(transformed);
      }
    }
  }

  public async pushOperation (op: Operation) {

    // acquire the lock
    this.Lock.acquire();

    // transform the op and add it to the document
    this.transformAndAdd(op);

    // release the lock
    this.Lock.release();
  }


  /*
   * Generate the string version of a document.
   * 
   * text - the current string of the text
   * version - the current version (the index of the highest op included), the version number of an empty document is 0
   */
  private generateDoc(text : string, version: number) : string {
    var res = text;

    for (var index = version + 1; index < this.operations.length; index ++) {
      const op = this.operations[index];
      
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

}

export default Document;