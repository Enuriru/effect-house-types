--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/15
-- Time: 11:21
-- To change this template use File | Settings | File Templates.
--

local CGAndorNot = CGAndorNot or {}
CGAndorNot.__index = CGAndorNot

function CGAndorNot.new()
    local self = setmetatable({}, CGAndorNot)
    self.inputs = {}
    self.outputs = {}
    return self
end

function CGAndorNot:setInput(index, func)
    self.inputs[index] = func
end

function CGAndorNot:getOutput(index)
    if self.inputs[0] == nil then
        return nil
    end
    if index == 2 then
        return not self.inputs[0]()
    end
    if self.inputs[1] == nil then
        return nil
    end
    if index == 0 then
        return self.inputs[0]() and self.inputs[1]()
    end
    if index == 1 then
        return self.inputs[0]() or self.inputs[1]()
    end
    return nil
end

return CGAndorNot