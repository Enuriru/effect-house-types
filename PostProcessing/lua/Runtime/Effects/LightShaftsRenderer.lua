LightShaftsRenderer = ScriptableObject(PostProcessEffectRenderer)


function LightShaftsRenderer : ctor()
    local oneOverDepthScale = (1.0/65504.0)
    if Amaz.Platform.name() == "Android" or Amaz.Platform.name() == "iOS" then
        oneOverDepthScale = 1.0/16376.0
    end
    self.oneOverDepthScale = oneOverDepthScale
    self.downSampleNum = 8
end


function elurToForward(elur)
    local cosZ = math.cos(math.rad(elur.z))
    local sinZ = math.sin(math.rad(elur.z))

    local cosY = math.cos(math.rad(elur.y))
    local sinY = math.sin(math.rad(elur.y))

    local cosX = math.cos(math.rad(elur.x))
    local sinX = math.sin(math.rad(elur.x))

    return Amaz.Vector3f(-cosX * sinY,sinX,-cosX * cosY);
end




function LightShaftsRenderer : render(sys,renderContext)
    --  if renderContext  == nil then
    --     return
    --  end
    local enable = self.settings["pLightShatfsEnable"]
    local settings = self.settings
    local OcclusionMaskDarkness = settings["pOcclusionMaskDarkness"]
    local OcclusionDepthRange = settings["pOcclusionDepthRange"]
    local BloomScale = settings["pLSBloomScale"]
    local BloomThreshold = settings["pLSBloomThreshold"]
    local BloomMaxBrightness = settings["pLSBloomMaxBrightness"]
    local BloomTint = settings["pLSBloomTint"]
    local DirectionalLight = settings["pDirectionalLight"]
    local enableOcclusion = settings["pLightShatfsOcclusionEnable"]
    local enableBloom= settings["pLightShatfsBloomEnable"]
    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()
    local cam = renderContext:getCamera()
    
    if enable then
        local LightShaftsMat = renderContext:getResources():getShaders("LightShafts"):getMaterial()

        local DirLightForward = DirectionalLight.localEulerAngle
        DirLightForward = elurToForward(DirLightForward)
        local cameraPos = cam.entity:getComponent("Transform"):getWorldPosition()
        local lightWorldPos = cameraPos - DirLightForward
        local cameraForward = elurToForward(cam.entity:getComponent("Transform").localEulerAngle)
        lightWorldPos.z = cameraPos.z + cameraForward.z *( cam.zNear *10.0 )
        local  lightViewPos = cam:worldToViewportPoint(lightWorldPos)

        LightShaftsMat:setVec4("UVMinMax", Amaz.Vector4f(0.0,0.0,1.0,1.0))
        LightShaftsMat:setVec4("LightShaftParameters", Amaz.Vector4f(1.0/ OcclusionDepthRange,BloomScale,1.0,OcclusionMaskDarkness))
        LightShaftsMat:setFloat("BloomMaxBrightness", BloomMaxBrightness)
        LightShaftsMat:setVec4("BloomTintAndThreshold", Amaz.Vector4f(BloomTint.x,BloomTint.y,BloomTint.z,BloomThreshold))
        LightShaftsMat:setVec2("TextureSpaceBlurOrigin", Amaz.Vector2f(lightViewPos.x ,lightViewPos.y ))
        LightShaftsMat:setVec4("AspectRatioAndInvAspectRatio", Amaz.Vector4f(16.0/9.0,1.0,9.0/16.0,1.0))

        if enableOcclusion then
            LightShaftsMat:enableMacro("OCCLUSION_TERM", 0)
        else
            LightShaftsMat:disableMacro("OCCLUSION_TERM")
        end


            local src = renderContext:getSource()


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
                if platform == "Android" then 
                    depthTex.filterMag = Amaz.FilterMode.NEARST
                    depthTex.filterMin = Amaz.FilterMode.NEARST
                else 
                    depthTex.filterMag = Amaz.FilterMode.LINEAR
                    depthTex.filterMin = Amaz.FilterMode.LINEAR
                end
            end
        end


        if self.dirty then
            commands:clearAll()

            local w = width
            local h = height
            local dst = renderContext:getDestination()
        
     
            local pingpong = CreateRenderTexture("", width/self.downSampleNum, height/self.downSampleNum)
            LightShaftsMat:setTex("u_depth_tex",depthTex)
            commands:blitWithMaterial(src, pingpong, LightShaftsMat, 0)


            for i=0,2,1 do
				local buffer1 = CreateRenderTexture("", width/self.downSampleNum, height/self.downSampleNum)
				LightShaftsMat:setVec4("RadialBlurParameters", Amaz.Vector4f(12.0,0.1,i,0.0));
                commands:blitWithMaterial(pingpong, buffer1, LightShaftsMat, 1)
				pingpong = buffer1;
			end

            LightShaftsMat:setTex("_LightTex",pingpong)

            local finalPass 
            if enableOcclusion then
                finalPass = 3 
            else
                finalPass = 2 
            end
            if src.image == dst.image then
                local pingpong0 = CreateRenderTexture("", width, height)
                commands:blitWithMaterial(src, pingpong0, LightShaftsMat, finalPass)
                commands:blit(pingpong0, dst)
            else
                commands:blitWithMaterial(src, dst, LightShaftsMat, finalPass)
            end

            self.dirty = false
        end
    else
        if self.dirty then
           commands:clearAll()
           self.dirty = false
        end
    end
    --end

    cam.entity.scene:commitCommandBuffer(commands)
end