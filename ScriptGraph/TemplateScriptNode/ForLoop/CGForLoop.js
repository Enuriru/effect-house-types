/**
 * @file CGForLoop.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGForLoop.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGForLoop extends BaseNode {
  constructor() {
    super();
  }

  execute(index) {
    let startVal = this.inputs[1]();
    let lastVal = this.inputs[2]();
    let stepVal = this.inputs[3]();
    if ((lastVal - startVal) * stepVal <= 0) {
      return;
    }
    this.currentIndex = startVal;

    while ((stepVal > 0 && this.currentIndex < lastVal) || (stepVal < 0 && this.currentIndex > lastVal)) {
      if (this.nexts[1]) {
        this.nexts[1]();
      }
      this.currentIndex = this.currentIndex + stepVal;
    }
    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }

  getOutput(index) {
    return this.currentIndex;
  }
}

exports.CGForLoop = CGForLoop;
