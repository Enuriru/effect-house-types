local CGGetSmileScore = CGGetSmileScore or {}
CGGetSmileScore.__index = CGGetSmileScore

function CGGetSmileScore.new()
    local self = setmetatable({}, CGGetSmileScore)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGGetSmileScore:setNext(index, func)
    self.nexts[index] = func
end

function CGGetSmileScore:setInput(index, func)
    self.inputs[index] = func
end

function CGGetSmileScore:getOutput(index)
    return self.outputs[index]
end

function CGGetSmileScore:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceAttribute = result:getFaceAttributeInfo(self.inputs[1]() - 1)
    if faceAttribute == nil then
        return
    end
    self.outputs[1] = faceAttribute.happyScore
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetSmileScore
