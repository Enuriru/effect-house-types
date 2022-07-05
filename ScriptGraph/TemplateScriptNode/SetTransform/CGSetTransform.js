const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGSetTransform extends BaseNode {
  constructor() {
    super();
    this.isLocal=null;
  }

  execute(index) {
    if (this.inputs[1]==null) {
      return;
    }

    if(this.inputs[5]==null){
      return;
    }

    const selfTransform = this.inputs[1]();
    this.isLocal = this.inputs[5]();

    if(this.inputs[2]!=null){
      const newPos = this.inputs[2]();
      if(this.isLocal){
        selfTransform.localPosition = newPos;
      }
      else{
        selfTransform.setWorldPosition(newPos);
      }
    }

    if(this.inputs[3]!=null){
      const quat = new Amaz.Quaternionf();
      const newRot = this.inputs[3]();
      const orientation = quat.eulerToQuaternion(newRot);

      if(this.isLocal){
        selfTransform.localEulerAngle = newRot;
      }
      else{
        selfTransform.worldEulerAngle = newRot;
      }
    }

    if(this.inputs[4]!=null){
      const newScale = this.inputs[4]();
      if(this.isLocal){
        selfTransform.localScale = newScale;
      }
      else{
        selfTransform.setWorldScale(newScale);
      }
    }

    if(this.nexts[0]!=null){
      this.nexts[0]();
    }
  }
}

exports.CGSetTransform = CGSetTransform;
