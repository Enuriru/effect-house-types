/**
 * @file CGCos.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGCos.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGCos extends BaseNode {
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
    return Math.cos(this.inputs[0]());
  }
}

exports.CGCos = CGCos;
