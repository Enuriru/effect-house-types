local CGGetPistolState = CGGetPistolState or {}
CGGetPistolState.__index = CGGetPistolState

function CGGetPistolState.new()
    local self = setmetatable({}, CGGetPistolState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetPistolState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetPistolState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetPistolState:getOutput(index)
    return self.outputs[index]
end

function CGGetPistolState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.PISTOL
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetPistolState

