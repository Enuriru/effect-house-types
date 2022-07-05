/**
 * @file CGGetPropertyValue.js
 * @author xuyuan
 * @date 2021/8/24
 * @brief CGGetPropertyValue.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGGetPropertyValue extends BaseNode {
  constructor() {
    super();
    this.objects = [];
    this.property = null;
    this.propertyFunc = null;
  }

  getOutput(index) {
    if (this.propertyFunc === null || this.objects.length === 0) {
      return null;
    }
    return this.propertyFunc.getProperty(this.objects, this.property, this.valueType);
  }
}

exports.CGGetPropertyValue = CGGetPropertyValue;
