local CGBeg = CGBeg or {}
CGBeg.__index = CGBeg

function CGBeg.new()
    local self = setmetatable({}, CGBeg)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGBeg:setNext(index, func)
    self.nexts[index] = func
end

function CGBeg:setInput(index, func)
    self.inputs[index] = func
end

function CGBeg:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.THANKS
    if self.handAction ~= "BEG" and has_action then
        self.handAction = "BEG"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "BEG" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGBeg
