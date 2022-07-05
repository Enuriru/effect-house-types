local CGGetDoubleFingerUpState = CGGetDoubleFingerUpState or {}
CGGetDoubleFingerUpState.__index = CGGetDoubleFingerUpState

function CGGetDoubleFingerUpState.new()
    local self = setmetatable({}, CGGetDoubleFingerUpState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetDoubleFingerUpState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetDoubleFingerUpState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetDoubleFingerUpState:getOutput(index)
    return self.outputs[index]
end

function CGGetDoubleFingerUpState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.DOUBLE_FINGER_UP
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetDoubleFingerUpState

