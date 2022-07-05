const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGWorldPose extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    if (this.inputs[0]() === undefined || this.inputs[0]() === null) {
      return new Amaz.Vector3f(0, 0, 0);
    }
    const transform = this.inputs[0]();
    if (index === 0) {
      console.error('Get World Position', transform);
      return transform.worldPosition;
    } else if (index === 1) {
      return transform.worldEulerAngle;
    } else if (index === 2) {
      return transform.worldScale;
    } else if (index === 3) {
      return transform.up;
    } else if (index === 4) {
      return transform.right;
    } else if (index === 5) {
      return transform.forward;
    }
  }
}

exports.CGWorldPose = CGWorldPose;
