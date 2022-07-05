local CGLerp = CGLerp or {}
CGLerp.__index = CGLerp

function CGLerp.new()
    local self = setmetatable({}, CGLerp)
    self.inputs = {}
    return self
end

function CGLerp:setInput(index, func)
    self.inputs[index] = func
end

function CGLerp:getOutput(index)
    local _init = self.inputs[0]()
    local _end = self.inputs[1]()
    local _amt = self.inputs[2]()
    if _init == nil or _end == nil or _amt == nil then
        return nil
    end
    return _init + (_end - _init) * _amt
end

return CGLerp

