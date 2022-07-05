const { Utils } = require("PostProcessing/Base/Utils");
const { kDistortVS, kDistortFS } = require("/PostProcessing/Shaders/DistortShaderGL");
const { kDistortMetalVS, kDistortMetalFS } = require("/PostProcessing/Shaders/DistortShaderMetal");

const Amaz = effect.Amaz;

class DistortShader{
    constructor()
    {
        this.material = null;
    }

    getMaterial() 
    {
        if ( this.material === null )
        {
            var material = Utils.CreateEmptyMaterial("Distort");
            // Distort Pass
            const shaderMapDistort  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapDistort, 'gles2', kDistortVS, kDistortFS);
            Utils.AddShaderToShaderMap(shaderMapDistort, 'metal', kDistortMetalVS, kDistortMetalFS);
            Utils.AddPassToMaterial(material, shaderMapDistort); 
            this.material = material;
        }
        return this.material;
    }
}

exports.DistortShader = DistortShader;