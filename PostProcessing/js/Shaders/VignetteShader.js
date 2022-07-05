const { Utils } = require("PostProcessing/Base/Utils");
const { kVignetteVS, kVignetteFS } = require("/PostProcessing/Shaders/VignetteShaderGL");
const { kVignetteMetalVS, kVignetteMetalFS } = require("/PostProcessing/Shaders/VignetteShaderMetal");

const Amaz = effect.Amaz;

class VignetteShader{
    constructor()
    {
        this.material = null;
    }

    getMaterial()
    {
        if (this.material === null)
        {
            var material = Utils.CreateEmptyMaterial("Vignette")
            // Vignette Pass
            const shaderMapVignette = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapVignette, 'gles2', kVignetteVS, kVignetteFS);
            Utils.AddShaderToShaderMap(shaderMapVignette, 'metal', kVignetteMetalVS, kVignetteMetalFS);
            Utils.AddPassToMaterial(material, shaderMapVignette);
            this.material = material
        }
        return this.material
    }
}

exports.VignetteShader = VignetteShader;