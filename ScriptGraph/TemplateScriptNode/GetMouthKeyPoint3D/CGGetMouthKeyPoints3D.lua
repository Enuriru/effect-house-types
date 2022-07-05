local CGGetMouthKeyPoints3D = CGGetMouthKeyPoints3D or {}
CGGetMouthKeyPoints3D.__index = CGGetMouthKeyPoints3D

function CGGetMouthKeyPoints3D.new()
    local self = setmetatable({}, CGGetMouthKeyPoints3D)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetMouthKeyPoints3D:setNext(index, func)
    self.nexts[index] = func
end

function CGGetMouthKeyPoints3D:setInput(index, func)
    self.inputs[index] = func
end

function CGGetMouthKeyPoints3D:getOutput(index)
    return self.outputs[index]
end

function CGGetMouthKeyPoints3D:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceId = self.inputs[1]()
    local faceMesh = result:getFaceMeshInfo(faceId - 1)
    if faceMesh == nil then
        return
    end
    self.outputs[1] = faceMesh.vertexes:get(1220 - 33 + 84)
    self.outputs[2] = faceMesh.vertexes:get(1220 - 33 + 90)
    for i = 1, 2 do
        local vec4 = Amaz.Vector4f(self.outputs[i].x, self.outputs[i].y, self.outputs[i].z, 1.0)
        vec4 = faceMesh.modelMatrix:multiplyVector4(vec4)
        self.outputs[i] = Amaz.Vector3f(vec4.x, vec4.y, vec4.z)
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetMouthKeyPoints3D

