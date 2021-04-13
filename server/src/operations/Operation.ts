

class Operation {

  // the operation's index in the chain
  index: number;
  from: string;
  lastInGroup: boolean;

  constructor (from: string, index: number, lastInGroup: boolean) {
    this.index = index;
    this.from = from;
    this.lastInGroup = lastInGroup;
  }

  toJSON () {
    return {
      from: this.from,
      index: this.index,
      last: this.lastInGroup,
    }
  }
}

export default Operation;