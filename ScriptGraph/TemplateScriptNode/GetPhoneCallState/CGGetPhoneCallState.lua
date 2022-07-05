local CGGetPhoneCallState = CGGetPhoneCallState or {}
CGGetPhoneCallState.__index = CGGetPhoneCallState

function CGGetPhoneCallState.new()
    local self = setmetatable({}, CGGetPhoneCallState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetPhoneCallState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetPhoneCallState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetPhoneCallState:getOutput(index)
    return self.outputs[index]
end

function CGGetPhoneCallState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.action == Amaz.HandAction.PHONECALL
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetPhoneCallState

