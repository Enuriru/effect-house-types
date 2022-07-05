local CGSwear = CGSwear or {}
CGSwear.__index = CGSwear

function CGSwear.new()
    local self = setmetatable({}, CGSwear)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGSwear:setNext(index, func)
    self.nexts[index] = func
end

function CGSwear:setInput(index, func)
    self.inputs[index] = func
end

function CGSwear:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.SWEAR
    if self.handAction ~= "SWEAR" and has_action then
        self.handAction = "SWEAR"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "SWEAR" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGSwear
