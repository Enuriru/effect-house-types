/**
 * @file CGMultiply.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGMultiply.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGMultiply extends BaseNode {
  constructor() {
    super();
  }

  setNext(index, func) {
    this.nexts[index] = func;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  getOutput() {
    let curType = this.valueType;
    if (curType == null) {
      return null;
    }
    if (this.inputs[0] === undefined || this.inputs[1] === undefined) {
      return null;
    }
    let op1 = this.inputs[0]();
    let op2 = this.inputs[1]();
    if (op1 == null || op2 == null) {
      return null;
    }

    if (curType == 'Int' || curType == 'Double') {
      return op1 * op2;
    } else if (curType == 'Vector2f') {
      return new Amaz.Vector2f(op1.x * op2.x, op1.y * op2.y);
    } else if (curType == 'Vector3f') {
      return new Amaz.Vector3f(op1.x * op2.x, op1.y * op2.y, op1.z * op2.z);
    } else if (curType == 'Vector4f') {
      return new Amaz.Vector4f(op1.x * op2.x, op1.y * op2.y, op1.z * op2.z, op1.w * op2.w);
    } else if (curType == 'Color') {
      return op1 * op2;
    }
  }
}

exports.CGMultiply = CGMultiply;
