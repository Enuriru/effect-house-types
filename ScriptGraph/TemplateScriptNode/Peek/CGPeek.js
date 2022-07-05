const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGPeek extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    return this.inputs[0]();
  }
}

exports.CGPeek = CGPeek;
