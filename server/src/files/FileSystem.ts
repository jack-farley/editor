import { Document } from '.';

class FileSystem {

  private documents : Map<string, Document>;

  constructor() {
    this.documents = new Map();
  }

  public createDocument(name: string, text: string) {
    const newDoc = new Document(name, text);
    this.documents.set(newDoc.getId(), newDoc);

    return newDoc;
  }

  public getDocument(id: string) {
    return this.documents.get(id);
  }

  public getDocuments() {
    return this.documents.values();
  }
}

export default FileSystem;