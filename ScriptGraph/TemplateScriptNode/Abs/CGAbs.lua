local CGAbs= CGAbs or {}
CGAbs.__index = CGAbs

function CGAbs.new()
    local self = setmetatable({}, CGAbs)
    self.inputs = {}
    return self
end

function CGAbs:setInput(index, func)
    self.inputs[index] = func
end

function CGAbs:getOutput(index)
    return math.abs(self.inputs[0]())
end

return CGAbs
