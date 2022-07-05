--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2020/12/24
-- Time: 5:45
-- To change this template use File | Settings | File Templates.
--

local CGGetScreenHeight = CGGetScreenHeight or {}
CGGetScreenHeight.__index = CGGetScreenHeight

function CGGetScreenHeight.new()
    local self = setmetatable({}, CGGetScreenHeight)
    self.screenHeight = Amaz.BuiltinObject:getInputTextureHeight()
    return self
end

function CGGetScreenHeight:getOutput(index)
    return self.screenHeight
end

return CGGetScreenHeight