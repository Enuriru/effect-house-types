/**
 * @file CGFlipFlop.js
 * @author runjiatian
 * @date 2022/3/24
 * @brief CGFlipFlop.js
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');

class CGFlipFlop extends BaseNode {
  constructor() {
    super();
    this.index = 1;
    this.outputs[2] = true;
  }

  execute(index) {
    this.index = Math.round((this.index + 1) % 2);
    this.outputs[2] = this.index < 0.5;
    if (this.nexts[this.index]) {
      this.nexts[this.index]();
    }
  }
}

exports.CGFlipFlop = CGFlipFlop;
