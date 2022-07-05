local CGPistol = CGPistol or {}
CGPistol.__index = CGPistol

function CGPistol.new()
    local self = setmetatable({}, CGPistol)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGPistol:setNext(index, func)
    self.nexts[index] = func
end

function CGPistol:setInput(index, func)
    self.inputs[index] = func
end

function CGPistol:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.PISTOL
    if self.handAction ~= "PISTOL" and has_action then
        self.handAction = "PISTOL"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "PISTOL" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGPistol
