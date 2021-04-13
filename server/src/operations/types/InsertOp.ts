import { Operation, OpType } from "..";


class InsertOp extends Operation {

  location: number;
  text: string;

  constructor(from: string, index: number, location: number, text: string,
    lastInGroup: boolean) {
      super(from, index, lastInGroup);
      this.location = location;
      this.text = text;
  }

  toJSON () {
    return {
      index: this.index,
      from: this.from,
      last: this.lastInGroup,
      type: OpType.InsertOp,
      location: this.location,
      text: this.text,
    }
  }
}

export default InsertOp;