--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2020/12/24
-- Time: 5:57
-- To change this template use File | Settings | File Templates.
--

local CGGetScreenWidth = CGGetScreenWidth or {}
CGGetScreenWidth.__index = CGGetScreenWidth

function CGGetScreenWidth.new()
    local self = setmetatable({}, CGGetScreenWidth)
    self.screenWidth = Amaz.BuiltinObject:getInputTextureWidth()
    return self
end

function CGGetScreenWidth:getOutput(index)
    return self.screenWidth
end

return CGGetScreenWidth