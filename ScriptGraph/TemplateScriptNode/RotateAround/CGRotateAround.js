/**
 * @file CGRotateAround.js
 * @author runjiatian
 * @date 2022-04-20
 * @brief Rotate a vector
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGRotateAround extends BaseNode {
  constructor() {
    super();
  }

  getOutput() {
    if (this.inputs[0] == null || this.inputs[1]==null || this.inputs[2]==null || this.inputs[3]==null) {
      return null;
    }
    let ptA = this.inputs[0]();
    let ptB = this.inputs[1]();
    let axis = new Amaz.Vector3f(ptB.x - ptA.x, ptB.y - ptA.y, ptB.z - ptA.z);
    let angle = this.inputs[2]();
    let currenPos = this.inputs[3]();
    const v = new Amaz.Vector3f(currenPos.x - ptA.x, currenPos.y - ptA.y, currenPos.z - ptA.z);

    const u = axis.normalize();
    let temp = u.dot(v);
    const resA = new Amaz.Vector3f(temp*u.x, temp*u.y, temp*u.z);
    let tempB = (u.cross(v)).cross(u);
    const resB = new Amaz.Vector3f(tempB.x*Math.cos(angle), tempB.y*Math.cos(angle), tempB.z*Math.cos(angle));
    const resC = new Amaz.Vector3f((u.cross(v)).x * Math.sin(angle),(u.cross(v)).y * Math.sin(angle),(u.cross(v)).z * Math.sin(angle));
    let result = new Amaz.Vector3f(resA.x+resB.x+resC.x,resA.y+resB.y+resC.y,resA.z+resB.z+resC.z);

    return new Amaz.Vector3f(result.x + ptA.x, result.y + ptA.y, result.z + ptA.z);
  }
}

exports.CGRotateAround = CGRotateAround;
