/**
 * @file CGGetWorldRotation.js
 * @author Weifeng
 * @date 2021-12-29
 * @brief Get world euler angle of transform component
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGGetWorldRotation extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    if (this.inputs[0] === undefined || this.inputs[0] === null) {
      return new Amaz.Vector3f(0, 0, 0);
    }
    const transform = this.inputs[0]();
    if (transform instanceof Amaz.Transform) {
      return transform.worldEulerAngle;
    } else {
      return new Amaz.Vector3f(0, 0, 0);
    }
  }
}

exports.CGGetWorldRotation = CGGetWorldRotation;
