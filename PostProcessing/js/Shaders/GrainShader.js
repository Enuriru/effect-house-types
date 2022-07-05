const { Utils } = require("PostProcessing/Base/Utils");
const { kGrainVS, kGrainFS } = require("/PostProcessing/Shaders/GrainShaderGL");
const { kGrainMetalVS, kGrainMetalFS } = require("/PostProcessing/Shaders/GrainShaderMetal");

const Amaz = effect.Amaz;

class GrainShader{
    constructor()
    {
        this.material = null;
    }

    getMaterial()
    {
        if ( this.material === null )
        {
            var material = Utils.CreateEmptyMaterial("Grain");
            // Grain Pass
            const shaderMapGrain = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapGrain, 'gles2', kGrainVS, kGrainFS);
            Utils.AddShaderToShaderMap(shaderMapGrain, 'metal', kGrainMetalVS, kGrainMetalFS);
            Utils.AddPassToMaterial(material, shaderMapGrain);
            this.material = material;
        }
        return this.material;
    }
}

exports.GrainShader = GrainShader;