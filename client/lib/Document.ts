import { Operation, InsertOp, DeleteOp, Transform } from './operations';

class Document {

  private confirmedOps : Operation[];
  public localOps : Operation[];
  private pendingOps : Operation[];

  private confirmedText: string;
  private confirmedVersion: number;

  public localText: string;
  private localVersion: number;

  constructor (ops : Operation[]) {
    this.confirmedOps = ops;

    this.localOps = [];
    this.pendingOps = [];
  }

  private UpdateText(text: string, ops: Operation[]) {
    let res = "";

    for (const op of ops) {

      if (op instanceof InsertOp) {
        const firstSection = res.slice(0, op.location);
        const secondSection = res.slice(op.location + op.text.length, res.length);
        res = firstSection + op.text + secondSection;
        continue;
      }
      else if (op instanceof DeleteOp) {
        const firstSection = res.slice(0, op.location);
        const secondSection = res.slice(op.location + op.length, res.length);
        res = firstSection + secondSection;
        continue;
      }
    }

    return res;
  }

  public addConfirmedOp(newOp : Operation, index: number) {

    if (index !== this.confirmedOps.length) {
      return;
    }

    // add the op
    this.confirmedOps.push(newOp);

    // update pending ops
    const newPendingOps = [];
    for (const op of this.pendingOps) {

      for (const transformedOp of Transform(newOp, op)) {
        newPendingOps.push(transformedOp);
      }
    }
    this.pendingOps = newPendingOps;

    // update local ops
    const newLocalOps = [];
    for (const op of this.localOps) {

      for (const transformedOp of Transform(newOp, op)) {
        newLocalOps.push(transformedOp);
      }
    }
    this.localOps = newLocalOps;

    // update current Strings
    this.confirmedVersion ++;
    this.confirmedText = this.UpdateText(this.confirmedText, [newOp, ]);

    this.localVersion = this.confirmedOps.length + this.pendingOps.length + this.localOps.length - 1;
    this.localText = this.UpdateText(this.confirmedText, this.pendingOps.concat(this.localOps));
  }

  public addLocalOp(newOp : Operation) {
    
    this.localOps.push(newOp);

    // update local text, version
    this.localVersion ++;
    this.localText = this.UpdateText(this.localText, [newOp, ]);
  }

  public pullLocalOp () {
    if (this.localOps.length === 0) {
      return null;
    }

    const op = this.localOps.shift();
    this.pendingOps.push();

    if (op instanceof InsertOp) {
      return {
        index: this.confirmedOps.length + this.pendingOps.length,
        local: op.location,
        text: op.text,
      }
    }

    else if (op instanceof DeleteOp) {
      return {
        index: this.confirmedOps.length + this.pendingOps.length,
        local: op.location,
        length: op.length,
      }
    }

    return null;
  }
}

export default Document;