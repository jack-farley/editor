import { Operation, OpType } from ".";


class InsertOp extends Operation {

  location: number;
  text: string;

  constructor(location: number, text: string) {
    super();
    this.location = location;
    this.text = text;
  }

  toJSON () {
    return {
      type: OpType.InsertOp,
      location: this.location,
      text: this.text,
    }
  }
}

export default InsertOp;