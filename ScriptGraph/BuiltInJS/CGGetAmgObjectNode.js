/**
 * @file CGGetAmgObjectNode.js
 * @author xuyuan
 * @date 2021/8/24
 * @brief CGGetAmgObjectNode.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGGetAmgObjectNode extends BaseNode {
  constructor() {
    super();
    this.object = null;
  }

  getOutput(index) {
    return this.object;
  }
}

exports.CGGetAmgObjectNode = CGGetAmgObjectNode;
