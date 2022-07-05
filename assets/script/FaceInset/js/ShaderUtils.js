const Amaz = effect.Amaz;

// Class: ShaderUtils
// A class containing static utility functions to aid in the creation of script based render/material setups
class ShaderUtils 
{
    // createRenderTexture
    // Creates a new render texture object with size [width, height] and name. Default filtering and data types are applied
    static createRenderTexture(name, width, height) {
        let rt = new Amaz.RenderTexture();
        rt.name = name;
        rt.builtInType = Amaz.BuiltInTextureType.NORMAL;
        rt.internalFormat = Amaz.InternalFormat.RGBA8;
        rt.dataType = Amaz.DataType.U8norm;
        rt.depth = 1;
        rt.attachment = Amaz.RenderTextureAttachment.DEPTH24;
        rt.filterMag = Amaz.FilterMode.LINEAR;
        rt.filterMin = Amaz.FilterMode.LINEAR;
        rt.filterMipmap = Amaz.FilterMipmapMode.NONE;
        rt.width = width;
        rt.height = height;
        return rt;
    }


    // createEmptyMaterial
    // Creates an empty material (or turns an old material into an empty one if provided as an argument)
    static createEmptyMaterial(name, material) {
        let emptyMaterial = null;
        if (material) {
            emptyMaterial = material;
        } else {
            emptyMaterial = new Amaz.Material();
        }
        emptyMaterial.name = name;
        const emptyXShader = new Amaz.XShader();
        emptyXShader.name = name;
        emptyMaterial.xshader = emptyXShader;
        const emptyProperties = new Amaz.PropertySheet();
        emptyMaterial.properties = emptyProperties;
        return emptyMaterial;
    }

    // addPassToMaterial
    // Adds a pass to the material, and returns the pass
    static addPassToMaterial(material, muiltBackendShaderMap) {
        
        let newPass = new Amaz.Pass();
        newPass.shaders = muiltBackendShaderMap;
        const semantics = new Amaz.Map();
        semantics.insert("inPosition", Amaz.VertexAttribType.POSITION);
        semantics.insert("inTexCoord", Amaz.VertexAttribType.TEXCOORD0);
        newPass.semantics = semantics;
        const depthStencilState = new Amaz.DepthStencilState();
        depthStencilState.depthTestEnable = false;
        const renderState = new Amaz.RenderState();
        renderState.depthstencil = depthStencilState;
        newPass.renderState = renderState;
        material.xshader.passes.pushBack(newPass);
        return newPass;
    }

    // getAlphaOverBlendState
    // Custom xshader setup for color layer blending using alpha
    static getAlphaOverBlendState() {
        let colorBlendState = new Amaz.ColorBlendState();
        const attVec = new Amaz.Vector();
        const attState = new Amaz.ColorBlendAttachmentState();
        attState.blendEnable = true;
        attState.srcColorBlendFactor = Amaz.BlendFactor.SRC_ALPHA;
        attState.dstColorBlendFactor = Amaz.BlendFactor.ONE_MINUS_SRC_ALPHA;
        attState.srcAlphaBlendFactor = Amaz.BlendFactor.SRC_ALPHA;
        attState.dstAlphaBlendFactor = Amaz.BlendFactor.ONE_MINUS_SRC_ALPHA;
        attState.ColorBlendOp = Amaz.BlendOp.ADD;
        attState.AlphaBlendOp = Amaz.BlendOp.ADD;
        attVec.pushBack(attState);
        colorBlendState.attachments = attVec;
        return colorBlendState;
    }
}

exports.ShaderUtils = ShaderUtils;