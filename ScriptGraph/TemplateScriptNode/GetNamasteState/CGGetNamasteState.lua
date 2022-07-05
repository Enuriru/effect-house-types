local CGGetNamasteState = CGGetNamasteState or {}
CGGetNamasteState.__index = CGGetNamasteState

function CGGetNamasteState.new()
    local self = setmetatable({}, CGGetNamasteState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetNamasteState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetNamasteState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetNamasteState:getOutput(index)
    return self.outputs[index]
end

function CGGetNamasteState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.NAMASTE
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetNamasteState

