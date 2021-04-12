import { InsertOp, DeleteOp } from './operations';


const getChanges = (string1 : string, string2 : string) => {

  // check if strings are empty
  if (string1.length === 0 && string2.length === 0) {
    return [];
  }
  else if (string1.length === 0) {
    return [new InsertOp(0, string2)];
  }
  else if (string2.length === 0) {
    return [new DeleteOp(0, string1.length)];
  }

  console.log(string1);
  console.log(string2);

  var start1 = 0;
  var start2 = 0;

  var end1 = string1.length - 1;
  var end2 = string2.length - 1;

  // increment starts until we find a difference
  while (string1[start1] === string2[start2] && start1 < end1 
    && start2 < end2) {
    start1 ++;
    start2 ++;
  }

  // decrement ends until they either find a start or find a change
  while (string1[end1] === string2[end2] && start1 < end1 
    && start2 < end2) {

      end1 --;
      end2 --;
  }

  console.log(start1);
  console.log(start2);
  console.log(end1);
  console.log(end2);

  // no change
  if (start1 >= end1 && start2 >= end2) {
    return [];
  }

  // insert
  else if (start1 >= end1) {
    return [new InsertOp(start2, string2.slice(start2, end2 + 1))];
  }

  // delete
  else if (start2 >= end2) {
    return [new DeleteOp(start1, end1 - start1 + 1)];
  }

  else {
    return [new DeleteOp(start1, end1 - start1 + 1),
    new InsertOp(start2, string2.slice(start2, end2 + 1))];
  }
}

export default getChanges;