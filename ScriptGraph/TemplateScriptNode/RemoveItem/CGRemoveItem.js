const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGRemoveItem extends BaseNode {
  constructor() {
    super();
  }

  execute() {
    if (!this.inputs[0]) {
      return;
    }
    let idx = this.inputs[0]();
    let collection = this.inputs[1]();
    if (collection && collection.size() && idx < collection.size()) {
      collection.remove(idx);
    }
    this.outputs[0] = collection;
  }
}

exports.CGRemoveItem = CGRemoveItem;
