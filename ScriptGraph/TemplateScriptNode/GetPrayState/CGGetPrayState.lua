local CGGetPrayState = CGGetPrayState or {}
CGGetPrayState.__index = CGGetPrayState

function CGGetPrayState.new()
    local self = setmetatable({}, CGGetPrayState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetPrayState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetPrayState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetPrayState:getOutput(index)
    return self.outputs[index]
end

function CGGetPrayState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.PRAY
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetPrayState

