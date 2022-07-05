local CGGetPalmUpState = CGGetPalmUpState or {}
CGGetPalmUpState.__index = CGGetPalmUpState

function CGGetPalmUpState.new()
    local self = setmetatable({}, CGGetPalmUpState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetPalmUpState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetPalmUpState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetPalmUpState:getOutput(index)
    return self.outputs[index]
end

function CGGetPalmUpState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.PLAM_UP
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetPalmUpState

