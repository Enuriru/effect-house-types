local CGSqrt= CGSqrt or {}
CGSqrt.__index = CGSqrt

function CGSqrt.new()
    local self = setmetatable({}, CGSqrt)
    self.inputs = {}
    return self
end

function CGSqrt:setInput(index, func)
    self.inputs[index] = func
end

function CGSqrt:getOutput(index)
    return math.sqrt(self.inputs[0]())
end

return CGSqrt
