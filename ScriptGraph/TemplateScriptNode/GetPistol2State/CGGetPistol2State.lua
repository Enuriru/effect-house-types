local CGGetPistol2State = CGGetPistol2State or {}
CGGetPistol2State.__index = CGGetPistol2State

function CGGetPistol2State.new()
    local self = setmetatable({}, CGGetPistol2State)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetPistol2State:setNext(index, func)
    self.nexts[index] = func
end

function CGGetPistol2State:setInput(index, func)
    self.inputs[index] = func
end

function CGGetPistol2State:getOutput(index)
    return self.outputs[index]
end

function CGGetPistol2State:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.PISTOL2
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetPistol2State

