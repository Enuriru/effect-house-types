local CGHandInfo = CGHandInfo or {}
CGHandInfo.__index = CGHandInfo

function CGHandInfo.new()
    local self = setmetatable({}, CGHandInfo)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGHandInfo:setNext(index, func)
    self.nexts[index] = func
end

function CGHandInfo:setInput(index, func)
    self.inputs[index] = func
end

function CGHandInfo:getOutput(index)
    return self.outputs[index]
end

function CGHandInfo:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[1]())
    if hand == nil then
        return
    end
    self.outputs[1] = hand.rect;
    self.outputs[2] = hand.rot_angle;
    self.outputs[3] = hand.key_points_xy;
    self.outputs[4] = hand.scale;
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGHandInfo
