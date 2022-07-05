local CGGetFistState = CGGetFistState or {}
CGGetFistState.__index = CGGetFistState

function CGGetFistState.new()
    local self = setmetatable({}, CGGetFistState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetFistState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetFistState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetFistState:getOutput(index)
    return self.outputs[index]
end

function CGGetFistState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.FIST
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetFistState

