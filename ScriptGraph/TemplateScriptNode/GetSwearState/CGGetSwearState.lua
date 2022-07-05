local CGGetSwearState = CGGetSwearState or {}
CGGetSwearState.__index = CGGetSwearState

function CGGetSwearState.new()
    local self = setmetatable({}, CGGetSwearState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetSwearState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetSwearState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetSwearState:getOutput(index)
    return self.outputs[index]
end

function CGGetSwearState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.SWEAR
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetSwearState

