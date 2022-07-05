local CGThumbUp = CGThumbUp or {}
CGThumbUp.__index = CGThumbUp

function CGThumbUp.new()
    local self = setmetatable({}, CGThumbUp)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGThumbUp:setNext(index, func)
    self.nexts[index] = func
end

function CGThumbUp:setInput(index, func)
    self.inputs[index] = func
end

function CGThumbUp:update()
    if self.nexts[0] == nil and self.nexts[1] == nil and self.nexts[2] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.THUMB_UP
    if self.handAction ~= "THUMB_UP" and has_action then
        self.handAction = "THUMB_UP"
        if self.nexts[0] then
            self.nexts[0]()
        end
        if self.nexts[1] then
            self.nexts[1]()
        end
    elseif self.handAction == "THUMB_UP" and has_action then
        self.handAction = "THUMB_UP"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "THUMB_UP" and not has_action then
        self.handAction = ""
        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end
return CGThumbUp
