local CGGetHeartBState = CGGetHeartBState or {}
CGGetHeartBState.__index = CGGetHeartBState

function CGGetHeartBState.new()
    local self = setmetatable({}, CGGetHeartBState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetHeartBState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetHeartBState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetHeartBState:getOutput(index)
    return self.outputs[index]
end

function CGGetHeartBState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.HEART_B
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetHeartBState

