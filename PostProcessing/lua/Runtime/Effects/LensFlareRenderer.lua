LensFlareRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniform names
local u_pos = "touchPos"
local u_noise = "u_noise"

-- pass ids
local LensFlarePass = 0

function LensFlareRenderer : ctor()
end

function LensFlareRenderer : render(sys,renderContext)
    --  if renderContext  == nil then
    --     return
    --  end
    local enable = self.settings["pLensFlareEnable"]
    local settings = self.settings

    local tmp_pos = settings["pFlarePos"]
    local pos = Amaz.Vector2f(tmp_pos.x - 0.5, tmp_pos.y - 0.5)


    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()

    if enable then
        local LensFlareMat = renderContext:getResources():getShaders("LensFlare"):getMaterial()
        LensFlareNoiseTex = renderContext:getResources():getTextureByName("internalLensFlareNoise")
        -- Set LensFlare uniform
        LensFlareMat:setVec2(u_pos, pos)
        LensFlareMat:setTex(u_noise, LensFlareNoiseTex)

        if self.dirty then
            local w = width
            local h = height
            local src = renderContext:getSource()
            local dst = renderContext:getDestination()
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", width, height)
                commands:blitWithMaterial(src, pingpong, LensFlareMat, LensFlarePass)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(src, dst, LensFlareMat, LensFlarePass)
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