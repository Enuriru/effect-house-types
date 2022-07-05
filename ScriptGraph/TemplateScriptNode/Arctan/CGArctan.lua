local CGArctan = CGArctan or {}
CGArctan.__index = CGArctan

function CGArctan.new()
    local self = setmetatable({}, CGArctan)
    self.inputs = {}
    return self
end

function CGArctan:setInput(index, func)
    self.inputs[index] = func
end

function CGArctan:getOutput()
    return math.atan(self.inputs[0]())
end

return CGArctan
