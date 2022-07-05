/**
 * @file CGDot.js
 * @author runjiatian
 * @date 2022/3/23
 * @brief CGDot.js
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGDot extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    let vectorA = this.inputs[0]();
    let vectorB = this.inputs[1]();
    if(vectorA == undefined || vectorB == undefined){
      return;
    }
    return vectorA.dot(vectorB);
  }
}

exports.CGDot = CGDot;
