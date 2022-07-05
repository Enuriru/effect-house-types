/**
 * @file CGNot.js
 * @author
 * @date 2021/8/15
 * @brief CGOr.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGNot extends BaseNode {
  constructor() {
    super();
  }

  getOutput() {
    return !this.inputs[0]();
  }
}

exports.CGNot = CGNot;
