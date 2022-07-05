local CGGetSaluteState = CGGetSaluteState or {}
CGGetSaluteState.__index = CGGetSaluteState

function CGGetSaluteState.new()
    local self = setmetatable({}, CGGetSaluteState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetSaluteState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetSaluteState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetSaluteState:getOutput(index)
    return self.outputs[index]
end

function CGGetSaluteState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.SALUTE
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetSaluteState

