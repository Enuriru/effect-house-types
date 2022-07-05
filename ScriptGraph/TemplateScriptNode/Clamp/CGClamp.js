/**
 * @file CGClamp.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGClamp.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGClamp extends BaseNode {
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
    let inputVal = this.inputs[0]();
    let minVal = this.inputs[1]();
    let maxVal = this.inputs[2]();

    if (inputVal < minVal) {
      return minVal;
    } else if (inputVal > maxVal) {
      return maxVal;
    } else {
      return inputVal;
    }
  }
}

exports.CGClamp = CGClamp;
