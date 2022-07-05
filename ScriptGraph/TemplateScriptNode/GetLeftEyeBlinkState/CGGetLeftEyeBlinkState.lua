local CGGetLeftEyeBlinkState = CGGetLeftEyeBlinkState or {}
CGGetLeftEyeBlinkState.__index = CGGetLeftEyeBlinkState

function CGGetLeftEyeBlinkState.new()
    local self = setmetatable({}, CGGetLeftEyeBlinkState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetLeftEyeBlinkState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetLeftEyeBlinkState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetLeftEyeBlinkState:getOutput(index)
    return self.outputs[index]
end

function CGGetLeftEyeBlinkState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face:hasAction(Amaz.FaceAction.EYE_BLINK_LEFT)
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetLeftEyeBlinkState

