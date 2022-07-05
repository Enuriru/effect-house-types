-- Math related
function GammaToLinearSpace(value)
    if value <= 0.04045 then
        return value / 12.92
    elseif (value < 1.0) then
        return math.pow((value + 0.055)/1.055, 2.4)
    else 
        return math.pow(value, 2.4)
    end
end

function GammaToLinearSpaceColor(color)
    local lr = GammaToLinearSpace(color.x)
    local lg = GammaToLinearSpace(color.y)
    local lb = GammaToLinearSpace(color.z)
    return Amaz.Vector4f(lr, lg, lb, color.w)
end

kEplison = 0.00005

function FloatEqual(a, b)
    local delta = math.abs(a - b)
    if  delta > kEplison then
        return false
    end
    return true
end

function Exp2(x)
    return math.exp(x * 0.69314718055994530941723212145818)
end

function MaterialSetMacroVector(material,passNum,backend,macrosVector)
    local pass = material.xshader.passes:get(passNum)
    local shader = pass.shaders:get(backend)
    if shader ~=nil then 
        for i = 0 , 1 do 
            -- local macrosVector = Amaz.StringVector()
            -- macrosVector:pushBack(Macro)
            shader:get(i).macros =macrosVector
        end
    end
end

-- Material related
function CreateEmptyMaterial(materialName)
    local emptyMaterial = Amaz.Material()
    emptyMaterial.name = materialName

    local emptyXShader = Amaz.XShader()
    emptyXShader.name = materialName

    emptyMaterial.xshader = emptyXShader

    local emptyProperties = Amaz.PropertySheet()
    emptyMaterial.properties = emptyProperties

    return emptyMaterial
end

function AddPassToMaterial(material, backend, vertCode, fragCode, stencilMasked)
    local newPass = Amaz.Pass()

    local vs = Amaz.Shader()
    vs.type = Amaz.ShaderType.VERTEX
    vs.source = vertCode

    local fs = Amaz.Shader()
    fs.type = Amaz.ShaderType.FRAGMENT
    fs.source = fragCode

    local shaderVec = Amaz.Vector()
    shaderVec:pushBack(vs)
    shaderVec:pushBack(fs)

    local shaderMap = Amaz.Map()
    shaderMap:insert(backend, shaderVec)
    
    newPass.shaders = shaderMap

    local semantics = Amaz.Map()
    semantics:insert("inPosition", Amaz.VertexAttribType.POSITION)   -- all post effect shaders must follow this tradition
    semantics:insert("inTexCoord", Amaz.VertexAttribType.TEXCOORD0)  -- all post effect shaders must follow this tradition
    newPass.semantics = semantics
    
    local depthStencilState = Amaz.DepthStencilState()
    depthStencilState.depthTestEnable = false
    
    local renderState = Amaz.RenderState()
    renderState.depthstencil = depthStencilState

    if stencilMasked ~= nil then
        depthStencilState.stencilTestEnable = true;

        local stencilOp = Amaz.StencilOpState();
        stencilOp.compareOp = Amaz.CompareOp.EQUAL;
        stencilOp.reference = 42;
        stencilOp.writeMask = 0;

        depthStencilState.stencilFront = stencilOp;
        depthStencilState.stencilBack = stencilOp;
    end

    newPass.renderState = renderState

    material.xshader.passes:pushBack(newPass)

    return newPass
end

function CreateRenderTexture(name, width, height, colorFormat)
    local rt = Amaz.RenderTexture()
    rt.name = name
    rt.builtinType = Amaz.BuiltInTextureType.NORMAL
    rt.internalFormat = Amaz.InternalFormat.RGBA8
    rt.dataType = Amaz.DataType.U8norm
    rt.depth = 1
    rt.attachment = Amaz.RenderTextureAttachment.DEPTH24
    rt.filterMag = Amaz.FilterMode.LINEAR
    rt.filterMin = Amaz.FilterMode.LINEAR
    rt.filterMipmap = Amaz.FilterMipmapMode.FilterMode_NONE
    rt.width = width
    rt.height = height
    rt.colorFormat = colorFormat or Amaz.PixelFormat.RGBA8Unorm
    return rt
end

function CreateTexture2D(name, width, height, internalFormat, dataType)
    local tex = Amaz.Texture2D()
    tex.name = name
    tex.width = width
    tex.height = height
    tex.depth = 1
    tex.internalFormat = internalFormat
    tex.dataType = dataType
    tex.filterMag = Amaz.FilterMode.LINEAR
    tex.filterMin = Amaz.FilterMode.LINEAR
    tex.filterMipmap = Amaz.FilterMipmapMode.FilterMode_NONE
    return tex
end

function CreateLUT(width, height)
    local rt = Amaz.RenderTexture();
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
end


function CreateComputeEntity(backend, code)
    local computePipeline = Amaz.AMGComputePipeline();

    local shaderMap = Amaz.Map();
    shaderMap:insert(backend, code);

    computePipeline:compile(shaderMap);

    local computeEntity = computePipeline:newEntity();

    return computeEntity;
end

kGenMaskVS = [[
attribute vec3 inPosition;
attribute vec2 inTexCoord;
varying vec2 uv;
void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv = inTexCoord;
}
]]

kGenMaskFS = [[
#ifdef GL_ES
precision highp float;
precision highp sampler2D;
#endif
varying vec2 uv;
uniform sampler2D _MainTex;
void main()
{
    gl_FragColor = texture2D(_MainTex, uv);
}
]]

kGenMaskFS2 = [[
#ifdef GL_ES
precision highp float;   
precision highp sampler2D;
#endif
varying vec2 uv;
uniform sampler2D _MainTex;
uniform sampler2D maskTexture;
void main()
{
    float mask = texture2D(maskTexture, uv).r;
    gl_FragColor = texture2D(_MainTex, uv) * mask;
}
]]

kBlendBackGroudFS = [[
#ifdef GL_ES
precision highp float;
precision highp sampler2D;
#endif
varying vec2 uv;
uniform sampler2D _MainTex;
uniform sampler2D backgroudTexture;
void main()
{
    vec3 bgColor = texture2D(backgroudTexture, uv).rgb;
    vec4 fgColor = texture2D(_MainTex, uv);
    gl_FragColor = vec4(bgColor * (1.0 - fgColor.a) + fgColor.rgb, fgColor.a);
}
]]

function GetStencilMaskedMaterial()
    gMaskMaterial = CreateEmptyMaterial("Mask");

    AddPassToMaterial(gMaskMaterial, "gles2", kGenMaskVS, kGenMaskFS, true);
    AddPassToMaterial(gMaskMaterial, "gles2", kGenMaskVS, kBlendBackGroudFS);
    AddPassToMaterial(gMaskMaterial, "gles2", kGenMaskVS, kGenMaskFS);
    AddPassToMaterial(gMaskMaterial, "gles2", kGenMaskVS, kGenMaskFS2);
    
    return gMaskMaterial;
end

