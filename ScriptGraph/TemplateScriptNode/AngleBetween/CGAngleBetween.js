/**
 * @file CGAngleBetween.js
 * @author runjiatian
 * @date 2022-04-20
 * @brief Reflect a vector
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGAngleBetween extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    if (this.inputs[0] == null || this.inputs[1]==null) {
      return null;
    }

    const A = this.inputs[0]();
    const B = this.inputs[1]();

    const magA = A.magnitude();
    const magB = B.magnitude();

    if(magA == 0 || magB == 0){
      return null;
    }
    
    //Handling Floating Point Error
    return Math.acos(Math.min(1.0, Math.max(-1.0, A.dot(B)/magA/magB)));
  }
}

exports.CGAngleBetween = CGAngleBetween;
