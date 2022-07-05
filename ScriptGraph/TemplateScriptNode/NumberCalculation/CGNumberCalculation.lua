local CGNumberCalculation = CGNumberCalculation or {}
CGNumberCalculation.__index = CGNumberCalculation

function CGNumberCalculation.new()
    local self = setmetatable({}, CGNumberCalculation)
    self.outputs = {}
    self.inputs = {}
    return self
end

function CGNumberCalculation:setInput(index, func)
    self.inputs[index] = func
end

function CGNumberCalculation:getOutput(index)
    local num1 = self.inputs[0]()
    local num2 = self.inputs[1]()
    if not num1 or not num2 then
        return
    end
    if index == 0 then
        return num1 + num2
    elseif index == 1 then
        return num1 - num2
    elseif index == 2 then
        return num1 * num2
    elseif index == 3 then
        return num1 / num2
    elseif index == 4 then
        return num1 % num2
    end
end

return CGNumberCalculation

