/**
 * @file CGPower.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGPower.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGPower extends BaseNode {
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
    return Math.pow(this.inputs[0](), this.inputs[1]());
  }
}

exports.CGPower = CGPower;
