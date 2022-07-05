local CGSkeletonPose3DInfo = CGSkeletonPose3DInfo or {}
CGSkeletonPose3DInfo.__index = CGSkeletonPose3DInfo

function CGSkeletonPose3DInfo.new()
    local self = setmetatable({}, CGSkeletonPose3DInfo)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGSkeletonPose3DInfo:setNext(index, func)
    self.nexts[index] = func
end

function CGSkeletonPose3DInfo:setInput(index, func)
    self.inputs[index] = func
end

function CGSkeletonPose3DInfo:getOutput(index)
    return self.outputs[index]
end

function CGSkeletonPose3DInfo:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local skeleton = result:getSkeletonPose3DInfo(self.inputs[1]())
    if skeleton == nil then
        return
    end
    self.outputs[1] = skeleton.pose3d
    self.outputs[2] = skeleton.fused3d
    self.outputs[3] = skeleton.skeleton2d_points
    self.outputs[4] = skeleton.skeleton2d_detecteds
    self.outputs[5] = skeleton.detected
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGSkeletonPose3DInfo
