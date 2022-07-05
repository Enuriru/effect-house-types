local CGMouthOpenState = CGMouthOpenState or {}
CGMouthOpenState.__index = CGMouthOpenState

function CGMouthOpenState.new()
    local self = setmetatable({}, CGMouthOpenState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGMouthOpenState:setNext(index, func)
    self.nexts[index] = func
end

function CGMouthOpenState:setInput(index, func)
    self.inputs[index] = func
end

function CGMouthOpenState:getOutput(index)
    return self.outputs[index]
end

function CGMouthOpenState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face:hasAction(Amaz.FaceAction.MOUTH_AH)
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGMouthOpenState

