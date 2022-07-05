local CGGetOkState = CGGetOkState or {}
CGGetOkState.__index = CGGetOkState

function CGGetOkState.new()
    local self = setmetatable({}, CGGetOkState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetOkState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetOkState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetOkState:getOutput(index)
    return self.outputs[index]
end

function CGGetOkState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.OK
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetOkState

