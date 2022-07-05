MotionBlurRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniform names

--u_image;
--u_maskA;

-- pass ids
local MotionBlurPass = 0

function MotionBlurRenderer : ctor()
end

function MotionBlurRenderer : render(sys,renderContext)
    --  if renderContext  == nil then
    --     return
    --  end
    
    local enable = self.settings["pMotionBlurEnable"]
    local settings = self.settings

    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()

    if enable then
        local MotionBlurMat = renderContext:getResources():getShaders("MotionBlur"):getMaterial()

        local tmp_alpha = settings["pBlurStrength"]
        -- Amaz.LOGI("motion blur alpha", tostring(tmp_alpha))


        local w = width
        local h = height
        local src = renderContext:getSource()  
        local tmp = CreateRenderTexture("", width, height)

        if self.accumulationTexture == nil then
            self.accumulationTexture = CreateRenderTexture("", width, height)
            commands:blit(src, self.accumulationTexture)
            Amaz.LOGI("motion blur", "create acc tex")
        else
            commands:clearAll()
            -- Amaz.LOGI("motion blur", "update acc tex")
            -- Set MotionBlur uniform
            -- MotionBlurMat:setTex("currTex", src)
            MotionBlurMat:setTex("prevTex", self.accumulationTexture)
            MotionBlurMat:setFloat("alpha", tmp_alpha)
            local dst = renderContext:getDestination()
            commands:blitWithMaterial(src, tmp, MotionBlurMat, MotionBlurPass)
            commands:blit(tmp, self.accumulationTexture)
            commands:blit(tmp, dst)
            
        end
        
    else
        if self.dirty then
            commands:clearAll()
            self.dirty = false
            -- to do, if src ~= dst, copy src to dst
            self.accumulationTexture = nil
        end
        
    end
    --end

    local cam = renderContext:getCamera()
    cam.entity.scene:commitCommandBuffer(commands)
end