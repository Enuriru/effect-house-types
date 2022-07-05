local CGValue = CGValue or {}
CGValue.__index = CGValue

function CGValue.new()
    local self = setmetatable({}, CGValue)
    self.inputs = {}
    return self
end

function CGValue:setInput(index, func)
    self.inputs[index] = func
end

function CGValue:getOutput(index)
    return self.inputs[index]()
end

function CGValue:update(sys, deltaTime)
    if self.inputs[0] ~= nil then
        self.inputs[0]()
    end
end

return CGValue
