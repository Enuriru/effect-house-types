const { kGenMaskVS, kGenMaskFS, kBlendBackGroudFS } = require("PostProcessing/Base/GLShader");
const { kGenMaskMetalVS, kGenMaskMetalFS, kBlendBackGroudMetalFS } = require("PostProcessing/Base/MetalShader");

const Amaz = effect.Amaz;

const kEplison = 0.00005;

class Utils{
    static GammaToLinearSpace(value)
    {
        if (value <= 0.04045)
        {
            return value/12.92;
        }
        else if(value < 1.0)
        {
            return Math.pow((value + 0.055)/1.055, 2.4);
        }
        else
        {
            return Math.pow(value, 2.4);
        }
    }
    
    static GammaToLinearSpaceColor(color)
    {
        var lr = this.GammaToLinearSpace(color.x);
        var lg = this.GammaToLinearSpace(color.y);
        var lb = this.GammaToLinearSpace(color.z);
        return new Amaz.Vector4f(lr, lg, lb, color.w);
    }

    static FloatEqual(a, b)
    {
        var delta = Math.abs(a - b);
        if (delta > kEplison)
        {
            return false;
        }
        return true;
    }

    static CreateEmptyMaterial(materialName)
    {
        var emptyMaterial = new Amaz.Material();
        emptyMaterial.name = materialName;

        var emptyXShader = new Amaz.XShader();
        emptyXShader.name = materialName;
        emptyMaterial.xshader = emptyXShader;

        var emptyProperties = new Amaz.PropertySheet();
        emptyMaterial.properties = emptyProperties;

        return emptyMaterial;
    }
    
    static AddShaderToShaderMap(shaderMap, backend, vert, frag)
    {
        var vs = new Amaz.Shader();
        vs.type = Amaz.ShaderType.VERTEX;
        vs.source = vert;
    
        var fs = new Amaz.Shader();
        fs.type = Amaz.ShaderType.FRAGMENT;
        fs.source = frag;
    
        var shaderVec = new Amaz.Vector();
        shaderVec.pushBack(vs);
        shaderVec.pushBack(fs);
    
        shaderMap.insert(backend, shaderVec);    
    }

    static AddPassToMaterial(material, shaderMap, stencilMasked)
    {
        var newPass = new Amaz.Pass();        
        newPass.shaders = shaderMap;
    
        var semantics = new Amaz.Map();
        semantics.insert("inPosition", Amaz.VertexAttribType.POSITION);   // all post effect shaders must follow this tradition
        semantics.insert("inTexCoord", Amaz.VertexAttribType.TEXCOORD0);  // all post effect shaders must follow this tradition
        newPass.semantics = semantics;
        
        var depthStencilState = new Amaz.DepthStencilState();
        depthStencilState.depthTestEnable = false;
        
        var renderState = new Amaz.RenderState();
        renderState.depthstencil = depthStencilState;
    
        if (stencilMasked) 
        {
            depthStencilState.stencilTestEnable = true;
    
            var stencilOp = new Amaz.StencilOpState();
            stencilOp.compareOp = Amaz.CompareOp.EQUAL;
            stencilOp.reference = 42;
            stencilOp.writeMask = 0;
    
            depthStencilState.stencilFront = stencilOp;
            depthStencilState.stencilBack = stencilOp;
        } 
    
        newPass.renderState = renderState;
        material.xshader.passes.pushBack(newPass);
    
        return newPass;
    }

    static CreateRenderTexture(name, width, height, colorFormat)
    {
        var rt = new Amaz.RenderTexture();
        rt.name = name;
        rt.builtinType = Amaz.BuiltInTextureType.NORMAL;
        rt.internalFormat = Amaz.InternalFormat.RGBA8;
        rt.dataType = Amaz.DataType.U8norm;
        rt.depth = 1
        rt.attachment = Amaz.RenderTextureAttachment.DEPTH24;
        rt.filterMag = Amaz.FilterMode.LINEAR;
        rt.filterMin = Amaz.FilterMode.LINEAR;
        rt.filterMipmap = Amaz.FilterMipmapMode.FilterMode_NONE;
        rt.width = width;
        rt.height = height;
        rt.colorFormat = colorFormat || Amaz.PixelFormat.RGBA8Unorm;
        return rt;
    }

    static CreateTexture2D(name, width, height, internalFormat, dataType)
    {
        var tex = new Amaz.Texture2D();
        tex.name = name;
        tex.width = width;
        tex.height = height;
        tex.depth = 1;
        tex.internalFormat = internalFormat;
        tex.dataType = dataType;
        tex.filterMag = Amaz.FilterMode.LINEAR;
        tex.filterMin = Amaz.FilterMode.LINEAR;
        tex.filterMipmap = Amaz.FilterMipmapMode.FilterMode_NONE;
        return tex;
    }

    static CreateLUT(width, height)
    {
        var rt = new Amaz.RenderTexture();
        rt.builtinType = Amaz.BuiltInTextureType.NORMAL;
        rt.internalFormat = Amaz.InternalFormat.RGBA8;
        rt.dataType = Amaz.DataType.U8norm;
        rt.filterMag = Amaz.FilterMode.NEAREST;
        rt.filterMin = Amaz.FilterMode.NEAREST;
        rt.wrapModeS = Amaz.WrapMode.CLAMP;
        rt.wrapModeT = Amaz.WrapMode.CLAMP;
        rt.depth = 1
        rt.attachment = Amaz.RenderTextureAttachment.DEPTH24
        rt.filterMipmap = Amaz.FilterMipmapMode.FilterMode_NONE
        rt.width = width;
        rt.height = height;
        return rt;
    }


    static CreateComputeEntity(backend, code)
    {
        var computePipeline = new Amaz.AMGComputePipeline();

        var shaderMap = new Amaz.Map();
        shaderMap.insert(backend, code);

        computePipeline.compile(shaderMap);

        var computeEntity = computePipeline.newEntity();

        return computeEntity;
    }

    static GetStencilMaskedMaterial()
    {
        var gMaskMaterial = this.CreateEmptyMaterial("Mask");

        const maskShaderMap = new Amaz.Map();
        this.AddShaderToShaderMap(maskShaderMap, 'gles2', kGenMaskVS, kGenMaskFS);
        this.AddShaderToShaderMap(maskShaderMap, 'metal', kGenMaskMetalVS, kGenMaskMetalFS);

        this.AddPassToMaterial(gMaskMaterial, maskShaderMap);

        const blendShaderMap = new Amaz.Map();
        this.AddShaderToShaderMap(blendShaderMap, 'gles2', kGenMaskVS, kBlendBackGroudFS);
        this.AddShaderToShaderMap(blendShaderMap, 'metal', kGenMaskMetalVS, kBlendBackGroudMetalFS);
        this.AddPassToMaterial(gMaskMaterial, blendShaderMap);
        
        return gMaskMaterial;
    }

}

exports.Utils = Utils;