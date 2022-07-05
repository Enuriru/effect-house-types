local CGPalmUp = CGPalmUp or {}
CGPalmUp.__index = CGPalmUp

function CGPalmUp.new()
    local self = setmetatable({}, CGPalmUp)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGPalmUp:setNext(index, func)
    self.nexts[index] = func
end

function CGPalmUp:setInput(index, func)
    self.inputs[index] = func
end

function CGPalmUp:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.PLAM_UP
    if self.handAction ~= "PALM_UP" and has_action then
        self.handAction = "PALM_UP"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "PALM_UP" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGPalmUp
