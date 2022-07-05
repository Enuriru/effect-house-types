local CGRightEyeBlink = CGRightEyeBlink or {}
CGRightEyeBlink.__index = CGRightEyeBlink

function CGRightEyeBlink.new()
    local self = setmetatable({}, CGRightEyeBlink)
    self.inputs = {}
    self.nexts = {}
    self.faceAction = ""
    return self
end

function CGRightEyeBlink:setNext(index, func)
    self.nexts[index] = func
end

function CGRightEyeBlink:setInput(index, func)
    self.inputs[index] = func
end

function CGRightEyeBlink:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[0]())
    if face == nil then
        return
    end

    local has_action = face:hasAction(Amaz.FaceAction.EYE_BLINK_RIGHT)
    if self.faceAction ~= "EYE_BLINK_RIGHT" and has_action then
        self.faceAction = "EYE_BLINK_RIGHT"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.faceAction == "EYE_BLINK_RIGHT" and not has_action then
        self.faceAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end

return CGRightEyeBlink

