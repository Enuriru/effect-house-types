local CGGetLittleFingerKeyPoints = CGGetLittleFingerKeyPoints or {}
CGGetLittleFingerKeyPoints.__index = CGGetLittleFingerKeyPoints

function CGGetLittleFingerKeyPoints.new()
    local self = setmetatable({}, CGGetLittleFingerKeyPoints)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGGetLittleFingerKeyPoints:setNext(index, func)
    self.nexts[index] = func
end

function CGGetLittleFingerKeyPoints:setInput(index, func)
    self.inputs[index] = func
end

function CGGetLittleFingerKeyPoints:getOutput(index)
    return self.outputs[index]
end

function CGGetLittleFingerKeyPoints:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local handId = self.inputs[1]()
    local hand = result:getHandInfo(handId - 1)
    if hand == nil then
        return
    end
    self.outputs[1] = hand.key_points_xy:get(20)
    self.outputs[2] = hand.key_points_xy:get(19)
    self.outputs[3] = hand.key_points_xy:get(18)
    for i = 1, 3 do
        self.outputs[i].y = 1 - self.outputs[i].y
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGGetLittleFingerKeyPoints

