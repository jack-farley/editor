import OperationType from './OpType';


class Operation {

  // the type of the operation
  type: OperationType;

  constructor (type: OperationType) {
    this.type = type;
  }
}

export default Operation;