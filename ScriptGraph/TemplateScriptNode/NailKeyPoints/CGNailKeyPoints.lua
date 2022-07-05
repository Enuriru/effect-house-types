local CGNailKeyPoints = CGNailKeyPoints or {}
CGNailKeyPoints.__index = CGNailKeyPoints

function CGNailKeyPoints.new()
    local self = setmetatable({}, CGNailKeyPoints)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGNailKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGNailKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGNailKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGNailKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local nailPoints = result:getNailKeyPointInfo(self.inputs[1]())
    if nailPoints == nil then
        return
    end
    self.outputs[1] = nailPoints.nailRect
    self.outputs[2] = nailPoints.kpts
    self.outputs[3] = nailPoints.cls
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGNailKeyPoints
