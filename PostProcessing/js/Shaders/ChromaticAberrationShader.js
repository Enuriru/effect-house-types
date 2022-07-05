const { Utils } = require("PostProcessing/Base/Utils");
const { full_screen_quad_vert, spectral_lut_baker, chromatic_aberration, blend_layer } = require("/PostProcessing/Shaders/ChromaticAberrationShaderGL");
const { full_screen_quad_metal_vert, spectral_lut_baker_metal, chromatic_aberration_metal, blend_layer_metal } = require("/PostProcessing/Shaders/ChromaticAberrationShaderMetal");

const Amaz = effect.Amaz;

class ChromaticAberrationShader{
    constructor()
    {
        this.material = null;
    }

    getMaterial()
    {
        if ( this.material === null ) 
        {
            var material = Utils.CreateEmptyMaterial("chromatic aberration");
            const shaderMapLut  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapLut, 'gles2', full_screen_quad_vert, spectral_lut_baker);
            Utils.AddShaderToShaderMap(shaderMapLut, 'metal', full_screen_quad_metal_vert, spectral_lut_baker_metal);
            Utils.AddPassToMaterial(material, shaderMapLut); 

            const shaderMapChrome  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapChrome, 'gles2', full_screen_quad_vert, chromatic_aberration);
            Utils.AddShaderToShaderMap(shaderMapChrome, 'metal', full_screen_quad_metal_vert, chromatic_aberration_metal);
            Utils.AddPassToMaterial(material, shaderMapChrome); 
        
            const shaderMapBlend  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapBlend, 'gles2', full_screen_quad_vert, blend_layer);
            Utils.AddShaderToShaderMap(shaderMapBlend, 'metal', full_screen_quad_metal_vert, blend_layer_metal);
            Utils.AddPassToMaterial(material, shaderMapBlend); 

            this.material = material;
        }
        return this.material;
    }
}

exports.ChromaticAberrationShader = ChromaticAberrationShader;