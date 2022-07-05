local CGDegToRadian = CGDegToRadian or {}
CGDegToRadian.__index = CGDegToRadian

function CGDegToRadian.new()
    local self = setmetatable({}, CGDegToRadian)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGDegToRadian:setInput(index, func)
    self.inputs[index] = func
end

function CGDegToRadian:getOutput(index)
    if self.inputs[0]() then
        return math.rad(self.inputs[0]())
    end
    return nil
end

return CGDegToRadian
