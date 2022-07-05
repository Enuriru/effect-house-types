--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/7/28
-- Time: 10:39
-- To change this template use File | Settings | File Templates.
--

local CGGetEnable = CGGetEnable or {}
CGGetEnable.__index = CGGetEnable

function CGGetEnable.new()
    local self = setmetatable({}, CGGetEnable)
    self.inputs = {}
    self.outputs = {}
    return self
end

function CGGetEnable:setInput(index, func)
    self.inputs[index] = func
end

function CGGetEnable:getOutput(index)
    if self.inputs[0] then
        if self.inputs[0]():isInstanceOf("Component") then
            return  self.inputs[0]().enabled
        end
    end
    return false
end

return CGGetEnable
