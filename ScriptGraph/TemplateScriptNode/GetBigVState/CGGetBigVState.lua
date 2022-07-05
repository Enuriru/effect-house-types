local CGGetBigVState = CGGetBigVState or {}
CGGetBigVState.__index = CGGetBigVState

function CGGetBigVState.new()
    local self = setmetatable({}, CGGetBigVState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetBigVState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetBigVState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetBigVState:getOutput(index)
    return self.outputs[index]
end

function CGGetBigVState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.BIG_V
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetBigVState

