/**
 * @file CGSetPropertyValue.js
 * @author
 * @date 2021/8/24
 * @brief CGSetPropertyValue.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGSetPropertyValue extends BaseNode {
  constructor() {
    super();
    this.objects = [];
    this.property = null;
    this.resource = null;
    this.resourcePath = null;
    this.propertyFunc = null;
    this.valueType = null;
  }

  execute(index) {
    if (
      this.objects.length === 0 ||
      this.property === null ||
      this.inputs[1] === undefined ||
      this.propertyFunc === null
    ) {
      return false;
    }

    let inputValue = this.inputs[1]();
    if (inputValue === null) {
      if (this.valueType === 'Mesh' || this.valueType === 'Material' || this.valueType === 'Texture2D') {
        inputValue = this.resource;
      }
    }

    this.propertyFunc.setProperty(this.objects, this.property, inputValue, this.valueType);
    if (this.nexts[0]) {
      this.nexts[0]();
    }
    return true;
  }
}

exports.CGSetPropertyValue = CGSetPropertyValue;
