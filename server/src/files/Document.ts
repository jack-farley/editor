import uniqid from 'uniqid';

import { Operation } from '../operations';


class Document {

  // the id of the document
  public id: string;

  public name: string;

  public operations: Operation[];

  // create a document
  constructor (name: string) {
    this.name = name;
    this.id = uniqid();

    this.operations = [];
  }
}

export default Document;