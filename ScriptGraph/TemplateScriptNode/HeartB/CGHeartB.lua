local CGHeartB = CGHeartB or {}
CGHeartB.__index = CGHeartB

function CGHeartB.new()
    local self = setmetatable({}, CGHeartB)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGHeartB:setNext(index, func)
    self.nexts[index] = func
end

function CGHeartB:setInput(index, func)
    self.inputs[index] = func
end

function CGHeartB:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.HEART_B
    if self.handAction ~= "HEART_B" and has_action then
        self.handAction = "HEART_B"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "HEART_B" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGHeartB
