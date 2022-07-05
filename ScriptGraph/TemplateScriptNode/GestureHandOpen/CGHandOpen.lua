local CGHandOpen = CGHandOpen or {}
CGHandOpen.__index = CGHandOpen

function CGHandOpen.new()
    local self = setmetatable({}, CGHandOpen)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGHandOpen:setNext(index, func)
    self.nexts[index] = func
end

function CGHandOpen:setInput(index, func)
    self.inputs[index] = func
end

function CGHandOpen:update()
    if self.nexts[0] == nil and self.nexts[1] == nil and self.nexts[2] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.HAND_OPEN
    if self.handAction ~= "HAND_OPEN" and has_action then
        self.handAction = "HAND_OPEN"
        if self.nexts[0] then
            self.nexts[0]()
        end
        if self.nexts[1] then
            self.nexts[1]()
        end
    elseif self.handAction == "HAND_OPEN" and has_action then
        self.handAction = "HAND_OPEN"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "HAND_OPEN" and not has_action then
        self.handAction = ""
        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end
return CGHandOpen
