local CGGetSpreadState = CGGetSpreadState or {}
CGGetSpreadState.__index = CGGetSpreadState

function CGGetSpreadState.new()
    local self = setmetatable({}, CGGetSpreadState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetSpreadState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetSpreadState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetSpreadState:getOutput(index)
    return self.outputs[index]
end

function CGGetSpreadState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.SPREAD
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetSpreadState

