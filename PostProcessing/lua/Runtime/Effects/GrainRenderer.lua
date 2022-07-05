GrainRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniform names
local u_Time = "u_Time"
local u_strength = "u_strength"
local u_color = "u_color"
local u_speed = "u_speed"


-- pass ids
local GrainPass = 0

function GrainRenderer : ctor()
end

function GrainRenderer : render(sys,renderContext)
    --  if renderContext  == nil then
    --     return
    --  end
    local enable = self.settings["pGrainEnable"]
    local settings = self.settings

    local strength = settings["pGrainStrength"]
    local color = settings["pGrainColor"]
    local speed = settings["pGrainSpeed"]

    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()

    if enable then
        local GrainMat = renderContext:getResources():getShaders("Grain"):getMaterial()

        -- Set Grain uniform        
        GrainMat:setFloat(u_strength, strength)
        GrainMat:setFloat(u_color, color)
        GrainMat:setFloat(u_speed, speed)

        if self.dirty then
            local w = width
            local h = height
            local src = renderContext:getSource()
            local dst = renderContext:getDestination()
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", width, height)
                commands:blitWithMaterial(src, pingpong, GrainMat, GrainPass)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(src, dst, GrainMat, GrainPass)
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