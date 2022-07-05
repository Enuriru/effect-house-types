local CGTeethInfo = CGTeethInfo or {}
CGTeethInfo.__index = CGTeethInfo

function CGTeethInfo.new()
    local self = setmetatable({}, CGTeethInfo)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGTeethInfo:setNext(index, func)
    self.nexts[index] = func
end

function CGTeethInfo:setInput(index, func)
    self.inputs[index] = func
end

function CGTeethInfo:getOutput(index)
    return self.outputs[index]
end

function CGTeethInfo:executee()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local teeth = result:getTeethInfo(self.inputs[1]())
    if teeth == nil then
        return
    end
    self.outputs[1] = teeth.face_id
    self.outputs[2] = teeth.teeth_pts
    self.outputs[3] = teeth.face_count
    self.outputs[4] = teeth.image_width
    self.outputs[5] = teeth.image_height
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGTeethInfo
