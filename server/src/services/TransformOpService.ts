import { Service } from 'typedi';

import {
  Operation,
  InsertOp,
  DeleteOp,
} from '../operations';


@Service()
export default class TransformOpService {

  // Transforms op2 into one or more operations based the intervening operation
  // op1.
  public TransformOp(op1 : Operation, op2 : Operation) {

    if (op1 instanceof InsertOp && op2 instanceof InsertOp) {
      return this.insertInsert(op1, op2);
    }
    else if (op1 instanceof InsertOp && op2 instanceof DeleteOp) {
      return this.insertDelete(op1, op2);
    }
    else if (op1 instanceof DeleteOp && op2 instanceof InsertOp) {
      return this.deleteInsert(op1, op2);
    }
    else if (op1 instanceof DeleteOp && op2 instanceof DeleteOp) {
      return this.deleteDelete(op1, op2);
    }
  
    return [op2, ];
  }

  private insertInsert (op1 : InsertOp, op2: InsertOp) {

    // additional ops
    const res = [];
    res.push(op2);
    op2.index += 1;
  
    // if op1 inserted before op2, increase op2's location
    // by the length of the text that op1 inserted
    if (op1.location <= op2.location) {
      op2.location += op1.text.length;
    }
  
    return res;
  }
  
  // insert and then delete
  private insertDelete (op1 : InsertOp, op2: DeleteOp) {
  
    // additional ops
    const res = [];
    res.push(op2);
    op2.index += 1;
  
    // if op1 inserted before op2's deletion range,
    // increase op2's location by the length of the insert
    if (op1.location <= op2.location) {
      op2.location += op1.text.length;
    }
  
    // if op1 inserted something into op2's deletion range,
    // split up op2's deletion into two so that op1's insertion
    // is not deleted
    else if (op1.location < op2.location + op2.length) {
      const newOp2Len = op1.location - op2.location;
      res.push(new DeleteOp(op2.index + 1, op1.location + op1.text.length, 
        op2.length - newOp2Len));
  
      op2.length = newOp2Len;
    }
  
    return res;
  }
  
  private deleteInsert (op1: DeleteOp, op2: InsertOp) {
    
    // additional ops
    const res = [];
    res.push(op2);
    op2.index += 1;
  
    // if the entire deletion range is before the insertion, adjust
    // the location of the insertion
    if (op1.location + op1.length < op2.location) {
      op2.location -= op1.length;
    }
  
    // if the insertion is in the deletion range, adjust the location
    else if (op1.location < op2.location) {
      op2.location = op1.location;
    }
  
    return res;
  }
  
  private deleteDelete (op1: DeleteOp, op2: DeleteOp) {
  
    // additional ops
    const res = [];
    op2.index += 1;
  
    const op1Start = op1.location;
    const op1End = op1.location + op1.length;
  
    const op2Start = op2.location;
    const op2End = op2.location + op2.length;
  
    // op2 delete is completely before op1
    if (op1End <= op2Start) {
      op2.location -= op1.length;
      res.push(op2);
    }
  
    // op2 delete is completely after op1
    else if (op2End <= op1Start) {
      res.push(op2);
    }
  
    // op1 encompasses op2
    else if (op1Start <= op2Start && op1End >= op2End) {
      return res;
    }
  
    // op2 encompasses op1
    else if (op2Start <= op1Start && op2End >= op1End) {
      op2.length -= op1.length;
      res.push(op2);
    }
  
    // op2 overlaps op1 at the start
    else if (op2Start <= op1Start && op2End <= op1End) {
      op2.length = op1.location - op2.location;
      res.push(op2);
    }
  
    // op2 overlaps op1 at the end
    else if (op2Start >= op1Start && op2End >= op1End) {
      op2.length = (op2.location + op2.length) - (op1.location + op1.length);
      op2.location = op1.location;
      res.push(op2);
    }
  
    return res;
  }
  
}