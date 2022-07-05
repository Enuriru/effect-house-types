/**
 * @file CGArctan.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGArctan.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGArctan extends BaseNode {
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
    return Math.atan(this.inputs[0]());
  }
}

exports.CGArctan = CGArctan;
