local CGFaceInfo = CGFaceInfo or {}
CGFaceInfo.__index = CGFaceInfo

function CGFaceInfo.new()
    local self = setmetatable({}, CGFaceInfo)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGFaceInfo:setNext(index, func)
    self.nexts[index] = func
end

function CGFaceInfo:setInput(index, func)
    self.inputs[index] = func
end

function CGFaceInfo:getOutput(index)
    return self.outputs[index]
end

function CGFaceInfo:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face.rect;
    self.outputs[2] = face.yaw;
    self.outputs[3] = face.roll;
    self.outputs[4] = face.pitch;
    self.outputs[5] = face.points_array;
    self.outputs[6] = face.visibility_array;
    self.outputs[7] = face.eye_dist;
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGFaceInfo
