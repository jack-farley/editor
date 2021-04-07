import uniqid from 'uniqid';
import { EventEmitter } from 'events';
import { Operation } from './operations';


class Document {

  private eventEmitter: EventEmitter = new EventEmitter();;

  // the id of the document
  private id: string;

  // the list of operations
  private operations: Operation[];

  constructor () {
    this.id = uniqid();
    this.operations = [];
  }

  private updateOp (op: Operation) : Operation {
    return null;
  }

  async pushOperation (op: Operation) {

    // transform the op
    const transformedOp = this.updateOp(op);

    // add it to the list of operations
    this.operations.push(transformedOp);

    // notify listeners of the operation
    this.eventEmitter.emit('new_op_' + this.id, transformedOp);
  }

}

export default Document;