local CGGetHeartCState = CGGetHeartCState or {}
CGGetHeartCState.__index = CGGetHeartCState

function CGGetHeartCState.new()
    local self = setmetatable({}, CGGetHeartCState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetHeartCState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetHeartCState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetHeartCState:getOutput(index)
    return self.outputs[index]
end

function CGGetHeartCState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.HEART_C
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetHeartCState

