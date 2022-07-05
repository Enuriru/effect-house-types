local CGNot = CGNot or {}
CGNot.__index = CGNot

function CGNot.new()
    local self = setmetatable({}, CGNot)
    self.inputs = {}
    return self
end

function CGNot:setInput(index, func)
    self.inputs[index] = func
end

function CGNot:getOutput(index)
    return not self.inputs[0]()
end

return CGNot
