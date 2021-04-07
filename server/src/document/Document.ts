import Operation from './Operation';


class Document {

  currentVersion: number;
  currentContent: string;
  recentOperations: Operation[];

  constructor (version: number, content: string) {
    this.currentVersion = version;
    this.currentContent = content;
  }

  async pushOperation (op: Operation) {

  }

}

export default Document;