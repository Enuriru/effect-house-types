local CGGetFingerUpState = CGGetFingerUpState or {}
CGGetFingerUpState.__index = CGGetFingerUpState

function CGGetFingerUpState.new()
    local self = setmetatable({}, CGGetFingerUpState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetFingerUpState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetFingerUpState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetFingerUpState:getOutput(index)
    return self.outputs[index]
end

function CGGetFingerUpState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.INDEX_FINGER_UP
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetFingerUpState

