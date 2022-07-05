local CGRound= CGRound or {}
CGRound.__index = CGRound

function CGRound.new()
    local self = setmetatable({}, CGRound)
    self.inputs = {}
    return self
end

function CGRound:setInput(index, func)
    self.inputs[index] = func
end

function CGRound:getOutput(index)
    return math.floor(self.inputs[0]() + 0.5)
end

return CGRound
