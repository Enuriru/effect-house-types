local CGHeartD = CGHeartD or {}
CGHeartD.__index = CGHeartD

function CGHeartD.new()
    local self = setmetatable({}, CGHeartD)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGHeartD:setNext(index, func)
    self.nexts[index] = func
end

function CGHeartD:setInput(index, func)
    self.inputs[index] = func
end

function CGHeartD:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.HEART_D
    if self.handAction ~= "HEART_D" and has_action then
        self.handAction = "HEART_D"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "HEART_D" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGHeartD
