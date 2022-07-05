local CGPalmDown = CGPalmDown or {}
CGPalmDown.__index = CGPalmDown

function CGPalmDown.new()
    local self = setmetatable({}, CGPalmDown)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGPalmDown:setNext(index, func)
    self.nexts[index] = func
end

function CGPalmDown:setInput(index, func)
    self.inputs[index] = func
end

function CGPalmDown:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.PALM_DOWN
    if self.handAction ~= "PALM_DOWN" and has_action then
        self.handAction = "PALM_DOWN"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "PALM_DOWN" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGPalmDown
