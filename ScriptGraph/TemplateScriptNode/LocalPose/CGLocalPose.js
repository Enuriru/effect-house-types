const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGLocalPose extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    if (this.inputs[0]() === undefined || this.inputs[0]() === null) {
      return new Amaz.Vector3f(0, 0, 0);
    }
    const transform = this.inputs[0]();
    if (index === 0) {
      return transform.localPosition;
    } else if (index === 1) {
      return transform.localEulerAngle;
    } else if (index === 2) {
      return transform.localScale;
    } else if (index === 3) {
      const matrix = transform.localMatrix;
      const upDir = matrix.multiplyVector3(new Amaz.Vector3f(0, 1, 0));
      return upDir.normalize();
    } else if (index === 4) {
      const matrix = transform.localMatrix;
      const rightDir = matrix.multiplyVector3(new Amaz.Vector3f(1, 0, 0));
      return rightDir.normalize();
    } else if (index === 5) {
      const matrix = transform.localMatrix;
      const forwardDir = matrix.multiplyVector3(new Amaz.Vector3f(0, 0, 1));
      return forwardDir.normalize();
    }
  }
}

exports.CGLocalPose = CGLocalPose;
