import { Document } from '.';

class FileSystem {

  private documents : Map<string, Document>;

  constructor() {
    this.documents = new Map();
  }

  public createDocument(name: string) {
    const newDoc = new Document(name);
    this.documents.set(newDoc.id, newDoc);

    return newDoc;
  }

  public getDocument(id: string) {
    return this.documents.get(id);
  }

  public getDocumentIds() {
    return Array.from(this.documents.keys());
  }
}

const fs = new FileSystem();

export default fs;