const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGForEach extends BaseNode {
  constructor() {
    super();
    this._currentIdx = 0;
  }

  execute() {
    if (this.nexts[1]) {
      this.nexts[1]();
    }
    let collection = this.inputs[1]();
    if (collection) {
      let arr = [];
      if (collection instanceof Amaz.Vector2f) {
        arr = [collection.x, collection.y];
      } else if (collection instanceof Amaz.Vector3f) {
        arr = [collection.x, collection.y, collection.z];
      } else if (collection instanceof Amaz.Vector4f) {
        arr = [collection.x, collection.y, collection.z, collection.w];
      }
      if (this._currentIdx < arr.length) {
        this.outputs[2] = arr[this._currentIdx];
        if (this._currentIdx + 1 < arr.length) {
          ++this._currentIdx;
        }
        if (this.nexts[0]) {
          this.nexts[0]();
        }
      }
    }
  }
}

exports.CGForEach = CGForEach;
