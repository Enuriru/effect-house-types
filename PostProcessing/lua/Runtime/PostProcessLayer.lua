--Script Component
local exports = exports or {}
local PostProcessLayer = PostProcessLayer or {}

---@class PostProcessLayer : ScriptComponent

----@field pTextureMask Texture [UI(Display="PostProcess Mask Texture")]
----@field pStencilMask Bool [UI(Display="Use Stencil Mask")]

---SSAO
----@field pSSAOEnable Bool [UI(Display="Ambient Occlusion")]
----@field pSSAOIntensity double [UI(Range={0, 5}, Slider, Hidden={} if disableSSAO, Display="Intensity")]
----@field pSSAOColor Color [UI(Hidden={} if disableSSAO, Display="Tint")]
----@field pSSAORadius int [UI(Range={0, 16}, Slider, Hidden={} if disableSSAO, Display="Radius")]
----@field pSSAOBlurEnable Bool [UI(Hidden={} if disableSSAO, Display="Blur Enable")]
----@field pSSAOBlurPasses int [UI(Range={0, 8}, Slider, Hidden={} if disableSSAO, Display="Blur Passes")]
----@field pSSAOBlurSharpness double [UI(Range={0, 200}, Slider, Hidden={} if disableSSAO, Display="Blur Sharpness")]

---SSR
----@field pSSREnable Bool [UI(Display="Screen Space Reflections")]
----@field pSSRHdr Bool [UI(Hidden={} if disableSSR, Display="HDR")]
----@field pSSRIterations int [UI(Hidden={} if disableSSR, Display="Pixel Iterations")]
----@field pSSRPixelStride int [UI(Hidden={} if disableSSR, Display="Pixel Stride")]
----@field pSSRMaxRayDistance double [UI(Hidden={} if disableSSR, Display="Max Ray Distance")]
----@field pSSRPixelStrideZCutoff double [UI(Hidden={} if disableSSR, Display="Pixel Stride Z Cutoff")]

---Bloom
----@field pBloomEnable Bool [UI(Display="Bloom")]
----@field pBloomThreshold double [UI(Range={0, 1}, Slider,Hidden={} if disableBloom, Display="Threshold")]
----@field pBloomColor Vector4f [UI(Hidden={} if disableBloom, Display="BloomColor")]
----@field pBloomDiffuse double [UI(Range={1, 10}, Slider,Hidden={} if disableBloom, Display="Diffuse")]
----@field pBloomIntensity double [UI(Range={0, 30}, Slider,Hidden={} if disableBloom, Display="Intensity")]
----@field pBloomSoftknee double [UI(Range={0, 1}, Slider,Hidden={} if disableBloom, Display="Softknee")]
----@field pBloomAnamorphicRatio double [UI(Range={-1, 1}, Slider,Hidden={} if disableBloom, Display="Anamorphic Ratio")]
----@field pBloomStarEnable Bool [UI(Hidden={} if disableBloom, Display="Star Enable")]
----@field pBloomStarLod int [UI(Range={0, 10}, Slider,Hidden={} if disableBloom, Display="Star Lod")]
----@field pBloomStarRatio double [UI(Range={0, 0.15}, Slider,Hidden={} if disableBloom, Display="Star Ratio")]
----@field pBloomStarIntensity double [UI(Range={0, 5}, Slider,Hidden={} if disableBloom, Display="Star Intensity")]

---ColorGrading
----@field pCGEnable Bool [UI(Display="ColorGrading")]
----@field pCGHdr Bool [UI(Display="hdr")]

    --ToneMapping
    ----@field pCGToneMap_None Bool [UI(Display="None")]
    ----@field pCGToneMap_Neutral Bool [UI(Display="Neutral")]
    ----@field pCGToneMap_ACES Bool [UI(Display="ACES")]
    ----@field pCGToneMap_Custom Bool [UI(Display="Custom")]
    ----@field pCGToneStrength double [UI(Range={0, 1}, Slider,Hidden={} if disableCustomToneMap, Display="ToneStrength")]
    ----@field pCGToneLength double [UI(Range={0, 1}, Slider,Hidden={} if disableCustomToneMap, Display="ToneLength")]
    ----@field pCGShoulderStrength double [UI(Range={0, 1}, Slider,Hidden={} if disableCustomToneMap, Display="ShoulderStrength")]
    ----@field pCGShoulderLength double [UI(Range={0, 10}, Slider,Hidden={} if disableCustomToneMap, Display="ShoulderLength")]
    ----@field pCGShoulderAngle double [UI(Range={0, 1}, Slider,Hidden={} if disableCustomToneMap, Display="pCGShoulderAngle")]
    ----@field pCGToneGamma double [UI(Range={0, 10}, Slider,Hidden={} if disableCustomToneMap, Display="Gamma")]


    -- WhiteBalance
    ----@field pCGTemperature double [UI(Range={-100, 100}, Slider,Hidden={} if disableBloom, Display="Temperature")]
    ----@field pCGTint  double [UI(Range={-100, 100}, Slider,Hidden={} if disableBloom, Display="Tint")]

    -- Tone
    ----@field pCGTone Bool [UI(Display="Tone")]
    ----@field pCGPostExposure double [UI(Hidden={} if disableBloom, Display="Exposure")]
    ----@field pCGColorFilter Vector4f [UI(Hidden={} if disableBloom, Display="ColorFilter")]
    ----@field pCGIntensity double [UI(Range={-10, 10}, Slider,Hidden={} if disableBloom, Display="ColorFilter Intensity")]
    ----@field pCGHueShift double [UI(Range={-180, 180}, Slider,Hidden={} if disableBloom, Display="HueShift")]
    ----@field pCGSaturation double [UI(Range={-100, 100}, Slider,Hidden={} if disableBloom, Display="Saturation")]
    ----@field pCGBrightness double [UI(Range={-100, 100}, Slider,Hidden={} if disableBloom, Display="[LDR]Brightness")]
    ----@field pCGContrast double [UI(Range={-100, 100}, Slider,Hidden={} if disableBloom, Display="Contrast")]

    -- Channel Mixer
        ----@field pCGChannelMixer Bool [UI(Display="ChannelMixer")]
        -- Red Out
            ----@field pCGRedOut Bool [UI(Display="RedOut")]
            ----@field pCGRedOutRedIn double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="RedIn")]
            ----@field pCGRedOutGreenIn  double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="GreenIn")]
            ----@field pCGRedOutBlueIn  double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="BlueIn")]
        -- Green Out
            ----@field pCGGreenOut Bool [UI(Display="GreenOut")]
            ----@field pCGGreenOutRedIn double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="RedIn")]
            ----@field pCGGreenOutGreenIn  double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="GreenIn")]
            ----@field pCGGreenOutBlueIn  double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="BlueIn")]
        -- Blue Out
            ----@field pCGBlueOut Bool [UI(Display="BlueOut")]
            ----@field pCGBlueOutRedIn double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="RedIn")]
            ----@field pCGBlueOutGreenIn  double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="GreenIn")]
            ----@field pCGBlueOutBlueIn  double [UI(Range={-200, 200}, Slider,Hidden={} if disableBloom, Display="BlueIn")]
    --Trackballs
        ----@field pCGTrackballs Bool [UI(Display="Trackballs")]
        ----@field pCGLift Vector4f [UI(Hidden={} if disableBloom, Display="Lift")]
        ----@field pCGGamma Vector4f [UI(Hidden={} if disableBloom, Display="Gamma")]
        ----@field pCGGrain Vector4f [UI(Hidden={} if disableBloom, Display="Grain")]

        
    --TODO  Grading Curves
        
---FXAA
----@field pFxaaEnable Bool [UI(Display="FXAA")]

---ChromaticAberration
----@field pChromaticAberrationEnable Bool [UI(Display="Chromatic Aberration")]
----@field pSpectralLut Texture2D [UI(Hidden={} if disableChromaticAberration,Display="SpectralLut")]
----@field pFastChromaticAberration Bool [UI(Hidden={} if disableChromaticAberration,Display="Fast Mode")]
----@field pChromaticAberrationIntensity double [UI(Hidden={} if disableChromaticAberration, Display="Intensity")]

---Distort
----@field pDistortEnable Bool [UI(Display="Distort")]
----@field pDistortBarrelPower double [UI(Range={-1, 1}, Slider,Hidden={} if disableDistort,Display="u_barrelPower")]
----@field pDistortRotation double [UI(Range={-360, 360}, Slider,Hidden={} if disableDistort,Display="u_rotation")]
----@field pDistortZoom double [UI(Range={-1, 1}, Slider,Hidden={} if disableDistort, Display="u_zoom")]
----@field pDistortAmplitude Vector2f [UI(Drag=0.1,Hidden={} if disableDistort, Display="u_amplitude")]
----@field pDistortFrequency Vector2f [UI(Drag=0.1, Slider,Hidden={} if disableDistort, Display="u_frequency")]
----@field pDistortSpeed Vector2f [UI(Drag=0.1, Slider,Hidden={} if disableDistort, Display="u_speed")]
----@field pDistortOffset Vector2f [UI(Drag=0.1, Slider,Hidden={} if disableDistort, Display="u_offset")]

---Vignette
----@field pVignetteEnable Bool [UI(Display="Vignette")]
----@field pVignettePower double [UI(Range={0.0, 10.0}, Slider,Hidden={} if disableVignette,Display="VignettePower")]
----@field pVignetteContrast double [UI(Range={1.0, 50.0}, Slider,Hidden={} if disableVignette,Display="VignetteContrast")]

---Grain
----@field pGrainEnable Bool [UI(Display="Grain")]
----@field pGrainStrength double [UI(Range={0.0, 1.0}, Slider,Hidden={} if disableGrain,Display="GrainStrength")]
----@field pGrainColor double [UI(Range={0.0, 1.0}, Slider,Hidden={} if disableGrain,Display="GrainColor")]
----@field pGrainSpeed double [UI(Range={0.0, 10.0}, Slider,Hidden={} if disableGrain,Display="GrainSpeed")]

---AutoExposure
----@field pAutoExposureEnable Bool [UI(Display="AutoExposure")]
----@field pFilteringMax double [UI(Range={1.0, 99.0}, Slider,Hidden={} if disableAutoExposure,Display="FilteringMax")]
----@field pFilteringMin double [UI(Range={1.0, 99.0}, Slider,Hidden={} if disableAutoExposure,Display="FilteringMin")]
----@field pMinimum double [UI(Range={-9.0, 9.0}, Slider,Hidden={} if disableAutoExposure,Display="Minimum")]
----@field pMaximum double [UI(Range={-9.0, 9.0}, Slider,Hidden={} if disableAutoExposure,Display="Maximum")]
----@field pExposureCompensation double [UI(Hidden={} if disableAutoExposure,Display="ExposureCompensation")]
----@field pAdaptationType string [UI(Option={"Progressive", "Fixed","Simple"},Hidden={} if disableAutoExposure,Display="AdaptationType")]
----@field pSpeedUp double [UI(Hidden={} if disableAutoExposure,Display="SpeedUp")]
----@field pSpeedDown double [UI(Hidden={} if disableAutoExposure,Display="SpeedDown")]




---LightShafts
----@field pLightShatfsEnable Bool [UI(Display="LightShafts")]
----@field pDirectionalLight Transform OCCLUSION
----@field pLightShatfsOcclusionEnable Bool [UI(Hidden={} if disableLightShafts,Display="EnableLightShaftsOcclusion")]
----@field pOcclusionMaskDarkness double [UI(Hidden={} if disableLightShafts,Display="OcclusionMaskDarkness")]
----@field pOcclusionDepthRange double [UI(Hidden={} if disableLightShafts,Display="OcclusionDepthRange")]
----@field pLightShatfsBloomEnable Bool [UI(Hidden={} if disableLightShafts,Display="EnableLightShaftsBloom")]
----@field pLSBloomScale double [UI(Hidden={} if disableLightShafts,Display="BloomScale")]
----@field pLSBloomThreshold double [UI(Hidden={} if disableLightShafts,Display="BloomThreshold")]
----@field pLSBloomMaxBrightness double [UI(Hidden={} if disableLightShafts,Display="BloomMaxBrightness")]
----@field pLSBloomTint Vector4f [UI(Hidden={} if disableLightShafts, Display="BloomTint")]

---Depth Of Field
----@field pDOFEnable Bool [UI(Display="DepthOfFiled")]
----@field pFocusDistance double [UI(Hidden={} if disableDOF,Display="FocusDistance")]
----@field pAperture double [UI(Hidden={} if disableDOF,Display="Aperture")]
----@field pFocalLength double [UI(Hidden={} if disableDOF,Display="FocalLength")]
----@field pMaxBlurSize string [UI(Option={"Small", "Medium","Large","VeryLarge"},Hidden={} if disableDOF,Display="MaxBlurSize")]

---Bokeh blur
----@field pBokehBlurEnable Bool [UI(Display="BokehBlur")]
----@field pBokehBlurSize double [UI(Hidden={} if disableBokehBlur,Display="BokehBlurSize")]
----@field pBokehBlurIteration int [UI(Hidden={} if disableBokehBlur, Display="BlurhIteration")]
----@field pBokehShape string [UI(Option={"Circle", "Hexagon"},Hidden={} if disableBokehBlur,Display="BokehShape")]
----@field pFastCircle Bool [UI(Hidden={} if disableBokehBlur,Display="FastCircle")]
----@field pDownSample int  [UI(Hidden={} if disableBokehBlur, Display="DownSample")]
---Lens Flare
----@field pLensFlareEnable Bool [UI(Display="LensFlare")]
----@field pFlarePos Vector2f [UI(Drag=0.1, Slider,Hidden={} if disableLensFlare, Display="u_pos")]

----Motion Blur
----@field pMotionBlurEnable Bool [UI(Display="MotionBlur")]
----@field pBlurStrength double [UI(Range={0.0, 1.0}, Slider, Hidden={} if disableMotionBlur, Display="MotionBlurStrength")]

----Fog 
----@field pFogEnable Bool [UI(Display="Fog")]
----@field pFogParams Vector2f [UI(Drag=1, Slider, Hidden={} if disableFog, Display="pFogParams")]
----@field pFogColor Color [UI(Hidden={} if disableFog, Display="pFogColor")]

PostProcessLayer.__index = PostProcessLayer

function PostProcessLayer:importCustomEffects(path)
    --GrayScale
    --includeAbsolutePath(path .. "GrayScale.shader")
    --includeAbsolutePath(path .. "GrayScaleRenderer")
    --includeAbsolutePath(path .. "GrayScale")
end

function PostProcessLayer:importBuitinEffects(path)
    includeAbsolutePath(path .. "PostProcessing/Shaders/Blur.shader")
    includeAbsolutePath(path .. "PostProcessing/Shaders/Flip.shader")
    --SSAO
    includeAbsolutePath(path .. "PostProcessing/Shaders/SSAO.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/SSAORenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/SSAO")
    --ChromaticAberration
    includeAbsolutePath(path .. "PostProcessing/Shaders/ChromaticAberration.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/ChromaticAberrationRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/ChromaticAberration")  
    --Bloom
    includeAbsolutePath(path .. "PostProcessing/Shaders/Bloom.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/BloomRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/Bloom")
    --Color Grading
    includeAbsolutePath(path .. "PostProcessing/Shaders/Lut2DBaker.shader")
    includeAbsolutePath(path .. "PostProcessing/Shaders/ColorGrading.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/ColorGradingRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/ColorGrading")
    --SSR
    includeAbsolutePath(path .. "PostProcessing/Shaders/WorldPos.shader")
    includeAbsolutePath(path .. "PostProcessing/Shaders/SSR.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/SSRRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/SSR")
    -- Fxaa
    includeAbsolutePath(path .. "PostProcessing/Shaders/Fxaa.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/FxaaRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/Fxaa")
    -- Distort
    includeAbsolutePath(path .. "PostProcessing/Shaders/Distort.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/DistortRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/Distort")
    -- Vignette
    includeAbsolutePath(path .. "PostProcessing/Shaders/Vignette.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/VignetteRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/Vignette")
    -- Grain
    includeAbsolutePath(path .. "PostProcessing/Shaders/Grain.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/GrainRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/Grain")

    -- AutoExposure
    includeAbsolutePath(path .. "PostProcessing/Shaders/AutoExposure.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/AutoExposureRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/AutoExposure")

    -- LightShafts
    includeAbsolutePath(path .. "PostProcessing/Shaders/LightShafts.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/LightShaftsRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/LightShafts")

    -- DepthOfField
    includeAbsolutePath(path .. "PostProcessing/Shaders/DepthOfField.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/DepthOfFieldRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/DepthOfField")

    -- BokehBlur
    includeAbsolutePath(path .. "PostProcessing/Shaders/BokehBlur.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/BokehBlurRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/BokehBlur")

    -- LensFlare
    includeAbsolutePath(path .. "PostProcessing/Shaders/LensFlare.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/LensFlareRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/LensFlare")

    -- MotionBlur
    includeAbsolutePath(path .. "PostProcessing/Shaders/MotionBlur.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/MotionBlurRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/MotionBlur")

    -- Fog
    includeAbsolutePath(path .. "PostProcessing/Shaders/Fog.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/FogRenderer")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Effects/Fog")
end

function PostProcessLayer:importFramework(path)
    includeAbsolutePath(path .. "PostProcessing/Base/Utils")
    includeAbsolutePath(path .. "PostProcessing/Base/ScriptableObject")
    includeAbsolutePath(path .. "PostProcessing/Shaders/Base.shader")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Utils/ColorUtilities")
    includeAbsolutePath(path .. "PostProcessing/Runtime/Utils/HableCurve")
    includeAbsolutePath(path .. "PostProcessing/Runtime/PostProcessResources")
    includeAbsolutePath(path .. "PostProcessing/Runtime/PostProcessSettings")
    includeAbsolutePath(path .. "PostProcessing/Runtime/PostProcessRenderContext")
    includeAbsolutePath(path .. "PostProcessing/Runtime/PostProcessEffectRenderer")
end

function PostProcessLayer:import(path)
    self:importFramework(path)
    self:importBuitinEffects(path)
    self:importCustomEffects(path)
end

function PostProcessLayer.new(construct, ...)
    local self = setmetatable({}, PostProcessLayer)

    self.pTextureMask = nil
    self.pStencilMask = false

    --UI Default Value
    self.pSSAOEnable = false
    self.pSSAOIntensity = 1.0
    self.pSSAORadius = 5
    self.pSSAOPowerExponent = 1.8
    -- self.pSSAOBias = 0.05
    self.pSSAOThickness = 1.0
    self.pSSAOBlurEnable = true
    self.pSSAOBlurPasses = 1.0
    self.pSSAOBlurRadius = 4.0
    self.pSSAOBlurSharpness = 100.0

    self.pCGToneStrength = 0.0
    self.pCGToneLength  = 0.5
    self.pCGShoulderStrength = 0.0
    self.pCGShoulderLength = 0.5
    self.pCGShoulderAngle = 0.0
    self.pCGToneGamma = 1.0

    self.pCGTemperature =0.0
    self.pCGTint = 0.0
    self.pCGPostExposure = 0.0

    self.pCGColorFilter = Amaz.Vector4f(1, 1, 1, 1)
    self.pCGIntensity = 0
    self.pCGHueShift = 0
    self.pCGSaturation = 0
    self.pCGBrightness = 0
    self.pCGContrast = 0

    self.pCGRedOutRedIn = 100
    self.pCGGreenOutGreenIn = 100
    self.pCGBlueOutBlueIn = 100

    self.pCGLift = Amaz.Vector4f(0, 0, 0, 0)
    self.pCGGamma = Amaz.Vector4f(0, 0, 0, 0)
    self.pCGGrain = Amaz.Vector4f(0, 0, 0, 0)

    self.pFocalLength = 50
    self.pAperture = 5.6
    self.pFocusDistance = 10
    self.pMaxBlurSize = "Medium"
    self.pBokehBlurSize = 1.0
    self.pBokehBlurIteration = 5
    self.pBokehShape ="Hexagon"
    self.pFastCircle = false
    self.pDownSample = 2.0

    -- fog default value
    self.pFogParams = Amaz.Vector2f(1.0, 20.0)

    self.pSSREnable = false
    self.pBloomEnable = false
    self.pFxaaEnable = false
    self.pChromaticAberrationEnable = false
    self.pDistortEnable = false
    self.pVignetteEnable = false
    self.pGrainEnable = false
    self.pAutoExposureEnable = false
    self.pLightShatfsEnable = false
    self.pCGToneMap_Custom = false
    self.pDOFEnable = false
    self.pBokehBlurEnable = false
    self.pLensFlare = false
    self.pMotionBlur = false
    self.pFog = false

    --ColorGrading
    self.pCGMode = nil
    
    self.comps = {}
    self.compsdirty = true
    self.context = nil
    self.effects = {}

    self.enabled = false

    self.srcCopy = nil
    self.dstCopy = nil
    self.commands1_texture = Amaz.CommandBuffer()
    self.commands1_stencil = Amaz.CommandBuffer()
    self.commands2 = Amaz.CommandBuffer()

    self.maskMaterial = nil
    self.depthRT = nil
    self.outputRT = nil
    self.camHasDepth = false
    return self
end


function PostProcessLayer:disableSSAO()
    return not self.pSSAOEnable
end

function PostProcessLayer:disableSSR()
    return not self.pSSREnable
end

function PostProcessLayer:disableBloom()
    return not self.pBloomEnable
end

function PostProcessLayer:disableFxaa()
    return not self.pFxaaEnable
end

function PostProcessLayer:disableChromaticAberration()
    return not self.pChromaticAberrationEnable
end
function PostProcessLayer:disableDistort()
    return not self.pDistortEnable
end

function PostProcessLayer:disableVignette()
    return not self.pVignetteEnable
end

function PostProcessLayer:disableGrain()
    return not self.pGrainEnable
end

function PostProcessLayer:disableAutoExposure()
    return not self.pAutoExposureEnable
end

function PostProcessLayer:disableLightShafts()
    return not self.pAutoExposureEnable
end

function PostProcessLayer:disableCustomToneMap()
    return not self.pAutoExposureEnable
end

function PostProcessLayer:disableDOF()
    return not self.pDOFEnable
end

function PostProcessLayer:disableBokehBlur()
    return not self.pBokehBlurEnable
end

function PostProcessLayer:disableLensFlare()
    return not self.pLensFlareEnable
end

function PostProcessLayer:disableMotionBlur()
    return not self.pMotionBlurEnable
end

function PostProcessLayer:disableFog()
    return not self.pFogEnable
end

function PostProcessLayer:constructor()
end

function PostProcessLayer:onStart(comp, sys)
    local scene = comp.entity.scene
    local assetMgr = scene.assetMgr
    local rootDir = assetMgr.rootDir
    self:import(rootDir.."lua/")
    
    -- Create PostProcess Render Context
    self.context = PostProcessRenderContext.new()
    --load resources
    if Amaz.Platform.name() == "Android" or Amaz.Platform.name() == "iOS" then
        local internalLut2D = assetMgr:SyncLoad(rootDir.."lua/PostProcessing/Textures/ppInternalLut2D.png")
        self.context:getResources():setTextureByName("internalLut2D", internalLut2D)
    end

    -- LensFlare noise texture
    local internalLensFlareNoise = assetMgr:SyncLoad(rootDir.."lua/PostProcessing/Textures/lensflarenoise.png")
    self.context:getResources():setTextureByName("internalLensFlareNoise", internalLensFlareNoise)

    --find depth camera
    local depthCamEnt = scene:findEntityBy("DepthCamera")
    if depthCamEnt ~= nil then
        local depthCam = depthCamEnt:getComponent("Camera")
        self.context:getResources():setTextureByName("depthTex", depthCam.renderTexture)
    end

    local camera = comp.entity:getComponent("Camera")
    if camera then
        sys:addScriptListener(camera, Amaz.CameraEvent.RENDER_IMAGE_EFFECTS, "renderImageEffects", sys)

        local clearType = camera.clearType;
        if clearType == Amaz.CameraClearType.DEPTH then
            camera.clearType = Amaz.CameraClearType.DEPTH_STENCIL
        elseif clearType == Amaz.CameraClearType.COLOR_DEPTH then
            camera.clearType = Amaz.CameraClearType.COLOR_DEPTH_STENCIL
        end

        self.maskMaterial = GetStencilMaskedMaterial();

        local colorFormat = Amaz.PixelFormat.RGBA8Unorm;
        if (camera.renderTexture.realColorFormat == Amaz.PixelFormat.RGBA16Sfloat or camera.renderTexture.realColorFormat == Amaz.PixelFormat.RGBA32Sfloat) then
            colorFormat = camera.renderTexture.colorFormat;
        end

        self.srcCopy = CreateRenderTexture("srcCopy", camera.renderTexture.width, camera.renderTexture.height, colorFormat);
        
        self.commands1_texture:blitWithMaterial(camera.renderTexture, self.srcCopy, self.maskMaterial, 2);
        self.commands1_texture:setRenderTexture(camera.renderTexture);
        self.commands1_texture:clearRenderTexture(true, false, Amaz.Color(0, 0, 0, 0), 1.0);
        self.commands1_texture:setRenderTexture(nil);
        self.commands1_texture:blitWithMaterial(self.srcCopy, camera.renderTexture, self.maskMaterial, 3)

        self.commands1_stencil:blitWithMaterial(camera.renderTexture, self.srcCopy, self.maskMaterial, 2);
        self.commands1_stencil:setRenderTexture(camera.renderTexture);
        self.commands1_stencil:clearRenderTexture(true, false, Amaz.Color(0, 0, 0, 0), 1.0);
        self.commands1_stencil:setRenderTexture(nil);
        self.commands1_stencil:blitWithMaterial(self.srcCopy, camera.renderTexture, self.maskMaterial, 0)
        
        self.dstCopy = CreateRenderTexture("dstCopy", camera.renderTexture.width, camera.renderTexture.height, colorFormat);
        self.commands2:blitWithMaterial(camera.renderTexture, self.dstCopy, self.maskMaterial, 2);
        
        self.maskMaterial:setTex("backgroudTexture", self.srcCopy)
        self.commands2:blitWithMaterial(self.dstCopy, camera.renderTexture, self.maskMaterial, 1)

        self.camera = camera
        self.context:setCamera(camera)
        self.context:setSource(camera.renderTexture)
        self.context:setDestination(camera.renderTexture)
        self.context:setScreenWidth(camera.renderTexture.width)
        self.context:setScreenHeight(camera.renderTexture.height)
        -- PostProcessing Stack
        self.effects["SSAO"] = SSAO.new()
        self.effects["AutoExposure"] = AutoExposure.new()
        self.effects["ChromaticAberration"] = ChromaticAberration.new()
        self.effects["Bloom"] = Bloom.new()
        self.effects["ColorGrading"] = ColorGrading.new()
        self.effects["SSR"] = SSR.new()
        self.effects["Fxaa"] = Fxaa.new()
        self.effects["Distort"] = Distort.new()
        self.effects["Vignette"] = Vignette.new()
        self.effects["Grain"] = Grain.new()
        self.effects["LightShafts"] = LightShafts.new()
        self.effects["DepthOfField"] = DepthOfField.new()
        self.effects["BokehBlur"] = BokehBlur.new()
        self.effects["LensFlare"] = LensFlare.new()
        self.effects["MotionBlur"] = MotionBlur.new()
        self.effects["Fog"] = Fog.new()

        self.enabled = true
        if self.camera.renderTexture then
            if self.camera.renderTexture.builtinType == Amaz.BuiltInTextureType.OUTPUT then 
                if Amaz.Platform.name() ~= "Android" and Amaz.Platform.name() ~= "iOS" then
                    self.effects["SSAO"]:flipDepth(false)
                else 
                    self.effects["SSAO"]:flipDepth(true)
                end
                self.outputRT = scene:getOutputRenderTexture()
                Amaz.LOGI("SSAO", "output get...")
            else 
                self.outputRT = self.camera.renderTexture
            end
            
            if self.outputRT.depthTexture ~= nil then 
                self.camHasDepth = true
            else 
                ----load depth rt
                self.depthRT = assetMgr:SyncLoad("lua/PostProcessing/Textures/depth.rt")
            end
        end
    end
end

