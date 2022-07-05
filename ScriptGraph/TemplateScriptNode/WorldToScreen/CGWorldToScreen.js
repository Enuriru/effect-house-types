const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGWorldToScreen extends BaseNode {
  constructor() {
    super();
    this.screenHeight = Amaz.AmazingManager.getSingleton('BuiltinObject').getInputTextureHeight();
  }

  getOutput() {
    const camera = this.inputs[1]();
    const worldPos = this.inputs[0]();
    if (camera === null) {
      return new Amaz.Vector2f(0, 0);
    }
    const screenPos = camera.worldToViewportPoint(worldPos);
    return new Amaz.Vector2f(screenPos.x, screenPos.y);
    // let wx = this.inputs[0]().x;
    // let wy = this.inputs[0]().y;
    // if (wx === undefined || wy === undefined) {
    //   return;
    // }
    // let sx = (wx * this.screenHeight) / 2;
    // let sy = (wy * this.screenHeight) / 2;
    // return new Amaz.Vector2f(sx, sy);
  }
}

exports.CGWorldToScreen = CGWorldToScreen;
