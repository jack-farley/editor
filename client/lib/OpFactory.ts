import { OpType, Operation, InsertOp, DeleteOp } from './operations';

const CreateOp = (op : any) : Operation => {
  if (op.type === OpType.InsertOp) {
    return new InsertOp(op.location, op.text);
  }
  else if (op.type === OpType.DeleteOp) {
    return new DeleteOp(op.location, op.length);
  }
  return null;
}

export default CreateOp;