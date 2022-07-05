local CGGetThanksState = CGGetThanksState or {}
CGGetThanksState.__index = CGGetThanksState

function CGGetThanksState.new()
    local self = setmetatable({}, CGGetThanksState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetThanksState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetThanksState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetThanksState:getOutput(index)
    return self.outputs[index]
end

function CGGetThanksState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.BEG
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetThanksState

