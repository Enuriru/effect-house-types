local CGGetMiddleFingerKeyPoints = CGGetMiddleFingerKeyPoints or {}
CGGetMiddleFingerKeyPoints.__index = CGGetMiddleFingerKeyPoints

function CGGetMiddleFingerKeyPoints.new()
    local self = setmetatable({}, CGGetMiddleFingerKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetMiddleFingerKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetMiddleFingerKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetMiddleFingerKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetMiddleFingerKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local handId = self.inputs[1]()
    local hand = result:getHandInfo(handId - 1)
    if hand == nil then
        return
    end
    self.outputs[1] = hand.key_points_xy:get(12)
    self.outputs[2] = hand.key_points_xy:get(11)
    self.outputs[3] = hand.key_points_xy:get(10)
    for i = 1, 3 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetMiddleFingerKeyPoints

