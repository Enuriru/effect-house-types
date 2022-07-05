/**
 * @file CGisNil.js
 * @author
 * @date 2021/8/15
 * @brief CGisNil.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGisNil extends BaseNode {
  constructor() {
    super();
  }

  getOutput() {
    if (this.inputs[0]() == null) {
      return true;
    } else {
      return false;
    }
  }
}

exports.CGisNil = CGisNil;
