const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGGetItem extends BaseNode {
  getOutput() {
    if (!this.inputs[1]) {
      return;
    }
    let idx = this.inputs[0]();
    let collection = this.inputs[1]();
    if (collection instanceof Amaz.Vector2f) {
      switch (idx) {
        case 0:
          return collection.x;
        case 1:
          return collection.y;
        default:
          return 0;
      }
    } else if (collection instanceof Amaz.Vector3f) {
      switch (idx) {
        case 0:
          return collection.x;
        case 1:
          return collection.y;
        case 2:
          return collection.z;
        default:
          return 0;
      }
    } else if (collection instanceof Amaz.Vector4f) {
      switch (idx) {
        case 0:
          return collection.x;
        case 1:
          return collection.y;
        case 2:
          return collection.z;
        case 3:
          return collection.w;
        default:
          return 0;
      }
    } else if (idx < collection.size()) {
      return collection.get(idx);
    }
    return 0;
  }
}

exports.CGGetItem = CGGetItem;
