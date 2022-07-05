local CGFour = CGFour or {}
CGFour.__index = CGFour

function CGFour.new()
    local self = setmetatable({}, CGFour)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGFour:setNext(index, func)
    self.nexts[index] = func
end

function CGFour:setInput(index, func)
    self.inputs[index] = func
end

function CGFour:update()
    if self.nexts[0] == nil and self.nexts[1] == nil and self.nexts[2] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.FOUR
    if self.handAction ~= "FOUR" and has_action then
        self.handAction = "FOUR"
        if self.nexts[0] then
            self.nexts[0]()
        end
        if self.nexts[1] then
            self.nexts[1]()
        end
    elseif self.handAction == "FOUR" and has_action then
        self.handAction = "FOUR"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "FOUR" and not has_action then
        self.handAction = ""
        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end

return CGFour
