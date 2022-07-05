local CGSkeletonInfo = CGSkeletonInfo or {}
CGSkeletonInfo.__index = CGSkeletonInfo

function CGSkeletonInfo.new()
    local self = setmetatable({}, CGSkeletonInfo)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGSkeletonInfo:setNext(index, func)
    self.nexts[index] = func
end

function CGSkeletonInfo:setInput(index, func)
    self.inputs[index] = func
end

function CGSkeletonInfo:getOutput(index)
    return self.outputs[index]
end

function CGSkeletonInfo:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local skeleton = result:getSkeletonInfo(self.inputs[1]())
    if skeleton == nil then
        return
    end
    self.outputs[1] = skeleton.rect
    self.outputs[2] = skeleton.key_points_xy
    self.outputs[3] = skeleton.key_points_detected
    self.outputs[4] = skeleton.key_points_score
    self.outputs[5] = skeleton.orientation
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGSkeletonInfo
