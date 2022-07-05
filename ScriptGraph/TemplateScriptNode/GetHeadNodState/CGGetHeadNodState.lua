local CGGetHeadNodState = CGGetHeadNodState or {}
CGGetHeadNodState.__index = CGGetHeadNodState

function CGGetHeadNodState.new()
    local self = setmetatable({}, CGGetHeadNodState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetHeadNodState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetHeadNodState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetHeadNodState:getOutput(index)
    return self.outputs[index]
end

function CGGetHeadNodState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face:hasAction(Amaz.FaceAction.HEAD_PITCH)
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetHeadNodState

