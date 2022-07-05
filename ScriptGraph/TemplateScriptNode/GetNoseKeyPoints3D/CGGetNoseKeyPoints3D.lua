local CGGetNoseKeyPoints3D = CGGetNoseKeyPoints3D or {}
CGGetNoseKeyPoints3D.__index = CGGetNoseKeyPoints3D

function CGGetNoseKeyPoints3D.new()
    local self = setmetatable({}, CGGetNoseKeyPoints3D)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetNoseKeyPoints3D:setNext(index, func)
    self.nexts[index] = func
end

function CGGetNoseKeyPoints3D:setInput(index, func)
    self.inputs[index] = func
end

function CGGetNoseKeyPoints3D:getOutput(index)
    return self.outputs[index]
end

function CGGetNoseKeyPoints3D:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceId = self.inputs[1]()
    local faceMesh = result:getFaceMeshInfo(faceId - 1)
    if faceMesh == nil then
        return
    end
    self.outputs[1] = faceMesh.vertexes:get(1220 - 33 + 82)
    self.outputs[2] = faceMesh.vertexes:get(1220 - 33 + 83)
    self.outputs[3] = faceMesh.vertexes:get(1220 - 33 + 46)
    self.outputs[4] = faceMesh.vertexes:get(1220 - 33 + 44)
    for i = 1, 4 do
        local vec4 = Amaz.Vector4f(self.outputs[i].x, self.outputs[i].y, self.outputs[i].z, 1.0)
        vec4 = faceMesh.modelMatrix:multiplyVector4(vec4)
        self.outputs[i] = Amaz.Vector3f(vec4.x, vec4.y, vec4.z)
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetNoseKeyPoints3D

