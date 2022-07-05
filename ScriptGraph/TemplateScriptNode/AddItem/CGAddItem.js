const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGAddItem extends BaseNode {
  constructor() {
    super();
  }

  getOutput() {
    if (!this.inputs[0] || !this.inputs[1]) {
      return;
    }
    const item = this.inputs[0]();
    const item_type = typeof item;
    const collection = this.inputs[1]();
    if (collection instanceof Amaz.Vector2f && item_type === 'number') {
      return new Amaz.Vector3f(collection.x, collection.y, item);
    } else if (collection instanceof Amaz.Vector3f && item_type === 'number') {
      return new Amaz.Vector4f(collection.x, collection.y, collection.z, item);
    } else if (collection && item_type === 'number') {
      collection.pushBack(item);
      return collection;
    }
  }
}

exports.CGAddItem = CGAddItem;
