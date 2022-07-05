local CGFaceVerify = CGFaceVerify or {}
CGFaceVerify.__index = CGFaceVerify

function CGFaceVerify.new()
    local self = setmetatable({}, CGFaceVerify)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGFaceVerify:setNext(index, func)
    self.nexts[index] = func
end

function CGFaceVerify:setInput(index, func)
    self.inputs[index] = func
end

function CGFaceVerify:getOutput(index)
    return self.outputs[index]
end

function CGFaceVerify:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceVerify = result:getFaceVerifyInfo(self.inputs[1]())
    if faceVerify == nil then
        return
    end
    self.outputs[1] = faceVerify.features
    self.outputs[2] = faceVerify.m_faceStatus
    self.outputs[3] = faceVerify.m_validFaceNum
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGFaceVerify
