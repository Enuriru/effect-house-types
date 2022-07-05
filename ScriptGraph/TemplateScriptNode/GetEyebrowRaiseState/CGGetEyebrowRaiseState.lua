local CGGetEyebrowRaiseState = CGGetEyebrowRaiseState or {}
CGGetEyebrowRaiseState.__index = CGGetEyebrowRaiseState

function CGGetEyebrowRaiseState.new()
    local self = setmetatable({}, CGGetEyebrowRaiseState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetEyebrowRaiseState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetEyebrowRaiseState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetEyebrowRaiseState:getOutput(index)
    return self.outputs[index]
end

function CGGetEyebrowRaiseState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face:hasAction(Amaz.FaceAction.BROW_JUMP)
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetEyebrowRaiseState

