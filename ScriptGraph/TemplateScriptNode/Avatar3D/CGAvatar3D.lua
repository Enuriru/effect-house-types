local CGAvatar3D = CGAvatar3D or {}
CGAvatar3D.__index = CGAvatar3D

function CGAvatar3D.new()
    local self = setmetatable({}, CGAvatar3D)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGAvatar3D:setNext(index, func)
    self.nexts[index] = func
end

function CGAvatar3D:setInput(index, func)
    self.inputs[index] = func
end

function CGAvatar3D:getOutput(index)
    return self.outputs[index]
end

function CGAvatar3D:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local avatar = result:getAvatar3DInfo(self.inputs[1]())
    if avatar == nil then
        return
    end
    self.outputs[1] = avatar.quaternion
    self.outputs[2] = avatar.root
    self.outputs[3] = avatar.valid
    self.outputs[4] = avatar.is_detected
    self.outputs[5] = avatar.focal_length
    self.outputs[6] = avatar.joints
    self.outputs[7] = avatar.imageWidth
    self.outputs[8] = avatar.imageHeight
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGAvatar3D