function PostProcessLayer:onUpdate(comp, deltaTime)

    self.maskMaterial:setTex("maskTexture", self.pTextureMask)
    self.context:setDeltaTime(deltaTime)
    --TODO: Editor?
    self:configureCameraRTParames(comp, self.outputRT)
    self.effects["SSAO"]:update(comp.properties)
    self.effects["AutoExposure"]:update(comp.properties)
    self.effects["ChromaticAberration"]:update(comp.properties)
    self.effects["Bloom"]:update(comp.properties) 
    self.effects["ColorGrading"]:update(comp.properties)
    self.effects["SSR"]:update(comp.properties)
    self.effects["Fxaa"]:update(comp.properties)
    self.effects["Distort"]:update(comp.properties)
    self.effects["Vignette"]:update(comp.properties)
    self.effects["Grain"]:update(comp.properties)
    self.effects["LightShafts"]:update(comp.properties)
    self.effects["DepthOfField"]:update(comp.properties)
    self.effects["BokehBlur"]:update(comp.properties)
    self.effects["LensFlare"]:update(comp.properties)
    self.effects["MotionBlur"]:update(comp.properties)
    self.effects["Fog"]:update(comp.properties)

end

function PostProcessLayer:renderImageEffects(sys, camera, eventType)
    if eventType == Amaz.CameraEvent.RENDER_IMAGE_EFFECTS and self.enabled then

        local hasMask = 0;
        if self.pStencilMask then
            hasMask = 1;
        elseif self.pTextureMask ~= nil then
            hasMask = 2;
        end

        if hasMask == 1 then
            camera.entity.scene:commitCommandBuffer(self.commands1_stencil);
        elseif hasMask == 2 then
            camera.entity.scene:commitCommandBuffer(self.commands1_texture);
        end

        self.effects["SSAO"]:render(camera.entity.scene, self.context)
        self.effects["SSR"]:render(camera.entity.scene, self.context)
        --DOF
        self.effects["DepthOfField"]:render(camera.entity.scene, self.context)
        --Auto Exposure
        self.effects["AutoExposure"]:render(camera.entity.scene, self.context)
        --Motion Blur
        -- Distort
        self.effects["Distort"]:render(camera.entity.scene, self.context)
        -- LensFlare
        self.effects["LensFlare"]:render(camera.entity.scene, self.context)
        -- ChromaticAberration
        self.effects["ChromaticAberration"]:render(camera.entity.scene, self.context)
        -- bloom
        self.effects["Bloom"]:render(camera.entity.scene, self.context)
          --lightShafts
        self.effects["LightShafts"]:render(camera.entity.scene, self.context)

        -- Vignette
        self.effects["Vignette"]:render(camera.entity.scene, self.context)
        -- Grain
        self.effects["Grain"]:render(camera.entity.scene, self.context)
        --ColorGrading
        self.effects["ColorGrading"]:render(camera.entity.scene, self.context)
        -- The Final Pass
        self.effects["Fxaa"]:render(camera.entity.scene, self.context)

        -- Bokeh Blur
        self.effects["BokehBlur"]:render(camera.entity.scene, self.context)

        -- Motion Blur
        self.effects["MotionBlur"]:render(camera.entity.scene, self.context)

        -- Fog 
        self.effects["Fog"]:render(camera.entity.scene, self.context)
        if hasMask > 0 then
            camera.entity.scene:commitCommandBuffer(self.commands2);
        end
    end
end

function PostProcessLayer:configureCameraRTParames(comp, src)
    if not self.camHasDepth then 
        if not comp.properties:has("pSSAOEnable") and not comp.properties:has("pLightShatfsEnable") then
            return
        else 
            local ssaoEnable = comp.properties:get("pSSAOEnable")
            local lightShaftsEnable = comp.properties:get("pLightShatfsEnable")
            if ssaoEnable or lightShaftsEnable then 
                src.depthTexture = self.depthRT
            else
                src.depthTexture = nil
            end 
        end
        self.camHasDepth = true
    end
end

function PostProcessLayer:onEnable()
    self.enabled = true;
end

function PostProcessLayer:onDisable()
    self.enabled = false;
end

exports.PostProcessLayer = PostProcessLayer
return exports
