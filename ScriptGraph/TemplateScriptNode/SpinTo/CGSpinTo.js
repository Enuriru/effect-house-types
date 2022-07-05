/**
 * @file CGSpinTo.js
 * @author rodrigo cano
 * @date 2022-05-17
 * @brief Creates a new vector from the provided angle axis then does AngleAxisRotation * StartRotation
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGSpinTo extends BaseNode 
{
  constructor() {
    super();
    this._quat = new Amaz.Quaternionf(0,0,0,1);
  }

  getOutput() {
    if (this.inputs[0] == null || this.inputs[1] == null || this.inputs[2] == null)
    {
      return new Vector3f();
    }
    const START_ROT_EULER = this.inputs[0]();
    const UP_DIR = this.inputs[1]();
    const ANGLE_RAD = this.inputs[2]();
    const RAD2DEG = 180.0/Math.PI;
    const DEG2RAD = 1/RAD2DEG;
    
    if(START_ROT_EULER == null || UP_DIR == null || ANGLE_RAD == null)
    {
      return new Vector3f();
    }

    if(UP_DIR.x == 0 && UP_DIR.y == 0 && UP_DIR.z == 0)
    {
      return new Vector3f();
    }

    const START_ROT = this._quat.eulerToQuaternion(Amaz.Vector3f.mul(START_ROT_EULER,DEG2RAD));
    const AXIS_ANGLE_ROT = this._quat.axisAngleToQuaternion(UP_DIR, ANGLE_RAD);
    let endRot = Amaz.Quaternionf.mul(AXIS_ANGLE_ROT, START_ROT);
    endRot = endRot.quaternionToEuler();
    endRot = Amaz.Vector3f.mul(endRot, RAD2DEG);

    return endRot;

  }
}

exports.CGSpinTo = CGSpinTo;
