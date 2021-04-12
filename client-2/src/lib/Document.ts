import { Operation, InsertOp, DeleteOp, Transform } from './operations';
import { EventEmitter } from 'events';

class Document {

  private eventEmitter : EventEmitter = new EventEmitter();

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

    this.confirmedText = "";
    this.confirmedVersion = -1;
     
    this.localText = "";
    this.localVersion = -1;
  }

  private updateLocalText (text : string) {
    console.log('Updating local text');
    this.localText = text;
    this.eventEmitter.emit('local-text-change');
  }

  private pushLocalOp(op : Operation) {
    console.log('Pushing local op');
    this.localOps.push(op);
    this.eventEmitter.emit('local-ops-change');
  }

  private setLocalOps(ops : Operation[]) {
    this.localOps = ops;
    this.eventEmitter.emit('local-ops-change');
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
    console.log(res);

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