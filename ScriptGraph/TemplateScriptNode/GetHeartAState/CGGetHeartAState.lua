local CGGetHeartAState = CGGetHeartAState or {}
CGGetHeartAState.__index = CGGetHeartAState

function CGGetHeartAState.new()
    local self = setmetatable({}, CGGetHeartAState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetHeartAState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetHeartAState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetHeartAState:getOutput(index)
    return self.outputs[index]
end

function CGGetHeartAState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.HEART_A
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetHeartAState

