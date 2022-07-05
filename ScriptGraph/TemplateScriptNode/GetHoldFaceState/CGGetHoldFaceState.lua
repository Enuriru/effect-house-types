local CGGetHoldFaceState = CGGetHoldFaceState or {}
CGGetHoldFaceState.__index = CGGetHoldFaceState

function CGGetHoldFaceState.new()
    local self = setmetatable({}, CGGetHoldFaceState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetHoldFaceState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetHoldFaceState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetHoldFaceState:getOutput(index)
    return self.outputs[index]
end

function CGGetHoldFaceState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.HOLDFACE
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetHoldFaceState

