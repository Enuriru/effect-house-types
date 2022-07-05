local CGGetRockState = CGGetRockState or {}
CGGetRockState.__index = CGGetRockState

function CGGetRockState.new()
    local self = setmetatable({}, CGGetRockState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetRockState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetRockState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetRockState:getOutput(index)
    return self.outputs[index]
end

function CGGetRockState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.ROCK
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetRockState

