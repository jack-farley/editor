class Operation {

  public confirmedFromLocal: boolean;
  public lastInGroup: boolean;

  constructor (confirmedFromLocal: boolean, lastInGroup: boolean) {
    this.confirmedFromLocal = confirmedFromLocal;
    this.lastInGroup = lastInGroup;
  }
}

export default Operation;