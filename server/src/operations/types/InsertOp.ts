import { Operation, OpType } from "..";


class InsertOp extends Operation {

  location: number;
  text: string;

  constructor(index: number, location: number, text: string) {
      super(index);
      this.location = location;
      this.text = text;
  }

  toJSON () {
    return {
      index: this.index,
      type: OpType.InsertOp,
      location: this.location,
      text: this.text,
    }
  }
}

export default InsertOp;