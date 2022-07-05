local CGFaceActionDetection = CGFaceActionDetection or {}
CGFaceActionDetection.__index = CGFaceActionDetection

function CGFaceActionDetection.new()
    local self = setmetatable({}, CGFaceActionDetection)
    self.inputs = {}
    self.nexts = {}
    self.faceAction = ""
    return self
end

function CGFaceActionDetection:setNext(index, func)
    self.nexts[index] = func
end

function CGFaceActionDetection:setInput(index, func)
    self.inputs[index] = func
end

function CGFaceActionDetection:update()
    if self.nexts[0] == nil and self.nexts[1] == nil and self.nexts[2] == nil and self.nexts[3] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face_count = result:getFaceCount()
    if self.inputs[1]() == 0 then
        for i = 0, face_count - 1 do
            self:executeNext(result, i)
        end
    else
        self:executeNext(result, self.inputs[1]() - 1)
    end
end

function CGFaceActionDetection:executeNext(result, index)
    local face = result:getFaceBaseInfo(index)
    if face == nil then
        return
    end

    local action_matched = face:hasAction(self.inputs[0]())
    if action_matched then
        if self.nexts[0] then
            self.nexts[0]()
        end
    else
        if self.nexts[1] then
            self.nexts[1]()
        end
    end

    if self.faceAction ~= "FaceTrigger" and action_matched then
        self.faceAction = "FaceTrigger"
        if self.nexts[2] then
            self.nexts[2]()
        end
    elseif self.faceAction == "FaceTrigger" and not action_matched then
        self.faceAction = ""
        if self.nexts[3] then
            self.nexts[3]()
        end
    end
end

return CGFaceActionDetection

