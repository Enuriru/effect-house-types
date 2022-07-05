local CGGetRightEyeBlinkState = CGGetRightEyeBlinkState or {}
CGGetRightEyeBlinkState.__index = CGGetRightEyeBlinkState

function CGGetRightEyeBlinkState.new()
    local self = setmetatable({}, CGGetRightEyeBlinkState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetRightEyeBlinkState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetRightEyeBlinkState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetRightEyeBlinkState:getOutput(index)
    return self.outputs[index]
end

function CGGetRightEyeBlinkState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face:hasAction(Amaz.FaceAction.EYE_BLINK_RIGHT)
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetRightEyeBlinkState

