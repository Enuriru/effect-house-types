local CGFootInfo = CGFootInfo or {}
CGFootInfo.__index = CGFootInfo

function CGFootInfo.new()
    local self = setmetatable({}, CGFootInfo)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGFootInfo:setNext(index, func)
    self.nexts[index] = func
end

function CGFootInfo:setInput(index, func)
    self.inputs[index] = func
end

function CGFootInfo:getOutput(index)
    return self.outputs[index]
end

function CGFootInfo:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local foot = result:getFootInfo(self.inputs[1]())
    if foot == nil then
        return nil
    end
    self.outputs[1] = foot.box
    self.outputs[2] = foot.left_prob
    self.outputs[3] = foot.foot_prob
    self.outputs[4] = foot.is_left
    self.outputs[5] = foot.key_points_xy
    self.outputs[6] = foot.key_points_is_detect
    self.outputs[7] = foot.shankOrient
    self.outputs[8] = foot.shankVisible
    self.outputs[9] = foot.segment
    self.outputs[10] = foot.segmentBro
    self.outputs[11] = foot.segment_box
    self.outputs[12] = foot.transMat
    self.outputs[13] = foot.u_Model
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGFootInfo