local CGGetEyeKeyPoints3D = CGGetEyeKeyPoints3D or {}
CGGetEyeKeyPoints3D.__index = CGGetEyeKeyPoints3D

function CGGetEyeKeyPoints3D.new()
    local self = setmetatable({}, CGGetEyeKeyPoints3D)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetEyeKeyPoints3D:setNext(index, func)
    self.nexts[index] = func
end

function CGGetEyeKeyPoints3D:setInput(index, func)
    self.inputs[index] = func
end

function CGGetEyeKeyPoints3D:getOutput(index)
    return self.outputs[index]
end

function CGGetEyeKeyPoints3D:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceId = self.inputs[1]()
    local faceMesh = result:getFaceMeshInfo(faceId - 1)
    local eye = self.inputs[2]()
    if faceMesh == nil then
        return
    end
    if eye == "Left" then
        self.outputs[1] = faceMesh.vertexes:get(1220 - 33 + 55)
        self.outputs[2] = faceMesh.vertexes:get(1220 - 33 + 52)
        local temp1 = faceMesh.vertexes:get(1220 - 33 + 72)
        local temp2 = faceMesh.vertexes:get(1220 - 33 + 73)
        self.outputs[3] = Amaz.Vector3f((temp1.x + temp2.x) / 2, (temp1.y + temp2.y) / 2, (temp1.z + temp2.z) / 2)
    else
        self.outputs[1] = faceMesh.vertexes:get(1220 - 33 + 58)  
        self.outputs[2] = faceMesh.vertexes:get(1220 - 33 + 61)
        local temp1 = faceMesh.vertexes:get(1220 - 33 + 75)
        local temp2 = faceMesh.vertexes:get(1220 - 33 + 76)
        self.outputs[3] = Amaz.Vector3f((temp1.x + temp2.x) / 2, (temp1.y + temp2.y) / 2, (temp1.z + temp2.z) / 2)
    end
    self.outputs[4] = faceMesh.vertexes:get(1220 - 33 + 43)
    for i = 1, 4 do
        local vec4 = Amaz.Vector4f(self.outputs[i].x, self.outputs[i].y, self.outputs[i].z, 1.0)
        vec4 = faceMesh.modelMatrix:multiplyVector4(vec4)
        self.outputs[i] = Amaz.Vector3f(vec4.x, vec4.y, vec4.z)
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetEyeKeyPoints3D

