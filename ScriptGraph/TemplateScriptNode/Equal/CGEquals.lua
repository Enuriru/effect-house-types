local CGEquals = CGEquals or {}
CGEquals.__index = CGEquals

function CGEquals.new()
    local self = setmetatable({}, CGEquals)
    self.inputs = {}
    return self
end

function CGEquals:setInput(index, func)
    self.inputs[index] = func
end

function CGEquals:getOutput(index)
    return math.abs(self.inputs[0]() - self.inputs[1]()) < self.inputs[2]()
end

return CGEquals
