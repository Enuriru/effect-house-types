/**
 * @file CGDoN.js
 * @author runjiatian
 * @date 2022/4/20
 * @brief CGDoN.js
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGDoN extends BaseNode {
  constructor() {
    super();
    this.counter = 0;
  }

  execute(index) {
    let N = this.inputs[2]();

    if (N <= 0) {
      return;
    }

    if(this.counter < N){
      if (this.nexts[0]) {
        this.counter += 1;
        this.nexts[0]();
      }
    }

    if(index === 1){
      this.counter = 0;
    }
  }

  getOutput(index) {
    return this.counter;
  }
}

exports.CGDoN = CGDoN;
