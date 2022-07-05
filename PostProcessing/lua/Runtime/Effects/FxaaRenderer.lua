FxaaRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniform names
local u_textureSize = "u_texture_size"

-- pass ids
local FxaaPass = 0

function FxaaRenderer : ctor()
end

function FxaaRenderer : render(sys, renderContext)
    local enable = self.settings["pFxaaEnable"]
    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()

    if enable then
        local w = width
        local h = height
        local src = renderContext:getSource()
        local dst = renderContext:getDestination()
        local fxaaMat = renderContext:getResources():getShaders("Fxaa"):getMaterial()
        fxaaMat:setVec2(u_textureSize, Amaz.Vector2f(width, height))
        if self.dirty then
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", w, h)
                commands:blitWithMaterial(src, pingpong, fxaaMat, FxaaPass)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(src, dst, fxaaMat, FxaaPass)
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