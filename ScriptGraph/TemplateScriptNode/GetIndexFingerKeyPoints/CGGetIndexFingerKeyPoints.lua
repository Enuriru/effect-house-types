local CGGetIndexFingerKeyPoints = CGGetIndexFingerKeyPoints or {}
CGGetIndexFingerKeyPoints.__index = CGGetIndexFingerKeyPoints

function CGGetIndexFingerKeyPoints.new()
    local self = setmetatable({}, CGGetIndexFingerKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetIndexFingerKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetIndexFingerKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetIndexFingerKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetIndexFingerKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local handId = self.inputs[1]()
    local hand = result:getHandInfo(handId - 1)
    if hand == nil then
        return
    end
    self.outputs[1] = hand.key_points_xy:get(8)
    self.outputs[2] = hand.key_points_xy:get(7)
    self.outputs[3] = hand.key_points_xy:get(6)
    for i = 1, 3 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetIndexFingerKeyPoints

