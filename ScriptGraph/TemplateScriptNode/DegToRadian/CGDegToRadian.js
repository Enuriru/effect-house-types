/**
 * @file CGDegToRadian.js
 * @author xuyuan
 * @date 2021/8/28
 * @brief CGDegToRadian.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGDegToRadian extends BaseNode {
  constructor() {
    super();
  }
  getOutput(index) {
    return this.inputs[0]() * (Math.PI / 180);
  }
}

exports.CGDegToRadian = CGDegToRadian;
