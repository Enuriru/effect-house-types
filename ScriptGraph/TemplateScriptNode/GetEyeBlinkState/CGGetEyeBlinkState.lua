local CGGetEyeBlinkState = CGGetEyeBlinkState or {}
CGGetEyeBlinkState.__index = CGGetEyeBlinkState

function CGGetEyeBlinkState.new()
    local self = setmetatable({}, CGGetEyeBlinkState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetEyeBlinkState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetEyeBlinkState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetEyeBlinkState:getOutput(index)
    return self.outputs[index]
end

function CGGetEyeBlinkState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face:hasAction(Amaz.FaceAction.EYE_BLINK)
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetEyeBlinkState

