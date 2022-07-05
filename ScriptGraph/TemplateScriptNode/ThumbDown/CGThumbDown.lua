local CGThumbDown = CGThumbDown or {}
CGThumbDown.__index = CGThumbDown

function CGThumbDown.new()
    local self = setmetatable({}, CGThumbDown)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGThumbDown:setNext(index, func)
    self.nexts[index] = func
end

function CGThumbDown:setInput(index, func)
    self.inputs[index] = func
end

function CGThumbDown:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.THUMB_DOWN
    if self.handAction ~= "THUMB_DOWN" and has_action then
        self.handAction = "THUMB_DOWN"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "THUMB_DOWN" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGThumbDown
