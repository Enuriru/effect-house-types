local GetCabbageState = GetCabbageState or {}
GetCabbageState.__index = GetCabbageState

function GetCabbageState.new()
    local self = setmetatable({}, GetCabbageState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function GetCabbageState:setNext(index, func)
    self.nexts[index] = func
end

function GetCabbageState:setInput(index, func)
    self.inputs[index] = func
end

function GetCabbageState:getOutput(index)
    return self.outputs[index]
end

function GetCabbageState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.CABBAGE
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return GetCabbageState

