local CGGetRock2State = CGGetRock2State or {}
CGGetRock2State.__index = CGGetRock2State

function CGGetRock2State.new()
    local self = setmetatable({}, CGGetRock2State)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetRock2State:setNext(index, func)
    self.nexts[index] = func
end

function CGGetRock2State:setInput(index, func)
    self.inputs[index] = func
end

function CGGetRock2State:getOutput(index)
    return self.outputs[index]
end

function CGGetRock2State:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.ROCK2
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetRock2State

