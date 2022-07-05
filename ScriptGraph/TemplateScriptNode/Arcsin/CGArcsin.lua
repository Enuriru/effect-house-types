local CGArcsin = CGArcsin or {}
CGArcsin.__index = CGArcsin

function CGArcsin.new()
    local self = setmetatable({}, CGArcsin)
    self.inputs = {}
    return self
end

function CGArcsin:setInput(index, func)
    self.inputs[index] = func
end

function CGArcsin:getOutput(index)
    return math.asin(self.inputs[0]())
end

return CGArcsin
