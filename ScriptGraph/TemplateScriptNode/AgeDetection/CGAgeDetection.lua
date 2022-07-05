local CGAgeDetection = CGAgeDetection or {}
CGAgeDetection.__index = CGAgeDetection

function CGAgeDetection.new()
    local self = setmetatable({}, CGAgeDetection)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGAgeDetection:setNext(index, func)
    self.nexts[index] = func
end

function CGAgeDetection:setInput(index, func)
    self.inputs[index] = func
end

function CGAgeDetection:getOutput(index)
    return self.outputs[index]
end

function CGAgeDetection:execute(index)
    if self.inputs[1]() == nil then
        return
    end
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceAttribute = result:getFaceAttributeInfo(self.inputs[1]() - 1)
    if faceAttribute == nil then
        return
    end
    self.outputs[1] = faceAttribute.age
    if self.nexts[0] then
        self.nexts[0]()
    end
    if self.nexts[1] then
        self.nexts[1]()
    end
end

return CGAgeDetection