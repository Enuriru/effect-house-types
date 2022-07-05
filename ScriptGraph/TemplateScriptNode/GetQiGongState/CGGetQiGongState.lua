local CGGetQiGongState = CGGetQiGongState or {}
CGGetQiGongState.__index = CGGetQiGongState

function CGGetQiGongState.new()
    local self = setmetatable({}, CGGetQiGongState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetQiGongState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetQiGongState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetQiGongState:getOutput(index)
    return self.outputs[index]
end

function CGGetQiGongState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.QIGONG
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetQiGongState

