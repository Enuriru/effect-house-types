/**
 * @file CGAdd.js
 * @author
 * @date 2021/8/15
 * @brief CGAdd.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGAdd extends BaseNode {
  constructor() {
    super();
  }

  getOutput() {
    let v1 = this.inputs[0]();
    let v2 = this.inputs[1]();
    if (v1 !== undefined && v2 !== undefined) {
      if (this.valueType === 'Vector2f') {
        return new Amaz.Vector2f(v1.x + v2.x, v1.y + v2.y);
      } else if (this.valueType === 'Vector3f') {
        return new Amaz.Vector3f(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
      } else if (this.valueType === 'Vector4f') {
        return new Amaz.Vector4f(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
      } else {
        return v1 + v2;
      }
    }
    return undefined;
  }
}

exports.CGAdd = CGAdd;
