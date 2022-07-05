local CGSpread = CGSpread or {}
CGSpread.__index = CGSpread

function CGSpread.new()
    local self = setmetatable({}, CGSpread)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGSpread:setNext(index, func)
    self.nexts[index] = func
end

function CGSpread:setInput(index, func)
    self.inputs[index] = func
end

function CGSpread:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.SPREAD
    if self.handAction ~= "SPREAD" and has_action then
        self.handAction = "SPREAD"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "SPREAD" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGSpread
