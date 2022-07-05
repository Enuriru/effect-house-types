local CGArccos = CGArccos or {}
CGArccos.__index = CGArccos

function CGArccos.new()
    local self = setmetatable({}, CGArccos)
    self.inputs = {}
    return self
end

function CGArccos:setInput(index, func)
    self.inputs[index] = func
end

function CGArccos:getOutput(index)
    return math.acos(self.inputs[0]())
end

return CGArccos
