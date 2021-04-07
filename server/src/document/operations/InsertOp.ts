import Operation from "./Operation";
import OperationType from "./OpType";


class InsertOp extends Operation {

  location: number;
  text: string;

  constructor(type: OperationType, location: number, text: string) {
      super(type);
      this.location = location;
      this.text = text;
  }
}

export default InsertOp;