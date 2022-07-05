local CGExponential= CGExponential or {}
CGExponential.__index = CGExponential

function CGExponential.new()
    local self = setmetatable({}, CGExponential)
    self.inputs = {}
    return self
end

function CGExponential:setInput(index, func)
    self.inputs[index] = func
end

function CGExponential:getOutput(index)
    return math.exp(self.inputs[0]())
end

return CGExponential
