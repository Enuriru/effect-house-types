local CGHeartA = CGHeartA or {}
CGHeartA.__index = CGHeartA

function CGHeartA.new()
    local self = setmetatable({}, CGHeartA)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGHeartA:setNext(index, func)
    self.nexts[index] = func
end

function CGHeartA:setInput(index, func)
    self.inputs[index] = func
end

function CGHeartA:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.HEART_A
    if self.handAction ~= "HEART_A" and has_action then
        self.handAction = "HEART_A"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "HEART_A" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGHeartA
