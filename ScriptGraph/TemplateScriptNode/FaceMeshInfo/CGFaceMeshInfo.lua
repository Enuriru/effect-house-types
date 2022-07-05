local CGFaceMeshInfo = CGFaceMeshInfo or {}
CGFaceMeshInfo.__index = CGFaceMeshInfo

function CGFaceMeshInfo.new()
    local self = setmetatable({}, CGFaceMeshInfo)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGFaceMeshInfo:setNext(index, func)
    self.nexts[index] = func
end

function CGFaceMeshInfo:setInput(index, func)
    self.inputs[index] = func
end

function CGFaceMeshInfo:getOutput(index)
    return self.outputs[index]
end

function CGFaceMeshInfo:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceMesh = result:getFaceMeshInfo(self.inputs[1]())
    if faceMesh == nil then
        return
    end
    self.outputs[1] = faceMesh.vertexes
    self.outputs[2] = faceMesh.landmarks
    self.outputs[3] = faceMesh.param
    self.outputs[4] = faceMesh.normals
    self.outputs[5] = faceMesh.tangents
    self.outputs[6] = faceMesh.mvp
    self.outputs[7] = faceMesh.modelMatrix
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGFaceMeshInfo
