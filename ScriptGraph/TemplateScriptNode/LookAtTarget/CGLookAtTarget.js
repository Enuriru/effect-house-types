/**
 * @file CGLookAtTarget.js
 * @author runjiatian
 * @date 2022-04-20
 * @brief Set a object to look at another object
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGLookAtTarget extends BaseNode {
  constructor() {
    super();
  }

  execute(index) {
    if (this.inputs[1]==null || this.inputs[2]==null || this.inputs[3]==null || this.inputs[4]==null || this.inputs[5]==null) {
      return;
    }
    let hostTransform = this.inputs[1]();
    const targetPos = this.inputs[2]();

    // will fix cachable constants in the future
    const aimAxis = this.inputs[3]();
    const upAxis = this.inputs[4]();
    const normalVec = new Amaz.Vector3f(0,1,0);

    let isLocal = this.inputs[5]();
    
    let selfPos;

    if(isLocal){
      selfPos = hostTransform.localPosition;
    }
    else{
      selfPos = hostTransform.getWorldPosition();
    }

    const eye = targetPos.sub(selfPos);
    const sideLeft = eye.cross(normalVec);
    const sideRight = normalVec.cross(eye);
    const up = sideLeft.cross(eye);

    let quat;
    
    switch (true) {
      case (aimAxis === upAxis) :
        // Error case, aim = up
        return new Amaz.Vector3f(0.0,0.0,0.0);
        break;
      case (aimAxis === "X" && upAxis === "Y") :
        quat = new Amaz.Quaternionf.lookRotationToQuaternion(up, sideLeft);
        break;
 
      case (aimAxis === "X" && upAxis === "Z") :
        quat = new Amaz.Quaternionf.lookRotationToQuaternion(up, sideRight);
        break;
      case (aimAxis === "Y" && upAxis === "X") :
        quat = new Amaz.Quaternionf.lookRotationToQuaternion(sideRight, eye);
        break;
      case (aimAxis === "Y" && upAxis === "Z") :
        quat = new Amaz.Quaternionf.lookRotationToQuaternion(up, eye);
        break;
      case (aimAxis === "Z" && upAxis === "X") :
        quat = new Amaz.Quaternionf.lookRotationToQuaternion(eye, sideLeft);
        break;
      case (aimAxis === "Z" && upAxis === "Y") :
        quat = new Amaz.Quaternionf.lookRotationToQuaternion(eye, up);
        break;
     }

    if(isLocal){
      hostTransform.localOrientation = quat;
    }
    else{
      hostTransform.setWorldOrientation(quat);
    }

     this.outputs[1] = quat.quaternionToEuler();

     if(this.nexts[0]){
       this.nexts[0]();
     }
  }
}

exports.CGLookAtTarget = CGLookAtTarget;