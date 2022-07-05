local CGGetMouthPoutState = CGGetMouthPoutState or {}
CGGetMouthPoutState.__index = CGGetMouthPoutState

function CGGetMouthPoutState.new()
    local self = setmetatable({}, CGGetMouthPoutState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetMouthPoutState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetMouthPoutState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetMouthPoutState:getOutput(index)
    return self.outputs[index]
end

function CGGetMouthPoutState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face:hasAction(Amaz.FaceAction.MOUTH_POUT)
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetMouthPoutState

