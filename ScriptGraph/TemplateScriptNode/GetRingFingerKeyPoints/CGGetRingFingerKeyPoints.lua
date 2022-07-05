local CGGetRingFingerKeyPoints = CGGetRingFingerKeyPoints or {}
CGGetRingFingerKeyPoints.__index = CGGetRingFingerKeyPoints

function CGGetRingFingerKeyPoints.new()
    local self = setmetatable({}, CGGetRingFingerKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetRingFingerKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetRingFingerKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetRingFingerKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetRingFingerKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local handId = self.inputs[1]()
    local hand = result:getHandInfo(handId - 1)
    if hand == nil then
        return
    end
    self.outputs[1] = hand.key_points_xy:get(16)
    self.outputs[2] = hand.key_points_xy:get(15)
    self.outputs[3] = hand.key_points_xy:get(14)
    for i = 1, 3 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetRingFingerKeyPoints

