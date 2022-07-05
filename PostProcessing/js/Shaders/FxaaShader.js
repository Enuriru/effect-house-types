const { Utils } = require("PostProcessing/Base/Utils");
const { kFxaaVS, kFxaaFS1 } = require("/PostProcessing/Shaders/FxaaShaderGL");
const { kFxaaMetalVS, kFxaaMetalFS1 } = require("/PostProcessing/Shaders/FxaaShaderMetal");

const Amaz = effect.Amaz;

class FxaaShader{
    constructor()
    {
        this.material = null;
    }

    getMaterial()
    {
        if ( this.material == null )
        {
            var material = Utils.CreateEmptyMaterial("Fxaa")
            // 0. Fxaa Pass
            const shaderMapFxaa  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapFxaa, 'gles2', kFxaaVS, kFxaaFS1);
            Utils.AddShaderToShaderMap(shaderMapFxaa, 'metal', kFxaaMetalVS, kFxaaMetalFS1);
            Utils.AddPassToMaterial(material, shaderMapFxaa); 
            this.material = material
        }
        return this.material
    }
}

exports.FxaaShader = FxaaShader;