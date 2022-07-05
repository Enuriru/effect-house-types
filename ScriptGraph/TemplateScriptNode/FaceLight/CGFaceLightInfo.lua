local CGFaceLightInfo = CGFaceLightInfo or {}
CGFaceLightInfo.__index = CGFaceLightInfo

function CGFaceLightInfo.new()
    local self = setmetatable({}, CGFaceLightInfo)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGFaceLightInfo:setNext(index, func)
    self.nexts[index] = func
end

function CGFaceLightInfo:setInput(index, func)
    self.inputs[index] = func
end

function CGFaceLightInfo:getOutput(index)
    return self.outputs[index]
end

function CGFaceLightInfo:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceLight = result:getFaceLightInfo(self.inputs[1]())
    if faceLight == nil then
        return
    end
    self.outputs[1] = faceLight.has_lighting
    self.outputs[2] = faceLight.SH_Light_RGB
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGFaceLightInfo
