local CGGetVictoryState = CGGetVictoryState or {}
CGGetVictoryState.__index = CGGetVictoryState

function CGGetVictoryState.new()
    local self = setmetatable({}, CGGetVictoryState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetVictoryState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetVictoryState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetVictoryState:getOutput(index)
    return self.outputs[index]
end

function CGGetVictoryState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.VICTORY
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetVictoryState

