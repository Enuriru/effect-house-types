const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGFaceLandmark extends BaseNode {
  constructor() {
    super();
  }

  execute() {
    if (!this.inputs[0]) {
      return;
    }
    let result = Amaz.Algorithm.getAEAlgorithmResult();
    let face106Info = result.getFaceBaseInfo(this.inputs[0]());
    let faceExtraInfo = result.getFaceExtraInfo(this.inputs[0]());
    if (!face106Info) {
      return;
    }
    // Which position (int):
    // cheek, chin, eyeball_left, eyeball_left, eyebrow_left, eyebrow_right, eyelid_left, eyelid_right, forehead, mouth and nose"
    let type = this.inputs[1]();
    switch (type) {
      case 'cheek':
        break;
      case 'eyeball': {
        // 104 -> left eyeball, 105 -> right eyeball
        this.outputs[0] = face106Info.points_array.get(104);
        this.outputs[1] = face106Info.points_array.get(105);
        break;
      }
      case 'eyebrow': {
        // TODO
        break;
      }
      case 'eyelid': {
      }
    }
  }
}

exports.CGFaceLandmark = CGFaceLandmark;
