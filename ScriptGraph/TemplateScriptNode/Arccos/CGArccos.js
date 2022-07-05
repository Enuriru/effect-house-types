/**
 * @file CGArccos.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGArccos.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGArccos extends BaseNode {
  constructor() {
    super();
  }

  getOutput() {
    return Math.acos(this.inputs[0]());
  }
}

exports.CGArccos = CGArccos;
