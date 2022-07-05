local CGClothMesh = CGClothMesh or {}
CGClothMesh.__index = CGClothMesh

function CGClothMesh.new()
    local self = setmetatable({}, CGClothMesh)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGClothMesh:setNext(index, func)
    self.nexts[index] = func
end

function CGClothMesh:setInput(index, func)
    self.inputs[index] = func
end

function CGClothMesh:getOutput(index)
    return self.outputs[index]
end

function CGClothMesh:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local clothMesh = result:getClothClassInfo(self.inputs[1]())
    if clothMesh == nil then
        return nil
    end
    self.outputs[1] = clothMesh.trackID
    self.outputs[2] = clothMesh.type
    self.outputs[3] = clothMesh.score
    self.outputs[4] = clothMesh.x0
    self.outputs[5] = clothMesh.y0
    self.outputs[6] = clothMesh.x1
    self.outputs[7] = clothMesh.y1
    self.outputs[8] = clothMesh.vertices
    self.outputs[9] = clothMesh.probs
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGClothMesh

