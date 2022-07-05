/**
 * @file BaseNode.js
 * @author xuyuan
 * @date 2021/8/15
 * @brief BaseNode.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

class BaseNode {
  constructor() {
    this.inputs = [];
    this.lastOutputs = [];
    this.outputs = [];
    this.nexts = [];
  }

  setNext(index, func) {
    this.nexts[index] = func;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  getOutput(index) {
    return this.outputs[index];
  }

  execute(sys, index) {}
}

exports.BaseNode = BaseNode;
