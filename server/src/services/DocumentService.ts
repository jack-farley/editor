import { Service, Container } from "typedi";

import { TransformOpService } from '.';
import { Operation, InsertOp, DeleteOp } from '../operations';
import { FileSystem } from '../files';

const fs = FileSystem;

@Service()
export default class DocumentService {

  public pushOperation(docId : string, op : Operation) {

    const doc = fs.getDocument(docId);

    const opQueue = [];
    opQueue.push(op);

    // keep transforming the operation(s) until it is ready to be added
    while (opQueue.length > 0) {
      const op = opQueue.shift();
      
      // if our operation has been fully transformed, add it to the document
      if (op.index >= doc.operations.length) {
        doc.operations.push(op);
      }

      // otherwise, continue transforming
      else {
        const transformOpInstance = Container.get(TransformOpService);
        const transformed : Operation[] = transformOpInstance.TransformOp(doc.operations[op.index], op);
        opQueue.concat(transformed);
      }
    }



  }

  public getOperations(docId : string) {

  }
}