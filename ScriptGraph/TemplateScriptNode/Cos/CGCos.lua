local CGCos = CGCos or {}
CGCos.__index = CGCos

function CGCos.new()
    local self = setmetatable({}, CGCos)
    self.inputs = {}
    return self
end

function CGCos:setInput(index, func)
    self.inputs[index] = func
end

function CGCos:getOutput(index)
    return math.cos(self.inputs[0]())
end

return CGCos
