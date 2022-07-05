const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGHandInfo extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    return this.outputs[index];
  }

  execute() {
    let result = Amaz.Algorithm.getAEAlgorithmResult();
    let hand = result.getHandInfo(this.inputs[1]());
    if (!hand) {
      return;
    }
    this.outputs[1] = hand.rect;
    this.outputs[2] = hand.rot_angle;
    this.outputs[3] = hand.key_points_xy;
    this.outputs[4] = hand.scale;
    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }
}

exports.CGHandInfo = CGHandInfo;
