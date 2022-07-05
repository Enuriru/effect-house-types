local CGHeartC = CGHeartC or {}
CGHeartC.__index = CGHeartC

function CGHeartC.new()
    local self = setmetatable({}, CGHeartC)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGHeartC:setNext(index, func)
    self.nexts[index] = func
end

function CGHeartC:setInput(index, func)
    self.inputs[index] = func
end

function CGHeartC:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.HEART_C
    if self.handAction ~= "HEART_C" and has_action then
        self.handAction = "HEART_C"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "HEART_C" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGHeartC
