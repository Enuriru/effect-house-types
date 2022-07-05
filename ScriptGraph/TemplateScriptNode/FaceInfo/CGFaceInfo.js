const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGFaceInfo extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    return this.outputs[index];
  }

  execute() {
    if (!this.inputs[1]) {
      return;
    }
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    let result = algMgr.getAEAlgorithmResult();
    let face = result.getFaceBaseInfo(this.inputs[1]());
    if (!face) {
      return;
    }
    this.outputs[1] = face.rect;
    this.outputs[2] = face.yaw;
    this.outputs[3] = face.roll;
    this.outputs[4] = face.pitch;
    let left_eyeball = face.points_array.get(74);
    let right_eyeball = face.points_array.get(77);
    this.outputs[5] = right_eyeball.x - left_eyeball.x;
    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }
}

exports.CGFaceInfo = CGFaceInfo;
