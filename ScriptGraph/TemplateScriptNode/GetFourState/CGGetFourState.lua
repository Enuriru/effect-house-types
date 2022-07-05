local CGGetFourState = CGGetFourState or {}
CGGetFourState.__index = CGGetFourState

function CGGetFourState.new()
    local self = setmetatable({}, CGGetFourState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetFourState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetFourState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetFourState:getOutput(index)
    return self.outputs[index]
end

function CGGetFourState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.FOUR
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetFourState

