DistortRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniform names

local u_Time = "u_Time"
local u_barrelPower = "u_barrelPower"
local u_rotation = "u_rotation"
local u_zoom = "u_zoom"
local u_maskTiles = "u_maskTiles"

local u_amplitude = "u_amplitude"
local u_frequency = "u_frequency"
local u_speed = "u_speed"
local u_offset = "u_offset"

--I'm not sure how to set these
--u_image;
--u_maskA;


-- pass ids
local DistortPass = 0

function DistortRenderer : ctor()
end

function DistortRenderer : render(sys,renderContext)
    --  if renderContext  == nil then
    --     return
    --  end
    local enable = self.settings["pDistortEnable"]
    local settings = self.settings
    local barrelPower = settings["pDistortBarrelPower"]
    local rotation = settings["pDistortRotation"]
    local zoom = settings["pDistortZoom"]
    local maskTiles = settings["pDistortMaskTiles"]
    local amplitude = settings["pDistortAmplitude"]
    local frequency = settings["pDistortFrequency"]
    local speed = settings["pDistortSpeed"]
    local offset = settings["pDistortOffset"]

    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()

    if enable then
        local DistortMat = renderContext:getResources():getShaders("Distort"):getMaterial()

        -- Set Distort uniform
        DistortMat:setFloat(u_barrelPower, barrelPower)
        DistortMat:setFloat(u_rotation, rotation)
        DistortMat:setFloat(u_zoom, zoom)
        DistortMat:setFloat(u_maskTiles, maskTiles)
        DistortMat:setVec2(u_amplitude, amplitude)
        DistortMat:setVec2(u_frequency, frequency)
        DistortMat:setVec2(u_speed, speed)
        DistortMat:setVec2(u_offset, offset)

        if self.dirty then
            local w = width
            local h = height
            local src = renderContext:getSource()
            local dst = renderContext:getDestination()
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", width, height)
                commands:blitWithMaterial(src, pingpong, DistortMat, DistortPass)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(src, dst, DistortMat, DistortPass)
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