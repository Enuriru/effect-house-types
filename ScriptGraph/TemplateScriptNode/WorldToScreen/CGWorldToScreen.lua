--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/1/25
-- Time: 2:25
-- To change this template use File | Settings | File Templates.
--

local CGWorldToScreen = CGWorldToScreen or {}
CGWorldToScreen.__index = CGWorldToScreen

function CGWorldToScreen.new()
    local self = setmetatable({}, CGWorldToScreen)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.screenHeight = Amaz.BuiltinObject:getInputTextureHeight()
    return self
end

function CGWorldToScreen:setNext(index, func)
    self.nexts[index] = func
end

function CGWorldToScreen:setInput(index, func)
    self.inputs[index] = func
end

function CGWorldToScreen:getOutput(index)
    if self.inputs[0]() == nil then
        return nil
    end
    local w_pos_x = self.inputs[0]().x
    local w_pos_y = self.inputs[0]().y
    local pixel_x = w_pos_x * self.screenHeight / 2
    local pixel_y = w_pos_y * self.screenHeight / 2

    local pixel_vector2f = Amaz.Vector2f(pixel_x, pixel_y)
    -- Amaz.LOGE("INFO: ", "CGWorldDisUnitToPixel pixel_vector2f: " .. pixel_vector2f.x .. "  ,  " .. pixel_vector2f.y)
    return pixel_vector2f
end

return CGWorldToScreen
