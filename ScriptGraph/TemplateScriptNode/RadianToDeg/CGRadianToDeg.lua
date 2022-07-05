
local CGRadianToDeg = CGRadianToDeg or {}
CGRadianToDeg.__index = CGRadianToDeg

function CGRadianToDeg.new()
    local self = setmetatable({}, CGRadianToDeg)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGRadianToDeg:setInput(index, func)
    self.inputs[index] = func
end

function CGRadianToDeg:getOutput(index)
    if self.inputs[0]() then
        return math.deg(self.inputs[0]())
    end
    return nil
end

return CGRadianToDeg
