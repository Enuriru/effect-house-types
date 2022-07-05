'use strict';

const effect_api = "undefined" != typeof effect ? effect : "undefined" != typeof tt ? tt : "undefined" != typeof lynx ? lynx : {};
const Amaz = effect_api.getAmaz();

class Utils {
    static addShaderToMap(shaderMap, backend, vert, frag){
        let vs = new Amaz.Shader()
        vs.type = Amaz.ShaderType.VERTEX
        vs.source = vert
    
        let fs = new Amaz.Shader()
        fs.type = Amaz.ShaderType.FRAGMENT
        fs.source = frag
        
        let shaderVec = new Amaz.Vector()
        
        shaderVec.pushBack(vs)
        shaderVec.pushBack(fs)

        shaderMap.insert(backend, shaderVec)
    }

    static addPassToMaterial(material, shaderMap, stencilMasked, blending=false) {
        let newPass = new Amaz.Pass();
        newPass.shaders = shaderMap

        let semantics = new Amaz.Map()
        semantics.insert("inPosition", Amaz.VertexAttribType.POSITION)
        //semantics.insert("inTexCoord", Amaz.VertexAttribType.TEXCOORD0)
        newPass.semantics = semantics
        
        let depthStencilState = new Amaz.DepthStencilState()
        depthStencilState.depthTestEnable = false
        
        let renderState = new Amaz.RenderState()
        renderState.depthstencil = depthStencilState

        if (stencilMasked) {
            depthStencilState.stencilTestEnable = true;

            let stencilOp = new Amaz.StencilOpState();
            stencilOp.compareOp = Amaz.CompareOp.EQUAL;
            stencilOp.reference = 42;
            stencilOp.writeMask = 0;

            depthStencilState.stencilFront = stencilOp;
            depthStencilState.stencilBack = stencilOp;
        }

        if(blending) {
            let attVec = new Amaz.Vector()
            let attDesc = new Amaz.ColorBlendAttachmentState()
            attDesc.blendEnable = blending
            // In 80% case we blend like this
            attDesc.srcColorBlendFactor = Amaz.BlendFactor.SRC_ALPHA
            attDesc.dstColorBlendFactor = Amaz.BlendFactor.ONE_MINUS_SRC_ALPHA
            attDesc.srcAlphaBlendFactor = Amaz.BlendFactor.SRC_ALPHA
            attDesc.dstAlphaBlendFactor = Amaz.BlendFactor.ONE_MINUS_SRC_ALPHA
            attDesc.ColorBlendOp = Amaz.BlendOp.ADD
            attDesc.AlphaBlendOp = Amaz.BlendOp.ADD
            attVec.pushBack(attDesc)
            renderState.colorBlend = new Amaz.ColorBlendState()
            renderState.colorBlend.attachments = attVec
            
        }
        newPass.renderState = renderState

        material.xshader.passes.pushBack(newPass)

        return newPass
    }
    static createEmptyMaterial() {
        let emptyMaterial = new Amaz.Material();
        let emptyXShader = new Amaz.XShader();
        emptyMaterial.xshader = emptyXShader;
        let emptyProperties = new Amaz.PropertySheet();
        emptyMaterial.properties = emptyProperties;
        return emptyMaterial;
    }

    static createRenderTexture(width, height, colorFormat, filterMode = Amaz.FilterMode.LINEAR) {
        let rt = new Amaz.RenderTexture()
        rt.builtinType = Amaz.BuiltInTextureType.NORAML
        rt.internalFormat = Amaz.InternalFormat.RGBA8
        rt.dataType = Amaz.DataType.U8norm
        rt.depth = 1
        rt.attachment = Amaz.RenderTextureAttachment.DEPTH24
        rt.filterMag = filterMode
        rt.filterMin = filterMode
        rt.filterMipmap = Amaz.FilterMipmapMode.NONE
        rt.width = width
        rt.height = height
        rt.colorFormat = colorFormat
        return rt
    }
    
    static createTexture2D(width, height, filterMode=Amaz.FilterMode.LINEAR) {
        let tex = new Amaz.Texture2D()
        tex.width = width
        tex.height = height
        tex.depth = 1
        tex.internalFormat = Amaz.InternalFormat.RGBA8
        tex.dataType = Amaz.DataType.U8norm
        tex.filterMag = filterMode
        tex.filterMin = filterMode
        tex.filterMipmap = Amaz.FilterMipmapMode.FilterMode_NONE
        return tex
    }
}

module.exports.Utils = Utils
