local CGPistol2 = CGPistol2 or {}
CGPistol2.__index = CGPistol2

function CGPistol2.new()
    local self = setmetatable({}, CGPistol2)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGPistol2:setNext(index, func)
    self.nexts[index] = func
end

function CGPistol2:setInput(index, func)
    self.inputs[index] = func
end

function CGPistol2:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.PISTOL2
    if self.handAction ~= "PISTOL2" and has_action then
        self.handAction = "PISTOL2"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "PISTOL2" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGPistol2
