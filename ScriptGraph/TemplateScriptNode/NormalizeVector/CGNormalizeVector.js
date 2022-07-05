/**
 * @file CGNormalizeVector.js
 * @author runjiatian
 * @date 2022/3/23
 * @brief CGNormalizeVector.js
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGNormalizeVector extends BaseNode {
  constructor() {
    super();
  }

  getOutput() {
    let vector = this.inputs[0]();
    if (vector == undefined) {
      return undefined;
    }

    if (this.valueType === 'Vector2f') {
      return vector.normalize();
    } else if (this.valueType === 'Vector3f') {
      return vector.normalize();
    } else if (this.valueType === 'Vector4f') {
      var magnitude = Math.sqrt(Math.pow(vector.x,2)+Math.pow(vector.y,2)+Math.pow(vector.z,2)+Math.pow(vector.w,2))
      return new Amaz.Vector4f(vector.x/magnitude, vector.y/magnitude, vector.z/magnitude, vector.w/magnitude); 
    }
  }
}

exports.CGNormalizeVector = CGNormalizeVector;
