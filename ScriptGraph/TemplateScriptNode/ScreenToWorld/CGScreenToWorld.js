const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGScreenToWorld extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    if (this.inputs[0] == null|| this.inputs[1] == null || this.inputs[2] == null) {
      return null;
    }

    const screenCoord = this.inputs[0]();
    const sx = screenCoord.x
    const sy = screenCoord.y;
    const sz = this.inputs[1]();

    const camera = this.inputs[2]();

    let wx = Math.min(1.0, Math.max(sx, 0.0));
    let wy = Math.min(1.0, Math.max(sy, 0.0));
    let wz = sz;

    let screenVec3 = new Amaz.Vector3f(wx, wy, wz);
    let worldCoordinate = camera.viewportToWorldPoint(screenVec3);

    if(wz === 0){
      worldCoordinate = new Amaz.Vector3f(wx, wy, 0.0);
    }
    
    return new Amaz.Vector3f(worldCoordinate.x, worldCoordinate.y, worldCoordinate.z);
  }
}

exports.CGScreenToWorld = CGScreenToWorld;