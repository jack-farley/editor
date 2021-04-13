import { InsertOp, DeleteOp } from './operations';


const getChanges = (string1 : string, string2 : string) => {

  var start1 = 0;
  var start2 = 0;

  var end1 = string1.length - 1;
  var end2 = string2.length - 1;

  // increment starts until we find a difference
  while (start1 < string1.length && start2 < string2.length && 
    string1[start1] === string2[start2]) {
    start1 ++;
    start2 ++;
  }

  // decrement ends until they either find a start or find a change
  while (end1 >= start1 && end2 >= start2 && string1[end1] === string2[end2]) {
      end1 --;
      end2 --;
  }

  // no change
  if (start1 > end1 && start2 > end2) {
    return [];
  }

  // insert
  else if (start1 > end1) {
    return [new InsertOp(start1, string2.slice(start2, end2 + 1), false, true)];
  }

  // delete
  else if (start2 > end2) {
    return [new DeleteOp(start1, end1 - start1 + 1, false, true)];
  }

  else {
    return [new DeleteOp(start1, end1 - start1 + 1, false, true),
    new InsertOp(start2, string2.slice(start2, end2 + 1), false, true)];
  }
}

export default getChanges;