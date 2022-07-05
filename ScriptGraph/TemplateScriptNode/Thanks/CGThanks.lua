local CGThanks = CGThanks or {}
CGThanks.__index = CGThanks

function CGThanks.new()
    local self = setmetatable({}, CGThanks)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGThanks:setNext(index, func)
    self.nexts[index] = func
end

function CGThanks:setInput(index, func)
    self.inputs[index] = func
end

function CGThanks:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.BEG
    if self.handAction ~= "THANKS" and has_action then
        self.handAction = "THANKS"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "THANKS" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGThanks
