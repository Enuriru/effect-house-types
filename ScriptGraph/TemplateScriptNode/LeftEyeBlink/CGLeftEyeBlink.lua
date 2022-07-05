local CGLeftEyeBlink = CGLeftEyeBlink or {}
CGLeftEyeBlink.__index = CGLeftEyeBlink

function CGLeftEyeBlink.new()
    local self = setmetatable({}, CGLeftEyeBlink)
    self.inputs = {}
    self.nexts = {}
    self.faceAction = ""
    return self
end

function CGLeftEyeBlink:setNext(index, func)
    self.nexts[index] = func
end

function CGLeftEyeBlink:setInput(index, func)
    self.inputs[index] = func
end

function CGLeftEyeBlink:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[0]())
    if face == nil then
        return
    end

    local has_action = face:hasAction(Amaz.FaceAction.EYE_BLINK_LEFT)
    if self.faceAction ~= "EYE_BLINK_LEFT" and has_action then
        self.faceAction = "EYE_BLINK_LEFT"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.faceAction == "EYE_BLINK_LEFT" and not has_action then
        self.faceAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end

return CGLeftEyeBlink

