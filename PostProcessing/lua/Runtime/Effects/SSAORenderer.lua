SSAORenderer = ScriptableObject(PostProcessEffectRenderer)

-- pass ids
local GTAOPass = 0
local PostEffectPass = 1
local blurPass = 2

-- perpixel normal
local NORMALS_NONE = 0
local NORMALS_CAMERA = 1
local NORMALS_GBUFFER = 2
local NORMALS_GBUFFER_OCTA_ENCODED = 3

-- uniforms
local u_depthTex = "u_depth_tex"
local u_ssaoTex = "u_ssao_tex"
local u_depthNormalTex = "u_depth_normal_tex"
local u_cameraInvProjection = "u_camera_inv_projection" 
local u_mainTexTexelSize = "u_maintex_texel_size"
local u_uv2View = "u_uv2view"
local u_aoRadius = "u_ao_radius"
local u_useLDepth = "u_use_ldepth"
local u_aoPowExponent = "u_ao_power_exponent"
-- local u_aoBias  = "u_ao_bias"
local u_aoLevels = "u_ao_levels"
local u_aoThickness = "u_ao_thickness"
local u_aoOneOverDepthScale = "u_one_over_depthscale"
local u_aoHalfProjScale = "u_ao_half_proj_scale"
local u_aoFadeParams = "u_ao_fade_params"
local u_aoFadeValues = "u_ao_fade_values"
local u_aoFadeTint = "u_ao_fade_tint"
local u_perPixelNormal = "u_perpixel_normal"
local u_aoBlurSharpness = "u_ao_blur_sharpness"
local u_aoBlurDeltaUV = "u_ao_blur_deltauv"
local u_aoBlurRadius = "u_ao_blur_radius"
local u_flipDepth = "u_flip_depth"

function SSAORenderer : ctor()
    local oneOverDepthScale = (1.0/65504.0)
    if Amaz.Platform.name() == "Android" or Amaz.Platform.name() == "iOS" then
        oneOverDepthScale = 1.0/16376.0
    end
    self.oneOverDepthScale = oneOverDepthScale
end

function SSAORenderer : render(scene, renderContext)
    local settings = self.settings
    local enable = settings["pSSAOEnable"]
    local aoRaidus = settings["pSSAORadius"]
    local aoIntensity = settings["pSSAOIntensity"]
    local aoColor = settings["pSSAOColor"]
    -- local aoBias = settings["pSSAOBias"]
    local aoThickness = settings["pSSAOThickness"]
    local aoPowExponent = settings["pSSAOPowerExponent"]
    local aoFadeEnabled = settings["pSSAOFadeEnabled"]
    local downsampleEnabled = settings["pSSAODownsampleEnabled"]
    local blurEnabled = settings["pSSAOBlurEnable"]
    local blurPasses = settings["pSSAOBlurPasses"]
    local blurRadius = settings["pSSAOBlurRadius"]
    local blurSharpness = settings["pSSAOBlurSharpness"]
    local useMRT = settings["pSSAOUseMRT"]
    local useLinearDepth = settings["pSSAOUseLinearDepth"]
    local flipDepth = settings["pFlipDepth"]


    local commands = renderContext:getCommandBuffer()

    if enable then
        local src = renderContext:getSource()
        local dst = renderContext:getDestination()
        local cam = renderContext:getCamera()
        local ssaoMat = renderContext:getResources():getShaders("ScreenSpaceAmbientOcclusion"):getMaterial()
        local blurMat = renderContext:getResources():getShaders("Blur"):getMaterial()
        local width = renderContext:getScreenWidth()
        local height = renderContext:getScreenHeight()

        local normalDepthTexture = nil
        -- no gbuffers
        if useMRT and (not src.colorTextures or src.colorTextures:size() < 1) then
            print("error: No MRT Used")
            return
        end

        if not src.colorTextures or src.colorTextures:size() < 1 then
            ssaoMat:setInt(u_perPixelNormal, NORMALS_NONE)
        else
            normalDepthTexture = src.colorTextures:get(0)
            ssaoMat:setInt(u_perPixelNormal, NORMALS_GBUFFER)
            ssaoMat:setTex(u_depthNormalTex, normalDepthTexture)
        end
        
        local w = width
        local h = height

        -- set uniforms
        local proj = cam.projectionMatrix
        ssaoMat:setMat4(u_cameraInvProjection, proj:Invert_Full())
        ssaoMat:setVec4(u_mainTexTexelSize, Amaz.Vector4f(1.0/width, 1.0/height, width, height))
        local fovRad = math.rad(cam.fovy) 
        local invHalfTanFov = 1.0 / math.tan(fovRad * 0.5)
        local aspect = (h+ 0.0)/w
        local focalLen = Amaz.Vector2f(invHalfTanFov * aspect, invHalfTanFov) 
        local invFocalLen = Amaz.Vector2f(1.0/focalLen.x, 1.0/focalLen.y)
        
        local uv2View = Amaz.Vector4f(-2.0 * invFocalLen.x, -2.0 * invFocalLen.y,1.0 * invFocalLen.x, 1.0 * invFocalLen.y)
        ssaoMat:setVec4(u_uv2View, uv2View)
        
        --Ambient Occlusion
        ssaoMat:setFloat(u_aoRadius, aoRaidus)
        ssaoMat:setFloat(u_aoPowExponent, aoPowExponent)
        -- ssaoMat:setFloat(u_aoBias, aoBias * aoBias)
        ssaoMat:setVec4(u_aoLevels, Amaz.Vector4f(aoColor.r, aoColor.g, aoColor.b, aoIntensity))

        local invThickness = (1.0 - aoThickness)
        ssaoMat:setFloat(u_aoThickness, (1.0 - invThickness * invThickness) * 0.98)
        ssaoMat:setFloat(u_aoOneOverDepthScale, self.oneOverDepthScale)

        if aoFadeEnabled then

        else
            ssaoMat:setVec2(u_aoFadeParams, Amaz.Vector2f(0.0, 0.0))
            ssaoMat:setVec4(u_aoFadeValues, Amaz.Vector4f(0.0, 0.0, 0.0, 0.0))
            ssaoMat:setVec4(u_aoFadeTint, Amaz.Vector4f(0.0, 0.0, 0.0, 0.0))
        end

        local projScale
        if cam.type == Amaz.CameraType.ORTHO then
            projScale = (height + 0.0) / cam.orthoScale
        else
            projScale = (height + 0.0) / (math.tan( fovRad * 0.5 ) * 2.0)
        end

        if downsampleEnabled then
            projScale = projScale * 0.5 * 0.5
        else
            projScale = projScale * 0.5
        end
        ssaoMat:setFloat(u_aoHalfProjScale, projScale)

        -- obtain g-buffers
        local depthTex = src.depthTexture -- defalut
        if useMRT then
            depthTex = src.colorTextures:get(0)
        else
            depthTex = renderContext:getResources():getTextureByName("depthTex")
        end

        if not depthTex then
            depthTex = src.depthTexture
            -- process depth texture filter
            local platform = Amaz.Platform.name()
            if depthTex  then 
                if flipDepth then 
                    ssaoMat:setFloat(u_flipDepth, 1.0)
                else 
                    ssaoMat:setFloat(u_flipDepth, 0.0)
                end
                if platform == "Android" then 
                    depthTex.filterMag = Amaz.FilterMode.NEARST
                    depthTex.filterMin = Amaz.FilterMode.NEARST
                else 
                    depthTex.filterMag = Amaz.FilterMode.LINEAR
                    depthTex.filterMin = Amaz.FilterMode.LINEAR
                end
            end
        end

        if useLinearDepth then
            ssaoMat:setInt(u_useLDepth, 1)
        else
            ssaoMat:setInt(u_useLDepth, 0)
        end

        -- Blur
        if blurEnabled then
            local sharpness = blurSharpness * 100.0  * cam.zFar * self.oneOverDepthScale
            ssaoMat:setFloat(u_aoBlurSharpness, sharpness)
            -- ssaoMat:setFloat(u_aoBlurRadius, blurRadius)
        end

        if self.dirty then
            commands:clearAll()
            local colorFormat = src.colorFormat

            -- create occlusion depth texture
            local tdepthTex = depthTex--CreateRenderTexture("depth", width, height, colorFormat)
            --commands:blit(depthTex, tdepthTex)

            if tdepthTex then
                ssaoMat:setTex(u_depthTex, tdepthTex)
            end

            local occlusionTex = CreateRenderTexture("occlusion", w, h, colorFormat)
            -- do SSAO
            commands:blitWithMaterial(src, occlusionTex, ssaoMat, GTAOPass)

            local bw = w/2
            local bh = h/2
            -- Create blur temporal tex
            local blurTmpTex  = occlusionTex
            local blurTmpTexA  = CreateRenderTexture("aoBlurTmpB", bw, bh, colorFormat)
            if blurEnabled then
                for i = 0, blurPasses do 
                    print("can test lua SSAO perform blu")
                    local hsheet = Amaz.MaterialPropertyBlock()
                    -- Horizontal
                    local hvec2s = Amaz.Vec2Vector()
                    hvec2s:pushBack(Amaz.Vector2f(1.0/(bw+0.0), 0.0))
                    hsheet:setVec2Vector(u_aoBlurDeltaUV, hvec2s)
                    commands:blitWithMaterialAndProperties(blurTmpTex, blurTmpTexA, ssaoMat, blurPass, hsheet)
                    -- Vertical 
                    local vsheet = Amaz.MaterialPropertyBlock()
                    local vvec2s = Amaz.Vec2Vector()
                    vvec2s:pushBack(Amaz.Vector2f(0.0, 1.0/(bh + 0.0)))
                    vsheet:setVec2Vector(u_aoBlurDeltaUV, vvec2s)
                    commands:blitWithMaterialAndProperties(blurTmpTexA, blurTmpTex, ssaoMat, blurPass, vsheet)
                end
            end

            ssaoMat:setTex(u_ssaoTex, blurTmpTex)
            -- blend with target
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", width, height, colorFormat)
                commands:blitWithMaterial(src, pingpong, ssaoMat, PostEffectPass)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(src, dst, ssaoMat, PostEffectPass)
            end
            
            self.dirty = false
        end
    else
        if self.dirty then
            commands:clearAll()
            self.dirty = false
        end
    end

    local cam = renderContext:getCamera()
    cam.entity.scene:commitCommandBuffer(commands)
end