local CGIndexFingerUp = CGIndexFingerUp or {}
CGIndexFingerUp.__index = CGIndexFingerUp

function CGIndexFingerUp.new()
    local self = setmetatable({}, CGIndexFingerUp)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGIndexFingerUp:setNext(index, func)
    self.nexts[index] = func
end

function CGIndexFingerUp:setInput(index, func)
    self.inputs[index] = func
end

function CGIndexFingerUp:update()
    if self.nexts[0] == nil and self.nexts[1] == nil and self.nexts[2] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.INDEX_FINGER_UP
    if self.handAction ~= "INDEX_FINGER_UP" and has_action then
        self.handAction = "INDEX_FINGER_UP"
        if self.nexts[0] then
            self.nexts[0]()
        end
        if self.nexts[1] then
            self.nexts[1]()
        end
    elseif self.handAction == "INDEX_FINGER_UP" and has_action then
        self.handAction = "INDEX_FINGER_UP"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "INDEX_FINGER_UP" and not has_action then
        self.handAction = ""
        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end
return CGIndexFingerUp
