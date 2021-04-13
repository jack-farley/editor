import { OpType, Operation, InsertOp, DeleteOp } from './operations';

const CreateOp = (op : any, socketId : string) : Operation => {
  if (op.type === OpType.InsertOp) {
    return new InsertOp(op.location, op.text, (socketId === op.from), op.last);
  }
  else if (op.type === OpType.DeleteOp) {
    return new DeleteOp(op.location, op.length, (socketId === op.from), op.last);
  }
  return new Operation((socketId === op.from), op.last);
}

export default CreateOp;