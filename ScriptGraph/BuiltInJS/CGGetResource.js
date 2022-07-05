/**
 * @file CGGetResource.js
 * @author
 * @date 2021/8/24
 * @brief CGGetResource.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGGetResource extends BaseNode {
  constructor(resType) {
    super();
    this.resourcePath = '';
    this.resource = null;
    this.resType = resType;
  }

  getOutput(index) {
    return this.resType === 'audio' ? this.resourcePath : this.resource;
  }
}

exports.CGGetResource = CGGetResource;
