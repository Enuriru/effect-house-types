const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGEffectResolutionInfo extends BaseNode {
  constructor() {
    super();
  }

  onStart(sys){
    this.outputs[0] = Amaz.AmazingManager.getSingleton("BuiltinObject").getInputTextureWidth();
    this.outputs[1] = Amaz.AmazingManager.getSingleton("BuiltinObject").getInputTextureHeight();
  }

  onUpdate(sys,dt){
    this.outputs[0] = Amaz.AmazingManager.getSingleton("BuiltinObject").getInputTextureWidth();
    this.outputs[1] = Amaz.AmazingManager.getSingleton("BuiltinObject").getInputTextureHeight();
  }
}

exports.CGEffectResolutionInfo = CGEffectResolutionInfo;