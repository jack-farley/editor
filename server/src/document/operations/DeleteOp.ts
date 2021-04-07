import Operation from "./Operation";
import OperationType from "./OpType";


class DeleteOp extends Operation {

  // the start of the range to be deleted
  location: number;

  // the number of characters to be deleted
  length: number;

  // EXAMPLE: If we have a string abcdefghi, del(2, 4) would remove
  // the characters cdef.

  constructor(type: OperationType, location: number, length: number) {
      super(type);
      this.location = location;
      this.length = length;
  }
}

export default DeleteOp;