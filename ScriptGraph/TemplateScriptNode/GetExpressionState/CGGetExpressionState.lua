local CGGetExpressionState = CGGetExpressionState or {}
CGGetExpressionState.__index = CGGetExpressionState

function CGGetExpressionState.new()
    local self = setmetatable({}, CGGetExpressionState)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetExpressionState:setNext(index, func)
    self.nexts[index] = func
end

function CGGetExpressionState:setInput(index, func)
    self.inputs[index] = func
end

function CGGetExpressionState:getOutput(index)
    return self.outputs[index]
end

function CGGetExpressionState:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local expression = self.inputs[1]()
    local faceId = self.inputs[2]()
    self.outputs[1] = false
    if faceId == 0 then
        for i = 0, 4 do
            local face = result:getFaceAttributeInfo(i)
            if face and face.exp_type == expression then
                self.outputs[1] = true
                break
            end
        end
    else
        local face = result:getFaceAttributeInfo(faceId - 1)
        if face and face.exp_type == expression then
            self.outputs[1] = true
        end
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetExpressionState

