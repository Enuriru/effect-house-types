local CGGetFaceActionState = CGGetFaceActionState or {}
CGGetFaceActionState.__index = CGGetFaceActionState

function CGGetFaceActionState.new()
    local self = setmetatable({}, CGGetFaceActionState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetFaceActionState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetFaceActionState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetFaceActionState:getOutput(index)
    return self.outputs[index]
end

function CGGetFaceActionState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local expression = self.inputs[1]()
    local faceId = self.inputs[2]()
    self.outputs[1] = false
    if faceId == 0 then
        for i = 0, 4 do
            local face = result:getFaceBaseInfo(i)
            if face and face:hasAction(expression) then
                self.outputs[1] = true
                break
            end
        end
    else
        local face = result:getFaceBaseInfo(faceId - 1)
        if face and face:hasAction(expression) then
            self.outputs[1] = true
        end
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetFaceActionState

