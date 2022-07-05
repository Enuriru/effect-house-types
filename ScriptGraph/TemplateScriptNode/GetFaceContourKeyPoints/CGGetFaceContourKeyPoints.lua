local CGGetFaceContourKeyPoints = CGGetFaceContourKeyPoints or {}
CGGetFaceContourKeyPoints.__index = CGGetFaceContourKeyPoints

function CGGetFaceContourKeyPoints.new()
    local self = setmetatable({}, CGGetFaceContourKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetFaceContourKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetFaceContourKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetFaceContourKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetFaceContourKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceId = self.inputs[1]()
    local face = result:getFaceBaseInfo(faceId - 1)
    if face == nil then
        return
    end
    self.outputs[1] = face.points_array:get(0)
    self.outputs[2] = face.points_array:get(32)
    self.outputs[3] = face.points_array:get(16)
    for i = 1, 3 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    for i = 1, 3 do
        local vec4 = Amaz.Vector4f(self.outputs[i].x, self.outputs[i].y, self.outputs[i].z, 1.0)
        vec4 = faceMesh.modelMatrix:multiplyVector4(vec4)
        self.outputs[i] = Amaz.Vector3f(vec4.x, vec4.y, vec4.z)
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetFaceContourKeyPoints

