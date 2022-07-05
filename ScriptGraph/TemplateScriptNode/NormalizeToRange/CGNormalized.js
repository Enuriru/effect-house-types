/**
 * @file CGNormalized.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGNormalized.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGNormalized extends BaseNode {
  constructor() {
    super();
  }

  setNext(index, func) {
    this.nexts[index] = func;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  getOutput(index) {
    let inputVal = this.inputs[0]();
    let minVal = this.inputs[1]();
    let maxVal = this.inputs[2]();

    if (inputVal == null || minVal == null || maxVal == null) {
      return null;
    }
    return Math.max(0, Math.min(1, (inputVal - minVal) / (maxVal - minVal)));
  }
}

exports.CGNormalized = CGNormalized;
