const { Utils } = require("PostProcessing/Base/Utils");
const { kBloomVS, kExtractBrightFS, kExtractBrightFastModeFS, kDownSampleFS, kDownSampleFastModeFS, kUpSampleFS, kUpSampleFastModeFS, kUpSampleFinalFS, kUpSampleFinalFastModeFS, kBloomFS } = require("/PostProcessing/Shaders/BloomShaderGL");
const { kBloomMetalVS, kExtractBrightMetalFS, kExtractBrightFastModeMetalFS, kDownSampleMetalFS, kDownSampleFastModeMetalFS, kUpSampleMetalFS, kUpSampleFastModeMetalFS, kUpSampleFinalMetalFS, kUpSampleFinalFastModeMetalFS, kBloomMetalFS } = require("/PostProcessing/Shaders/BloomShaderMetal");

const Amaz = effect.Amaz;

class BloomShader{
    constructor()
    {
        this.material = null;
    }

    getMaterial()
    {
        if (this.material == null)
        {
            var material = Utils.CreateEmptyMaterial("Bloom")

            // 0. ExtractBright Pass
            const shaderMapExtractBright  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapExtractBright, 'gles2', kBloomVS, kExtractBrightFS);
            Utils.AddShaderToShaderMap(shaderMapExtractBright, 'metal', kBloomMetalVS, kExtractBrightMetalFS);
            Utils.AddPassToMaterial(material, shaderMapExtractBright);
            // 1. ExtractBright Fast Mode Pass
            const shaderMapExtractBrightFast  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapExtractBrightFast, 'gles2', kBloomVS, kExtractBrightFastModeFS);
            Utils.AddShaderToShaderMap(shaderMapExtractBrightFast, 'metal', kBloomMetalVS, kExtractBrightFastModeMetalFS);
            Utils.AddPassToMaterial(material, shaderMapExtractBrightFast);
            // 2. DownSample Pass
            const shaderMapDownSample  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapDownSample, 'gles2', kBloomVS, kDownSampleFS);
            Utils.AddShaderToShaderMap(shaderMapDownSample, 'metal', kBloomMetalVS, kDownSampleMetalFS);
            Utils.AddPassToMaterial(material, shaderMapDownSample);
            // 3. DownSample Fast Mode Pass
            const shaderMapDownSampleFast  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapDownSampleFast, 'gles2', kBloomVS, kDownSampleFastModeFS);
            Utils.AddShaderToShaderMap(shaderMapDownSampleFast, 'metal', kBloomMetalVS, kDownSampleFastModeMetalFS);
            Utils.AddPassToMaterial(material, shaderMapDownSampleFast);
            // 4. UpSample Pass
            const shaderMapUpSample  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapUpSample, 'gles2', kBloomVS, kUpSampleFS);
            Utils.AddShaderToShaderMap(shaderMapUpSample, 'metal', kBloomMetalVS, kUpSampleMetalFS);
            Utils.AddPassToMaterial(material, shaderMapUpSample);
            // 5. UpSample Fast Mode Pass
            const shaderMapUpSampleFast  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapUpSampleFast, 'gles2', kBloomVS, kUpSampleFastModeFS);
            Utils.AddShaderToShaderMap(shaderMapUpSampleFast, 'metal', kBloomMetalVS, kUpSampleFastModeMetalFS);
            Utils.AddPassToMaterial(material, shaderMapUpSampleFast);
            // 6. UpSample Final Pass
            const shaderMapUpSampleFinal  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapUpSampleFinal, 'gles2', kBloomVS, kUpSampleFinalFS);
            Utils.AddShaderToShaderMap(shaderMapUpSampleFinal, 'metal', kBloomMetalVS, kUpSampleFinalMetalFS);
            Utils.AddPassToMaterial(material, shaderMapUpSampleFinal);
            // 7. UpSample Final FastMode Pass
            const shaderMapUpSampleFinalFast  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapUpSampleFinalFast, 'gles2', kBloomVS, kUpSampleFinalFastModeFS);
            Utils.AddShaderToShaderMap(shaderMapUpSampleFinalFast, 'metal', kBloomMetalVS, kUpSampleFinalFastModeMetalFS);
            Utils.AddPassToMaterial(material, shaderMapUpSampleFinalFast);
            // 8. Bloom Pass
            const shaderMapBloom  = new Amaz.Map();
            Utils.AddShaderToShaderMap(shaderMapBloom, 'gles2', kBloomVS, kBloomFS);
            Utils.AddShaderToShaderMap(shaderMapBloom, 'metal', kBloomMetalVS, kBloomMetalFS);
            Utils.AddPassToMaterial(material, shaderMapBloom);

            this.material = material
        }

        return this.material;
    }
}

exports.BloomShader = BloomShader;