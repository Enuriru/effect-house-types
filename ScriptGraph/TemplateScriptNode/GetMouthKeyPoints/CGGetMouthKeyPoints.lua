local CGGetMouthKeyPoints = CGGetMouthKeyPoints or {}
CGGetMouthKeyPoints.__index = CGGetMouthKeyPoints

function CGGetMouthKeyPoints.new()
    local self = setmetatable({}, CGGetMouthKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetMouthKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetMouthKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetMouthKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetMouthKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceId = self.inputs[1]()
    local face = result:getFaceBaseInfo(faceId - 1)
    if face == nil then
        return
    end
    self.outputs[1] = face.points_array:get(84)
    self.outputs[2] = face.points_array:get(90)
    for i = 1, 2 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetMouthKeyPoints

