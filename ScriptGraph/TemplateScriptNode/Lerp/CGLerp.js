/**
 * @file CGLerp.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGLerp.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGLerp extends BaseNode {
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
    let initVal = this.inputs[0]();
    let endVal = this.inputs[1]();
    let amtVal = this.inputs[2]();

    if (initVal == null || endVal == null || amtVal == null) {
      return null;
    }
    return initVal + (endVal - initVal) * amtVal;
  }
}

exports.CGLerp = CGLerp;
