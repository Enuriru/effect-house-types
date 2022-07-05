local CGGetThumbDownState = CGGetThumbDownState or {}
CGGetThumbDownState.__index = CGGetThumbDownState

function CGGetThumbDownState.new()
    local self = setmetatable({}, CGGetThumbDownState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetThumbDownState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetThumbDownState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetThumbDownState:getOutput(index)
    return self.outputs[index]
end

function CGGetThumbDownState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.THUMB_DOWN
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetThumbDownState

