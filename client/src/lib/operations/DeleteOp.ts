import { Operation, OpType } from ".";


class DeleteOp extends Operation {

  // the start of the range to be deleted
  location: number;

  // the number of characters to be deleted
  length: number;

  // EXAMPLE: If we have a string abcdefghi, del(2, 4) would remove
  // the characters cdef.

  constructor(location: number, length: number, confirmedFromLocal: boolean, 
    lastInGroup: boolean) {
      super(confirmedFromLocal, lastInGroup);
      this.location = location;
      this.length = length;
  }

  toJSON () {
    return {
      type: OpType.DeleteOp,
      location: this.location,
      length: this.length,
    }
  }
}

export default DeleteOp;