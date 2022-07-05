local CGGetThumbUpState = CGGetThumbUpState or {}
CGGetThumbUpState.__index = CGGetThumbUpState

function CGGetThumbUpState.new()
    local self = setmetatable({}, CGGetThumbUpState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetThumbUpState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetThumbUpState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetThumbUpState:getOutput(index)
    return self.outputs[index]
end

function CGGetThumbUpState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.THUMB_UP
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetThumbUpState

