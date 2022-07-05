SSRRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniforms
local u_depthTex = "u_depth_tex"
local u_backDepthTex = "u_backdepth_tex"
local u_noiseTex = "u_noise_tex"
local u_normalTex = "u_normal_tex"
local u_posTex = "u_pos_tex"
local u_specularParamsTex = "u_specular_param_tex"
local u_ssrTex = "u_ssr_tex"
local u_ssrMaskTex = "u_ssr_mask_tex"
local u_cameraProjection = "u_camera_projection" 
local u_cameraInvProjection = "u_camera_inv_projection"
local u_view2Screen = "u_view2screen"
local u_xyz_mat = "u_cam_xyz_mat"
local u_downsample = "u_downsample"
local u_noiseTexelSize = "u_noise_texel_size"
local u_mainTexTexelSize = "u_maintex_texel_size"
local u_blurDirection = "u_blur_direction"
local u_maxRayDistance = "u_max_ray_distance"
local u_pixelStrideZCutoff= "u_pixel_stridez_cutoff"
local u_iterations = "u_iterations"
local u_pixelStride = "u_pixel_stride"
local u_pixelZSize = "u_pixelz_size"

-- pass ids
local WorldPosPass = 0
local DepthTestPass = 1
local rayTracePass = 0
local blurPass = 0
local ssrCombinePass = 1

function SSRRenderer : ctor()
end

function SSRRenderer : render(scene, renderContext)
    local settings = self.settings
    local enable = settings["pSSREnable"]
    local hdrEnable =  settings["pSSRHdr"]
    local downsample = settings["pSSRDownsample"]
    local blurAmount = settings["pSSRBlurAmount"]
    local maxRayDistance = settings["pSSRMaxRayDistance"]
    local pixelStrideZCutoff = settings["pSSRPixelStrideZCutoff"]
    local iterations = settings["pSSRIterations"]
    local pixelZSize = settings["pSSRPixelZSizeOffset"]
    local pixelStride = settings["pSSRPixelStride"]

    local commands = renderContext:getCommandBuffer()
    local cam = renderContext:getCamera()
    if enable then
        local src = renderContext:getSource()
        local dst = renderContext:getDestination()

        if not src.colorTextures then
            return
        end

        local ssrMat = renderContext:getResources():getShaders("ScreenSpaceReflection"):getMaterial()
        local blurMat = renderContext:getResources():getShaders("Blur"):getMaterial()
        local backDepthCamEnt = renderContext:getScene():findEntityBy("BackDepthCamera")
        
        local width = renderContext:getScreenWidth()
        local height = renderContext:getScreenHeight()
        local colorFormat = Amaz.PixelFormat.RGBA8Unorm
        if hdrEnable then
            colorFormat = Amaz.PixelFormat.RGBA32Sfloat
        end

        -- set settings
        ssrMat:setFloat(u_maxRayDistance, maxRayDistance)
        ssrMat:setFloat(u_pixelStrideZCutoff, pixelStrideZCutoff)
        ssrMat:setInt(u_iterations, iterations)
        ssrMat:setFloat(u_pixelZSize, pixelZSize)
        ssrMat:setInt(u_pixelStride, pixelStride)

        if self.dirty then
            local w = width
            local h = height
            

            --local noiseTex = renderContext:getResources():getTextureByName("noise")
            --local ssrMaskTex = renderContext:getResources():getTextureByName("ssrMask")
            ssrMat:setVec4(u_mainTexTexelSize, Amaz.Vector4f(1.0/w, 1.0/h, w, h))
            blurMat:setVec4(u_mainTexTexelSize, Amaz.Vector4f(1.0/w, 1.0/h, w, h))
            -- Create temporty buffers
            local tempA = CreateRenderTexture("tempA", w/downsample, h/downsample, colorFormat);
            local tempB = CreateRenderTexture("tempB", w/downsample, h/downsample, colorFormat);
            
            --Raytrace
            --obtain g buffers
            local worldNormalTex = src.colorTextures:get(2)
            local specularParamsTex = src.colorTextures:get(1)
            ssrMat:setTex(u_specularParamsTex, specularParamsTex)
            ssrMat:setTex(u_normalTex, worldNormalTex)
            ssrMat:setTex(u_depthTex, src.depthTexture)
            if backDepthCamEnt then
                local backDepthTex = backDepthCamEnt:getComponent("Camera").renderTexture
                ssrMat:setTex(u_backDepthTex, backDepthTex)
            end
            local trs = Amaz.Matrix4x4f()
            trs:SetIdentity()
            local quat = Amaz.Quaternionf()
            quat = quat:identity()
            trs:SetTRS(Amaz.Vector3f(0.5, 0.5, 0.0), quat, Amaz.Vector3f(0.5, 0.5, 1.0))
            local scrScale = Amaz.Matrix4x4f()
            scrScale:SetIdentity()
            scrScale:setScale(Amaz.Vector3f(w, h, 1.0))
            --local rts = Amaz.Matrix4x4f.
            --local srcScale = Amaz.Matrix4x4f.Scale(Amaz.Vector3f(w, h, 1.0))
            local proj = cam.projectionMatrix
            local m = scrScale  * proj
            ssrMat:setMat4(u_cameraProjection, proj)
            ssrMat:setMat4(u_cameraInvProjection, proj:Invert_Full())
            commands:blitWithMaterial(src, tempA, ssrMat, rayTracePass)

            --Blur ssr result
            for i = 1, blurAmount do
                blurMat:setVec2(u_blurDirection, Amaz.Vector2f(0.0, 1.0))
                commands:blitWithMaterial(tempA, tempB, blurMat, blurPass)
                blurMat:setVec2(u_blurDirection, Amaz.Vector2f(1.0, 0.0))
                commands:blitWithMaterial(tempB, tempA, blurMat, blurPass)
            end

            -- Combine ssr result with src
            ssrMat:setTex(u_ssrTex, tempA)
            
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", width, height)
                commands:blitWithMaterial(src, pingpong, ssrMat, ssrCombinePass)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(src, dst, ssrMat, ssrCombinePass)
            end
            self.dirty = false
        else
            if self.dirty then
                commands:clearAll()
                self.dirty = false
                -- to do, if src ~= dst, copy src to dst
            end
        end
    else
        if self.dirty then
            commands:clearAll()
            self.dirty = false
            -- to do, if src ~= dst, copy src to dst
        end
    end

    local cam = renderContext:getCamera()
    cam.entity.scene:commitCommandBuffer(commands)
end