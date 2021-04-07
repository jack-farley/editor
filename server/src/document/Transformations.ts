import { 
  Operation, 
  OpType,
  InsertOp,
  DeleteOp
} from './operations';


// Modify op2 such that its intent is preserved
// after intervening change op1
const transformOperation = (op1 : Operation, op2: Operation) => {

}

// both inserts
const insertInsert = (op1 : InsertOp, op2: InsertOp) => {

  // if op1 inserted before op2, increase op2's location
  // by the length of the text that op1 inserted
  if (op1.location <= op2.location) {
    op2.location += op1.text.length;
  }
}

const insertDelete = (op1 : InsertOp, op2: DeleteOp) => {

  // if op1 inserted before op2's deletion range,
  // increase op2's location by the length of the insert
  if (op1.location <= op2.location) {
    op2.location += op1.text.length;
  }

  // if op1 inserted something into op2's deletion range,
  // increase the length of op2's deletion range so that 
  // op1's insert is also deleted.
  else if (op1.location < op2.location + op2.length) {
    op2.length += op1.text.length;
  }
}

const deleteInsert = (op1 : DeleteOp, op2: InsertOp) => {
  
}