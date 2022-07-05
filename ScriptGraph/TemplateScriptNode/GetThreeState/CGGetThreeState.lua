local CGGetThreeState = CGGetThreeState or {}
CGGetThreeState.__index = CGGetThreeState

function CGGetThreeState.new()
    local self = setmetatable({}, CGGetThreeState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetThreeState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetThreeState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetThreeState:getOutput(index)
    return self.outputs[index]
end

function CGGetThreeState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.THREE
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetThreeState

