local CGGetEyeKeyPoints = CGGetEyeKeyPoints or {}
CGGetEyeKeyPoints.__index = CGGetEyeKeyPoints

function CGGetEyeKeyPoints.new()
    local self = setmetatable({}, CGGetEyeKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetEyeKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetEyeKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetEyeKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetEyeKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceId = self.inputs[1]()
    local face = result:getFaceBaseInfo(faceId - 1)
    local eye = self.inputs[2]()
    if face == nil then
        return
    end
    if eye == "Left" then
        self.outputs[1] = face.points_array:get(55)
        self.outputs[2] = face.points_array:get(52)
        self.outputs[3] = face.points_array:get(104)
    else
        self.outputs[1] = face.points_array:get(58)  
        self.outputs[2] = face.points_array:get(61)
        self.outputs[3] = face.points_array:get(105)
    end
    self.outputs[4] = face.points_array:get(43)
    for i = 1, 4 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetEyeKeyPoints

