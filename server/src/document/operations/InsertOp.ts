import Operation from "./Operation";


class InsertOp extends Operation {

  location: number;
  text: string;

  constructor(index: number, location: number, text: string) {
      super(index);
      this.location = location;
      this.text = text;
  }
}

export default InsertOp;