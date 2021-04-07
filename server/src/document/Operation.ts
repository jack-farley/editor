import OperationType from './OperationType';

class operation {

  version: number;
  type: OperationType;
  text: string;
  location: number;

  constructor (version: number, type: OperationType, text: string, 
    location: number) {
    this.version = version;
    this.type = type;
    this.text = text;
    this.location = location;
  }
}

export default operation;