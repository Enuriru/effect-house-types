local CGGetHeartDState = CGGetHeartDState or {}
CGGetHeartDState.__index = CGGetHeartDState

function CGGetHeartDState.new()
    local self = setmetatable({}, CGGetHeartDState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetHeartDState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetHeartDState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetHeartDState:getOutput(index)
    return self.outputs[index]
end

function CGGetHeartDState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.HEART_D
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetHeartDState

