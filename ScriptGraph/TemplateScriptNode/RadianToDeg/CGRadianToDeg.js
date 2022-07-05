/**
 * @file CGRadianToDeg.js
 * @author xuyuan
 * @date 2021/8/28
 * @brief CGRadianToDeg.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGRadianToDeg extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    return this.inputs[0]() * (180 / Math.PI);
  }
}

exports.CGRadianToDeg = CGRadianToDeg;
