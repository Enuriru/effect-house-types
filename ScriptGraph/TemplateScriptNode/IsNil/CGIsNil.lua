local CGIsNil = CGIsNil or {}
CGIsNil.__index = CGIsNil

function CGIsNil.new()
    local self = setmetatable({}, CGIsNil)
    self.inputs = {}
    return self
end

function CGIsNil:setInput(index, func)
    self.inputs[index] = func
end

function CGIsNil:getOutput(index)
    if self.inputs[0]() == nil then
        return true
    else
        return false
    end
end

return CGIsNil
