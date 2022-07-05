local CGNormalize = CGNormalize or {}
CGNormalize.__index = CGNormalize

function CGNormalize.new()
    local self = setmetatable({}, CGNormalize)
    self.inputs = {}
    return self
end

function CGNormalize:setInput(index, func)
    self.inputs[index] = func
end

function CGNormalize:getOutput(index)
    local _value = self.inputs[0]()
    local _min = self.inputs[1]()
    local _max = self.inputs[2]()
    if _value == nil or _min == nil or _max == nil then
        return nil
    end
    return math.max(0, math.min(1, (_value - _min) / (_max - _min)))
end

return CGNormalize
