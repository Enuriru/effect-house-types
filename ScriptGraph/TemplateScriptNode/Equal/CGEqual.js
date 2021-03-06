/**
 * @file CGEqual.js
 * @author
 * @date 2021/8/15
 * @brief CGEqual.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGEqual extends BaseNode {
  constructor() {
    super();
  }

  getOutput() {
    return Math.abs(this.inputs[0]() - this.inputs[1]()) < this.inputs[2]();
  }
}

exports.CGEqual = CGEqual;
