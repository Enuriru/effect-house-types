local CGGetNoseKeyPoints = CGGetNoseKeyPoints or {}
CGGetNoseKeyPoints.__index = CGGetNoseKeyPoints

function CGGetNoseKeyPoints.new()
    local self = setmetatable({}, CGGetNoseKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetNoseKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetNoseKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetNoseKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetNoseKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceId = self.inputs[1]()
    local face = result:getFaceBaseInfo(faceId - 1)
    if face == nil then
        return
    end
    self.outputs[1] = face.points_array:get(82)
    self.outputs[2] = face.points_array:get(83)
    self.outputs[3] = face.points_array:get(46)
    self.outputs[4] = face.points_array:get(44)
    for i = 1, 4 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetNoseKeyPoints

