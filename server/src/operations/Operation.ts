

class Operation {

  // the operation's index in the chain
  index: number;

  constructor (index: number) {
    this.index = index;
  }

  toJSON () {
    return {
      index: this.index,
    }
  }
}

export default Operation;