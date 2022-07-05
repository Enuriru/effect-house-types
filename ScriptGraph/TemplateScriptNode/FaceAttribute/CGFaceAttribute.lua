local CGFaceAttribute = CGFaceAttribute or {}
CGFaceAttribute.__index = CGFaceAttribute

function CGFaceAttribute.new()
    local self = setmetatable({}, CGFaceAttribute)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGFaceAttribute:setNext(index, func)
    self.nexts[index] = func
end

function CGFaceAttribute:setInput(index, func)
    self.inputs[index] = func
end

function CGFaceAttribute:getOutput(index)
    return self.outputs[index]
end

function CGFaceAttribute:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceAttribute = result:getFaceAttributeInfo(self.inputs[1]())
    if faceAttribute == nil then
        return
    end
    self.outputs[1] = faceAttribute.age
    self.outputs[2] = faceAttribute.boyProb
    self.outputs[3] = faceAttribute.gender
    self.outputs[4] = faceAttribute.attractive
    self.outputs[5] = faceAttribute.happyScore
    self.outputs[6] = faceAttribute.exp_type
    self.outputs[7] = faceAttribute.exp_probs
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGFaceAttribute
