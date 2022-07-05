--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2020/12/24
-- Time: 8:42
-- To change this template use File | Settings | File Templates.
--

local CGPixelToNormalized = CGPixelToNormalized or {}
CGPixelToNormalized.__index = CGPixelToNormalized

function CGPixelToNormalized.new()
    local self = setmetatable({}, CGPixelToNormalized)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.screenHeight = 1280
    self.screenWidth = 720
    return self
end

function CGPixelToNormalized:setNext(index, func)
    self.nexts[index] = func
end

function CGPixelToNormalized:setInput(index, func)
    self.inputs[index] = func
end

function CGPixelToNormalized:getOutput(index)
    if self.inputs[0]() == nil then
        return nil
    end
    local pixel_x = self.inputs[0]().x
    local pixel_y = self.inputs[0]().y
    local pixel_norm_x = pixel_x / self.screenWidth
    local pixel_norm_y = pixel_y / self.screenHeight
    local transMatrix = Amaz.Matrix3x3f(
        1, 0, 0.5,
        0, -1, 0.5,
        0, 0, 1)
    local pixel_vector3f = Amaz.Vector3f(pixel_norm_x, pixel_norm_y, 1)
    local norm_vector3f = transMatrix:multiplyVector3(pixel_vector3f)
    local norm_vector2f = Amaz.Vector2f(norm_vector3f.x, norm_vector3f.y)
    -- -- Amaz.LOGE("INFO: ", "CGPixelToNormalized norm_vector2f: " .. norm_vector2f.x .. "  ,  " .. norm_vector2f.y)
    return norm_vector2f
end

return CGPixelToNormalized