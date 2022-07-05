local CGGetHeadShakeState = CGGetHeadShakeState or {}
CGGetHeadShakeState.__index = CGGetHeadShakeState

function CGGetHeadShakeState.new()
    local self = setmetatable({}, CGGetHeadShakeState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetHeadShakeState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetHeadShakeState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetHeadShakeState:getOutput(index)
    return self.outputs[index]
end

function CGGetHeadShakeState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face:hasAction(Amaz.FaceAction.HEAD_YAW)
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetHeadShakeState

