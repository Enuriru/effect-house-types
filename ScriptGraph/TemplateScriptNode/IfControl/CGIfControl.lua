--
-- Created by IntelliJ IDEA.
-- User: admin
-- Date: 2021/3/14
-- Time: 8:10 pm
-- To change this template use File | Settings | File Templates.
--

local CGIfControl = CGIfControl or {}
CGIfControl.__index = CGIfControl

function CGIfControl.new()
    local self = setmetatable({}, CGIfControl)
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGIfControl:setNext(index, func)
    self.nexts[index] = func
end

function CGIfControl:setInput(index, func)
    self.inputs[index] = func
end

function CGIfControl:execute()
    if self.inputs[1]() then
        if self.nexts[0] then
            self.nexts[0]()
        end
    else
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end

return CGIfControl
