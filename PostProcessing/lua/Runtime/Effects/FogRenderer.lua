FogRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniform names

-- pass ids
local FogPass = 0

function FogRenderer : ctor()
end

function FogRenderer : render(sys,renderContext)
    --  if renderContext  == nil then
    --     return
    --  end
    local enable = self.settings["pFogEnable"]
    local settings = self.settings

    local fogparams = settings["pFogParams"]
    local color = settings["pFogColor"]

    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()

    if enable then
        local FogMat = renderContext:getResources():getShaders("Fog"):getMaterial()
        FogMat:setVec2("FogParams", fogparams)
        FogMat:setVec4("fogColor", Amaz.Vector4f(color.r, color.g, color.b, color.a))
        -- Set Fog uniform


        if self.dirty then
            local w = width
            local h = height
            local src = renderContext:getSource()
            local dst = renderContext:getDestination()
            local depthTex = src.depthTexture 
            FogMat:setTex("depthTex", depthTex)
            
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", width, height)
                commands:blitWithMaterial(src, pingpong, FogMat, FogPass)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(src, dst, FogMat, FogPass)
            end
            self.dirty = false
        end
    else
            if self.dirty then
                commands:clearAll()
                self.dirty = false
                -- to do, if src ~= dst, copy src to dst
            end
    end
    --end

    local cam = renderContext:getCamera()
    cam.entity.scene:commitCommandBuffer(commands)
end