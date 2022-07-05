const {BaseNode} = request('./BaseNode');
const Amaz = effect.Amaz;

// TODO
class CGScreenToWorld extends BaseNode {
  constructor() {
    super();
    this.screenHieght = Amaz.BuiltinObject.getInputTextureHeight();
  }

  getOutput() {
    if (!this.inputs[0]) {
      return;
    }
    let sx = this.inputs[0]().x;
    let sy = this.inputs[0]().y;
    if (!sx || !sy) {
      return;
    }
    let wx = (sx * 2) / this.screenHieght;
    let wy = (sy * 2) / this.screenHieght;
    return new Amaz.Vector3f(wx, wy, 0);
  }
}

exports.CGScreenToWorld = CGScreenToWorld;
