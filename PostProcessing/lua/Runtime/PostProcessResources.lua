PostProcessResources = ScriptableObject()

function PostProcessResources : ctor()
    self.shaders = {}
    self.textures = {}

    -- load
    --Flip
    local flip_shader = FlipShader.new()
    self.shaders["Flip"] = flip_shader
    --Blur
    local blur_shader = BlurShader.new()
    self.shaders["Blur"] = blur_shader
    --SSAO
    local ssao_shader = SSAOShader.new()
    self.shaders["ScreenSpaceAmbientOcclusion"] = ssao_shader
    --Chromatic Aberration
    local chromaticaberration_shader = ChromaticAberrationShader.new()
    self.shaders["ChromaticAberration"] = chromaticaberration_shader
    --Bloom
    local bloom_shader = BloomShader.new()
    self.shaders["Bloom"]  = bloom_shader
    --ColorGrading
    local cg_shader = ColorGradingShader.new()
    self.shaders["ColorGrading"]  = cg_shader
    local lut2d_baker_shader = Lut2DBakerShader.new()
    self.shaders["Lut2DBaker"] = lut2d_baker_shader
    --SSR
    local worldpos_shader = WorldPosShader.new()
    self.shaders["PixelWorldPosition"]  = worldpos_shader
    local ssr_shader = SSRShader.new()
    self.shaders["ScreenSpaceReflection"] = ssr_shader
    --GrayScale
    -- local gray_scale = GrayScaleShader.new()
    -- self.shaders["GrayScale"] = gray_scale
    --Distort
    local distort_shader = DistortShader.new()
    self.shaders["Distort"] = distort_shader
    
    --Vignette
    local vignette_shader = VignetteShader.new()
    self.shaders["Vignette"] = vignette_shader

    --Grain
    local grain_shader = GrainShader.new()
    self.shaders["Grain"] = grain_shader

    -- Final Fxaa
    local fxaa_shader = FxaaShader.new()
    self.shaders["Fxaa"] = fxaa_shader

    local autoExpusure_shader = AutoExposureShader.new()
    self.shaders["AutoExposure"] = autoExpusure_shader

    local lightShafts_shader = LightShaftsShader.new()
    self.shaders["LightShafts"] = lightShafts_shader

    
    local depthOfField_shader = DepthOfFieldShader.new()
    self.shaders["DepthOfField"] = depthOfField_shader

        
    local bokehBlur_shader = BokehBlurShader.new()
    self.shaders["BokehBlur"] = bokehBlur_shader
    local lensflare_shader = LensFlareShader.new()
    self.shaders["LensFlare"] = lensflare_shader

    -- motion blur
    local motionblur_shader = MotionBlurShader.new()
    self.shaders["MotionBlur"] = motionblur_shader

    -- fog
    local fog_shader = FogShader.new()
    self.shaders["Fog"] = fog_shader
end

function PostProcessResources : setTextureByName(name, texture)
    self.textures[name] = texture
end

function PostProcessResources : getTextureByName(name)
    return self.textures[name]
end

function PostProcessResources : getShaders(name)
    return self.shaders[name]
end

