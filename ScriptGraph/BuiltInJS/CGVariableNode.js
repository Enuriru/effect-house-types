/**
 * @file CGVariableNode.js
 * @author
 * @date 2021/8/24
 * @brief CGVariableNode.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGVariableNode extends BaseNode {
  constructor() {
    super();
    this.variables = null;
    this.variableName = null;
    this.accessType = null;
  }

  getOutput(index) {
    return this.variables[this.variableName];
  }

  execute(index) {
    if (this.accessType === 'SETTER') {
      let inputValue = this.inputs[1]();
      if (inputValue === null) {
        if (this.valueType === 'Texture2D') {
          inputValue = this.resource;
        }
      }
      this.variables[this.variableName] = inputValue;
      if (this.nexts[0]) {
        this.nexts[0]();
      }
    }
  }
}

exports.CGVariableNode = CGVariableNode;
