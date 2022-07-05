local CGPower= CGPower or {}
CGPower.__index = CGPower

function CGPower.new()
    local self = setmetatable({}, CGPower)
    self.inputs = {}
    return self
end

function CGPower:setInput(index, func)
    self.inputs[index] = func
end

function CGPower:getOutput(index)
    return math.pow(self.inputs[0](), self.inputs[1]())
end

return CGPower
