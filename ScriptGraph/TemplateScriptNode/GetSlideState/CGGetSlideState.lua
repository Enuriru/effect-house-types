local CGGetSlideState = CGGetSlideState or {}
CGGetSlideState.__index = CGGetSlideState

function CGGetSlideState.new()
    local self = setmetatable({}, CGGetSlideState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetSlideState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetSlideState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetSlideState:getOutput(index)
    return self.outputs[index]
end

function CGGetSlideState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.SLIDE
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetSlideState

