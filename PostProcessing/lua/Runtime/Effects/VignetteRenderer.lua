VignetteRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniform names
local u_power = "u_power"
local u_contrast = "u_contrast"
local u_ScreenParams = "u_ScreenParams"
--I'm not sure how to set these
--u_image;
--u_maskA;


-- pass ids
local VignettePass = 0

function VignetteRenderer : ctor()
end

function VignetteRenderer : render(sys,renderContext)
    --  if renderContext  == nil then
    --     return
    --  end
    local enable = self.settings["pVignetteEnable"]
    local settings = self.settings

    local power = settings["pVignettePower"]
    local contrast = settings["pVignetteContrast"]

    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()

    if enable then
        local VignetteMat = renderContext:getResources():getShaders("Vignette"):getMaterial()

        -- Set Vignette uniform
        VignetteMat:setFloat(u_power, power)
        VignetteMat:setFloat(u_contrast, contrast)

        if self.dirty then
            local w = width
            local h = height
            local src = renderContext:getSource()
            local dst = renderContext:getDestination()
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", width, height)
                commands:blitWithMaterial(src, pingpong, VignetteMat, VignettePass)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(src, dst, VignetteMat, VignettePass)
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