local CGGetBegState = CGGetBegState or {}
CGGetBegState.__index = CGGetBegState

function CGGetBegState.new()
    local self = setmetatable({}, CGGetBegState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetBegState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetBegState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetBegState:getOutput(index)
    return self.outputs[index]
end

function CGGetBegState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.THANKS
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetBegState

