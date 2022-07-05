local CGGenderDetection = CGGenderDetection or {}
CGGenderDetection.__index = CGGenderDetection

function CGGenderDetection.new()
    local self = setmetatable({}, CGGenderDetection)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.femaleDetected = false
    self.maleDetected = false
    return self
end

function CGGenderDetection:setNext(index, func)
    self.nexts[index] = func
end

function CGGenderDetection:setInput(index, func)
    self.inputs[index] = func
end

function CGGenderDetection:getOutput(index)
    return self.outputs[index]
end

function CGGenderDetection:update()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceId = self.inputs[0]()
    local maleDetected = false
    local femaleDetected = false
    if faceId == 0 then
        for i = 0, 4 do
            local faceAttr = result:getFaceAttributeInfo(i)
            if faceAttr ~= nil and faceAttr.gender == Amaz.FaceAttrGender.MALE then
                maleDetected = true
                break
            end
        end
        for i = 0, 4 do
            local faceAttr = result:getFaceAttributeInfo(i)
            if faceAttr ~= nil and faceAttr.gender == Amaz.FaceAttrGender.FEMALE then
                femaleDetected = true
                break
            end
        end
    else 
        local faceAttr = result:getFaceAttributeInfo(faceId - 1)
        if faceAttr == nil then
            return
        end
        maleDetected = (faceAttr.gender == Amaz.FaceAttrGender.MALE)
        femaleDetected = (faceAttr.gender == Amaz.FaceAttrGender.FEMALE)
    end
    if self.nexts[0] and not self.maleDetected and maleDetected then
        self.nexts[0]()
    end
    if self.nexts[1] and not self.femaleDetected and femaleDetected then
        self.nexts[1]()
    end
    self.maleDetected = maleDetected
    self.femaleDetected = femaleDetected
end

return CGGenderDetection
