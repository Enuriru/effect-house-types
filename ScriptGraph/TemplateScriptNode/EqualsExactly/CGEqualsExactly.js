/**
 * @file CGEqualsExactly.js
 * @author xuyuan
 * @date 2021/8/25
 * @brief CGEqualsExactly.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGEqualsExactly extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    let value1 = this.inputs[0]();
    let value2 = this.inputs[1]();
    const tolerance = 0.000001;

    if (value1 === undefined || value2 === undefined) {
      return false;
    }

    if (this.valueType === 'Vector2f') {
      var dx = Math.abs(value1.x - value2.x);
      var dy = Math.abs(value1.y - value2.y);
      return dx < tolerance && dy < tolerance;
    } else if (this.valueType === 'Vector3f') {
      var dx = Math.abs(value1.x - value2.x);
      var dy = Math.abs(value1.y - value2.y);
      var dz = Math.abs(value1.z - value2.z);
      return dx < tolerance && dy < tolerance && dz < tolerance;
    } else if (this.valueType === 'Vector4f') {
      var dx = Math.abs(value1.x - value2.x);
      var dy = Math.abs(value1.y - value2.y);
      var dz = Math.abs(value1.z - value2.z);
      let dw = Math.abs(value1.w - value2.w);
      return dx < tolerance && dy < tolerance && dz < tolerance && dw < tolerance;
    } else if (this.valueType === 'Color') {
      let dr = Math.abs(value1.r - value2.r);
      let dg = Math.abs(value1.g - value2.g);
      let db = Math.abs(value1.b - value2.b);
      let da = Math.abs(value1.a - value2.a);
      return dr < tolerance && dg < tolerance && db < tolerance && da < tolerance;
    } else {
      return this.inputs[0]() === this.inputs[1]();
    }
  }
}

exports.CGEqualsExactly = CGEqualsExactly;
