--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/7/28
-- Time: 23:10
-- To change this template use File | Settings | File Templates.
--


local CGSetEnable = CGSetEnable or {}
CGSetEnable.__index = CGSetEnable

function CGSetEnable.new()
    local self = setmetatable({}, CGSetEnable)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGSetEnable:setInput(index, func)
    self.inputs[index] = func
end

function CGSetEnable:setNext(index, func)
    self.nexts[index] = func
end

function CGSetEnable:getOutput(index)
    if self.inputs[2] then
        return self.inputs[2]()
    end
    return nil
end

function CGSetEnable:execute(index)
    if self.inputs[1] ~= nil then
        local object = self.inputs[1]()
        local enable = self.inputs[2]()
        if object ~= nil and object:isInstanceOf("Component") then
            object.enabled = enable
        end
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGSetEnable
