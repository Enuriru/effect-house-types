local CGMouthOpen = CGMouthOpen or {}
CGMouthOpen.__index = CGMouthOpen

function CGMouthOpen.new()
    local self = setmetatable({}, CGMouthOpen)
    self.inputs = {}
    self.nexts = {}
    self.faceAction = ""
    return self
end

function CGMouthOpen:setNext(index, func)
    self.nexts[index] = func
end

function CGMouthOpen:setInput(index, func)
    self.inputs[index] = func
end

function CGMouthOpen:update()
    if self.nexts[0] == nil and self.nexts[1] == nil and self.nexts[2] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[0]())
    if face == nil then
        return
    end

    local is_mouth_ah = face:hasAction(Amaz.FaceAction.MOUTH_AH)

    if self.faceAction ~= "MOUTH_AH" and is_mouth_ah then
        self.faceAction = "MOUTH_AH"
        if self.nexts[0] then
            self.nexts[0]()
        end
        if self.nexts[1] then
            self.nexts[1]()
        end
    elseif self.faceAction == "MOUTH_AH" and is_mouth_ah then
        self.faceAction = "MOUTH_AH"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.faceAction == "MOUTH_AH" and not is_mouth_ah then
        self.faceAction = ""
        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end

return CGMouthOpen

