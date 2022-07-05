DepthOfFieldRenderer = ScriptableObject(PostProcessEffectRenderer)


function DepthOfFieldRenderer : ctor()
    
end
-- Height of the 35mm full-frame format (36mm x 24mm)
local k_FilmHeight = 0.024;

function DepthOfFieldRenderer : CalculateMaxCoCRadius(screenHeight)
    --Estimate the allowable maximum radius of CoC from the kernel
    --size (the equation below was empirically derived).
     local radiusInPixels = self.kernelSize * 4.0 + 6.0

     --Applying a 5% limit to the CoC radius to keep the size of
     -- TileMax/NeighborMax small enough.
     return math.min(0.05, radiusInPixels / screenHeight);

end

function DepthOfFieldRenderer : SelectFormat(firstFormat,secondFormat)
    --TODO
    return firstFormat

end

function DepthOfFieldRenderer : render(sys,renderContext)
    local enable = self.settings["pDOFEnable"]
    local settings = self.settings
    local FocalLength = settings["pFocalLength"]
    local Aperture = settings["pAperture"]
    local FocusDistance = settings["pFocusDistance"]
    local MaxBlurSize = settings["pMaxBlurSize"]
    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()
    local cam = renderContext:getCamera()

    if enable then  

      local DepthOfFieldMat = renderContext:getResources():getShaders("DepthOfField"):getMaterial()

      DepthOfFieldMat:setVec4("_ProjectionParams", Amaz.Vector4f(1.0,cam.zNear,cam.zFar,1.0/cam.zFar))
      local zy = cam.zFar/cam.zNear
      local zx = 1.0 - zy
      DepthOfFieldMat:setVec4("_ZBufferParams", Amaz.Vector4f(zx,zy,zx / cam.zFar,zy / cam.zFar))

        if self.dirty then
            commands:clearAll()

            --TODO HDR ColorFormat

            local colorFormat 
            if self.settings["pCGHdr"] then
                colorFormat = Amaz.PixelFormat.RGBA8Unorm
            else
                colorFormat = Amaz.PixelFormat.RGBA832Sfloat
            end
            
            if MaxBlurSize == "Small" then
                self.kernelSize = 0 
                DepthOfFieldMat:enableMacro("KERNEL_SMALL", 0)
                DepthOfFieldMat:disableMacro("KERNEL_MEDIUM")
                DepthOfFieldMat:disableMacro("KERNEL_LARGE")
                DepthOfFieldMat:disableMacro("KERNEL_VERYLARGE")
            elseif  MaxBlurSize == "Medium" then
                self.kernelSize = 1
                DepthOfFieldMat:enableMacro("KERNEL_MEDIUM", 0)
                DepthOfFieldMat:disableMacro("KERNEL_SMALL")
                DepthOfFieldMat:disableMacro("KERNEL_LARGE")
                DepthOfFieldMat:disableMacro("KERNEL_VERYLARGE")
            elseif MaxBlurSize == "Large" then
                self.kernelSize = 2
                DepthOfFieldMat:enableMacro("KERNEL_LARGE", 0)
                DepthOfFieldMat:disableMacro("KERNEL_SMALL")
                DepthOfFieldMat:disableMacro("KERNEL_MEDIUM")
                DepthOfFieldMat:disableMacro("KERNEL_VERYLARGE")
            elseif MaxBlurSize == "VeryLarge" then
                self.kernelSize = 3
                DepthOfFieldMat:enableMacro("KERNEL_VERYLARGE", 0)
                DepthOfFieldMat:disableMacro("KERNEL_SMALL")
                DepthOfFieldMat:disableMacro("KERNEL_MEDIUM")
                DepthOfFieldMat:disableMacro("KERNEL_LARGE")
            end

            local cocFormat = self:SelectFormat( Amaz.PixelFormat.R8Unorm, Amaz.PixelFormat.R16Sfloat);
            
            --get Depth
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
    
            --setUp material
            local scaledFilmHeight = k_FilmHeight * (renderContext:getHeight()/ 1080);
            local f = FocalLength / 1000;
            local s1 = math.max(FocusDistance, f);
            local aspect = width/height;
            local coeff = f * f / (Aperture * (s1 - f) * scaledFilmHeight * 2);
            local maxCoC = self:CalculateMaxCoCRadius(height);
            -- 


            DepthOfFieldMat:setTex("u_depth_tex", depthTex)
            DepthOfFieldMat:setFloat("_Distance", s1)
            DepthOfFieldMat:setFloat("_LensCoeff", coeff)
            DepthOfFieldMat:setFloat("_MaxCoC", maxCoC)
            DepthOfFieldMat:setFloat("_RcpMaxCoC", 1.0/maxCoC)
            DepthOfFieldMat:setFloat("_RcpAspect", 1.0/aspect)


            local dst = renderContext:getDestination()
            local cocTex = CreateRenderTexture("CoCTex", width, height, cocFormat)
            -- CoC calculat
            commands:blitWithMaterial(src, cocTex, DepthOfFieldMat, 0)
            -- Downsampling and prefiltering pass
            local DoFTex = CreateRenderTexture("DoFTex", width/2.0, height/2.0, colorFormat)
            DepthOfFieldMat:setTex("_CoCTex", cocTex)
            DepthOfFieldMat:setVec4("_MainTex_TexelSize", Amaz.Vector4f(1.0/src.width,1.0/src.height, src.width,src.height))
            commands:blitWithMaterial(src, DoFTex, DepthOfFieldMat, 1)

            -- Bokeh simulation pass
            DepthOfFieldMat:setVec4("_DoFTex_TexelSize", Amaz.Vector4f(1.0/width/2,1.0/height/2,width/2,height/2))
            local tempTex = CreateRenderTexture("tempTex", width/2, height/2, colorFormat)
            commands:blitWithMaterial(DoFTex, tempTex, DepthOfFieldMat, 2)
            --Postfilter pass
            commands:blitWithMaterial(tempTex, DoFTex, DepthOfFieldMat, 3)

            -- Combine pass
            DepthOfFieldMat:setTex("_DepthOfFieldTex", DoFTex)

            if src.image == dst.image then
                local pingpong0 = CreateRenderTexture("", width, height)
                commands:blitWithMaterial(src, pingpong0, DepthOfFieldMat, 4)
                commands:blit(pingpong0, dst)
            else
                commands:blitWithMaterial(src, dst, DepthOfFieldMat, 4)
            end

            self.dirty = false
        end
    else
        if self.dirty then
            commands:clearAll()
            self.dirty = false
        end
    end
    cam.entity.scene:commitCommandBuffer(commands)
end