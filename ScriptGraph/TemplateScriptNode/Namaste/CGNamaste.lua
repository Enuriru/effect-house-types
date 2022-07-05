local CGNamaste = CGNamaste or {}
CGNamaste.__index = CGNamaste

function CGNamaste.new()
    local self = setmetatable({}, CGNamaste)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGNamaste:setNext(index, func)
    self.nexts[index] = func
end

function CGNamaste:setInput(index, func)
    self.inputs[index] = func
end

function CGNamaste:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.NAMASTE
    if self.handAction ~= "NAMASTE" and has_action then
        self.handAction = "NAMASTE"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "NAMASTE" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGNamaste
