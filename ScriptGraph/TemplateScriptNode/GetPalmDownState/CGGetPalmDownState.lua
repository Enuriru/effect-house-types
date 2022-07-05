local CGGetPalmDownState = CGGetPalmDownState or {}
CGGetPalmDownState.__index = CGGetPalmDownState

function CGGetPalmDownState.new()
    local self = setmetatable({}, CGGetPalmDownState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetPalmDownState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetPalmDownState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetPalmDownState:getOutput(index)
    return self.outputs[index]
end

function CGGetPalmDownState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.PALM_DOWN
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetPalmDownState

