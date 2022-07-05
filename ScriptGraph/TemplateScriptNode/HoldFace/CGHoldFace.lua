local CGHoldFace = CGHoldFace or {}
CGHoldFace.__index = CGHoldFace

function CGHoldFace.new()
    local self = setmetatable({}, CGHoldFace)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGHoldFace:setNext(index, func)
    self.nexts[index] = func
end

function CGHoldFace:setInput(index, func)
    self.inputs[index] = func
end

function CGHoldFace:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.HOLDFACE
    if self.handAction ~= "HOLDFACE" and has_action then
        self.handAction = "HOLDFACE"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "HOLDFACE" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGHoldFace
