import { Operation, InsertOp, DeleteOp, Transform, OpType } from './operations';

class Document {

  public id : string;
  public name : string;

  private confirmedOps : Operation[];
  public localOps : Operation[];
  private pendingLocalOps : Operation[];
  private pendingConfirmedOps : Map<number, Operation>;

  private confirmedText: string;
  private confirmedVersion: number;

  public localText: string;
  private localVersion: number;

  constructor (id: string, name: string, ops : Operation[]) {
    this.id = id;
    this.name = name;

    this.confirmedOps = ops;

    this.localOps = [];
    this.pendingLocalOps = [];
    this.pendingConfirmedOps = new Map<number, Operation>();

    this.confirmedText = this.UpdateText("", this.confirmedOps);
    this.confirmedVersion = this.confirmedOps.length - 1;
     
    this.localText = this.confirmedText;
    this.localVersion = this.confirmedVersion;
  }

  private updateLocalText (text : string) {
    this.localText = text;
  }

  private pushLocalOp(op : Operation) {
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

  // add a confirmed op to the confirmed list
  private addConfirmedOp(newOp : Operation) {

    // add the op
    this.confirmedOps.push(newOp);

    // update pending ops
    const newPendingOps = [];
    for (const op of this.pendingLocalOps) {

      for (const transformedOp of Transform(newOp, op)) {
        newPendingOps.push(transformedOp);
      }
    }
    this.pendingLocalOps = newPendingOps;

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

    this.localVersion = this.confirmedOps.length + this.pendingLocalOps.length + this.localOps.length - 1;
    this.updateLocalText(this.UpdateText(this.confirmedText, this.pendingLocalOps.concat(this.localOps)));
  }

  private addLocalConfirmed(newOp : Operation, index : number) {

    if (index < this.confirmedOps.length) {
      return;
    }

    // if this is the next one we need and the last in its group, add
    if (index === this.confirmedOps.length && newOp.lastInGroup) {
      this.addConfirmedOp(newOp);
      this.pendingLocalOps = [];
    }

    // add it to pending
    this.pendingConfirmedOps.set(index, newOp);

    // check if we have a confirmed local set
    var tmp = this.confirmedOps.length;
    var end = -1;
    while (this.pendingConfirmedOps.has(tmp)) {
      const op = this.pendingConfirmedOps.get(tmp);
      if (!op || !op.confirmedFromLocal) {
        break;
      }
      else if (op.lastInGroup) {
        end = tmp;
        break;
      }
      tmp ++;
    }

    // if we did not find a set, return
    if (end === -1) {
      return;
    }

    // if we did find a set, add them
    this.pendingLocalOps = [];
    for (let i = this.confirmedOps.length; i <= end; i ++) {
      const op = this.pendingConfirmedOps.get(i);
      if (op) {
        this.pendingConfirmedOps.delete(i);
        this.addConfirmedOp(op);
      }
    }

    return;
  }

  // push a confirmed op
  public pushConfirmedOp(newOp : Operation, index : number) {

    if (index < this.confirmedOps.length) {
      return;
    }

    // if this is a local confirmed op, send it to addLocalConfirmed
    if (newOp.confirmedFromLocal) {
      return this.addLocalConfirmed(newOp, index);
    }

    // if this is not the next confirmed op, have it wait
    if (index > this.confirmedOps.length) {
      return this.pendingConfirmedOps.set(index, newOp);
    }

    this.addConfirmedOp(newOp);

    // if the next confirmed op is here, add it
    const nextOp = this.pendingConfirmedOps.get(index + 1);
    if (nextOp) {
      this.pendingConfirmedOps.delete(index + 1);
      this.pushConfirmedOp(newOp, index + 1);
    }
  }


  // add a local op on the client
  public addLocalOp(newOp : Operation) {
    
    this.pushLocalOp(newOp);

    // update local text, version
    this.localVersion ++;
    this.updateLocalText(this.UpdateText(this.localText, [newOp, ]));
  }

  // get the next local op to push to the client
  public pullLocalOp () {
    if (this.localOps.length === 0 || this.pendingLocalOps.length > 0) {
      return null;
    }

    const op = this.localOps.shift();
    this.pendingLocalOps.push();

    if (op instanceof InsertOp) {
      return {
        type: OpType.InsertOp,
        index: this.confirmedOps.length + this.pendingLocalOps.length,
        location: op.location,
        text: op.text,
      }
    }

    else if (op instanceof DeleteOp) {
      return {
        type: OpType.DeleteOp,
        index: this.confirmedOps.length + this.pendingLocalOps.length,
        location: op.location,
        length: op.length,
      }
    }

    return null;
  }

  public hasPending () {
    return (this.pendingLocalOps.length > 0);
  }
}

export default Document;