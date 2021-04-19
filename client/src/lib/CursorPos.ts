import { InsertOp, DeleteOp } from './operations';
import { GetChanges } from '.';

const newCursorPos = (oldText : string, newText : string, 
  startSelection : number, endSelection : number) => {

  const changes = GetChanges(oldText, newText);

  var newStartSelection = startSelection;
  var newEndSelection = endSelection;

  for (const change of changes) {
    // find the size of the changes
    var delta = 0;
    if (change instanceof InsertOp) {
      delta = change.text.length;
    }
    else if (change instanceof DeleteOp) {
      delta = 0 - change.length;
    }

    // apply changes
    if (change.location <= newStartSelection) {
      newStartSelection += delta;
    }
    if (change.location <= newEndSelection) {
      newEndSelection += delta;
    }
  }

  return {
    start: newStartSelection,
    end: newEndSelection,
  }

}

export default newCursorPos;