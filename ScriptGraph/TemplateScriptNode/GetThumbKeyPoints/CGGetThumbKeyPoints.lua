local CGGetThumbKeyPoints = CGGetThumbKeyPoints or {}
CGGetThumbKeyPoints.__index = CGGetThumbKeyPoints

function CGGetThumbKeyPoints.new()
    local self = setmetatable({}, CGGetThumbKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetThumbKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetThumbKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetThumbKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetThumbKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local handId = self.inputs[1]()
    local hand = result:getHandInfo(handId - 1)
    if hand == nil then
        return
    end
    self.outputs[1] = hand.key_points_xy:get(4)
    self.outputs[2] = hand.key_points_xy:get(3)
    self.outputs[3] = hand.key_points_xy:get(2)
    for i = 1, 3 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetThumbKeyPoints

