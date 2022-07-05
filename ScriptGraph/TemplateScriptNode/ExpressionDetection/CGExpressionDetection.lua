local CGExpressionDetection = CGExpressionDetection or {}
CGExpressionDetection.__index = CGExpressionDetection

function CGExpressionDetection.new()
    local self = setmetatable({}, CGExpressionDetection)
    self.inputs = {}
    self.nexts = {}
    self.expressionDetected = false
    self.expressionMap = {
        ["Happy"] = Amaz.FaceAttrExpression.HAPPY,
        ["Angry"] = Amaz.FaceAttrExpression.ANGRY,
        ["Surprise"] = Amaz.FaceAttrExpression.SURPRISE,
    }
    return self
end

function CGExpressionDetection:setNext(index, func)
    self.nexts[index] = func
end

function CGExpressionDetection:setInput(index, func)
    self.inputs[index] = func
end

function CGExpressionDetection:update()
    local faceId = self.inputs[1]()
    local expression = self.expressionMap[self.inputs[0]()]
    local curExpressionDetected = false
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    if faceId == 0 then
        for i = 0, 4 do
            local face = result:getFaceAttributeInfo(i)
            if face and face.exp_type == expression then
                curExpressionDetected = true
                break
            end
        end
    else
        local face = result:getFaceAttributeInfo(faceId - 1)
        if face and face.exp_type == expression then
            curExpressionDetected = true
        end
    end

    if curExpressionDetected and self.nexts[0] then
        self.nexts[0]()
    end
    if curExpressionDetected and not self.expressionDetected and self.nexts[1] then
        self.nexts[1]()
    end
    if not curExpressionDetected and self.expressionDetected and self.nexts[2] then
        self.nexts[2]()
    end
    self.expressionDetected = curExpressionDetected
end

return CGExpressionDetection

