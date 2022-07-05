local CGNumberComparison = CGNumberComparison or {}
CGNumberComparison.__index = CGNumberComparison

function CGNumberComparison.new()
    local self = setmetatable({}, CGNumberComparison)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGNumberComparison:setNext(index, func)
    self.nexts[index] = func
end

function CGNumberComparison:setInput(index, func)
    self.inputs[index] = func
end

function CGNumberComparison:getOutput(index)
    return self.outputs[index]
end

function CGNumberComparison:execute()
    local num1 = self.inputs[1]()
    local num2 = self.inputs[2]()
    if self.nexts[0] and num1 > num2 then
        self.nexts[0]()
    end
    if self.nexts[1] and num1 >= num2 then
        self.nexts[1]()
    end
    if self.nexts[2] and num1 == num2 then
        self.nexts[2]()
    end
    if self.nexts[3] and num1 <= num2 then
        self.nexts[3]()
    end
    if self.nexts[4] and num1 < num2 then
        self.nexts[4]()
    end
end

return CGNumberComparison

