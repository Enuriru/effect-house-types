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

    this._inited = false
    this.initialOrientation = new Amaz.Quaternionf()
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

    if (!this._inited) {
      this.initialOrientation = hostTransform.getWorldOrientation();
      this._inited = true;
    }

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
        quat =  Amaz.Quaternionf.lookRotationToQuaternion(up, sideLeft);
        break;
 
      case (aimAxis === "X" && upAxis === "Z") :
        quat =  Amaz.Quaternionf.lookRotationToQuaternion(up, sideRight);
        break;
      case (aimAxis === "Y" && upAxis === "X") :
        quat =  Amaz.Quaternionf.lookRotationToQuaternion(sideRight, eye);
        break;
      case (aimAxis === "Y" && upAxis === "Z") :
        quat =  Amaz.Quaternionf.lookRotationToQuaternion(up, eye);
        break;
      case (aimAxis === "Z" && upAxis === "X") :
        quat =  Amaz.Quaternionf.lookRotationToQuaternion(eye, sideLeft);
        break;
      case (aimAxis === "Z" && upAxis === "Y") :
        quat =  Amaz.Quaternionf.lookRotationToQuaternion(eye, up);
        break;
     }

    if(isLocal){
      hostTransform.localOrientation = quat;
    }
    else{
      hostTransform.setWorldOrientation(quat); //this.initialOrientation.mul(quat)); //.mul(this.initialOrientation));
    }

     this.outputs[1] = quat.quaternionToEuler();

     if(this.nexts[0]){
       this.nexts[0]();
     }
  }
}

exports.CGLookAtTarget = CGLookAtTarget;