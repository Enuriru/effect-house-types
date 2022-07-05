local CGGetHandOpenState = CGGetHandOpenState or {}
CGGetHandOpenState.__index = CGGetHandOpenState

function CGGetHandOpenState.new()
    local self = setmetatable({}, CGGetHandOpenState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetHandOpenState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetHandOpenState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetHandOpenState:getOutput(index)
    return self.outputs[index]
end

function CGGetHandOpenState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.HAND_OPEN
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetHandOpenState

