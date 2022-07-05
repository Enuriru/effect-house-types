local CGEnumEqual = CGEnumEqual or {}
CGEnumEqual.__index = CGEnumEqual

function CGEnumEqual.new()
    local self = setmetatable({}, CGEnumEqual)
    self.inputs = {}
    self.enumSelected = nil
    self.outputs = {}
    return self
end

function CGEnumEqual:setInput(index, func)
    self.inputs[index] = func
end

function CGEnumEqual:getOutput(index)
    return self.enumSelected == self.inputs[0]()
end

return CGEnumEqual

