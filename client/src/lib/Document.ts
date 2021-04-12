import { Operation, InsertOp, DeleteOp, Transform, OpType } from './operations';

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

    this.confirmedText = this.UpdateText("", this.confirmedOps);
    this.confirmedVersion = this.confirmedOps.length - 1;
     
    this.localText = this.confirmedText;
    this.localVersion = this.confirmedVersion;
  }

  private updateLocalText (text : string) {
    console.log('Updating local text');
    this.localText = text;
  }

  private pushLocalOp(op : Operation) {
    console.log('Pushing local op');
    this.localOps.push(op);
  }

  private setLocalOps(ops : Operation[]) {
    this.localOps = ops;
  }

  private UpdateText(text: string, ops: Operation[]) {
    let res = text;

    for (const op of ops) {

      if (op instanceof InsertOp) {
        const firstSection = res.slice(0, op.location);
        const secondSection = res.slice(op.location, res.length);
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
    this.setLocalOps(newLocalOps);

    // update current Strings
    this.confirmedVersion ++;
    this.confirmedText = this.UpdateText(this.confirmedText, [newOp, ]);

    this.localVersion = this.confirmedOps.length + this.pendingOps.length + this.localOps.length - 1;
    this.updateLocalText(this.UpdateText(this.confirmedText, this.pendingOps.concat(this.localOps)));
  }

  public addLocalOp(newOp : Operation) {

    console.log(newOp);
    
    this.pushLocalOp(newOp);

    // update local text, version
    this.localVersion ++;
    this.updateLocalText(this.UpdateText(this.localText, [newOp, ]));
  }

  public pullLocalOp () {
    if (this.localOps.length === 0) {
      return null;
    }

    const op = this.localOps.shift();
    this.pendingOps.push();

    if (op instanceof InsertOp) {
      return {
        type: OpType.InsertOp,
        index: this.confirmedOps.length + this.pendingOps.length,
        location: op.location,
        text: op.text,
      }
    }

    else if (op instanceof DeleteOp) {
      return {
        type: OpType.DeleteOp,
        index: this.confirmedOps.length + this.pendingOps.length,
        location: op.location,
        length: op.length,
      }
    }

    return null;
  }
}

export default Document;